package app

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"englishlover/backend/internal/domain"
	"englishlover/backend/internal/platform/config"
	"englishlover/backend/internal/platform/httpx"
	"englishlover/backend/internal/platform/migrate"
	"englishlover/backend/internal/store"
)

type App struct {
	cfg   config.Config
	store store.Store
}

func NewRouter(cfg config.Config) http.Handler {
	appStore := mustBuildStore(cfg)
	return NewRouterWithStore(cfg, appStore)
}

func NewRouterWithStore(cfg config.Config, appStore store.Store) http.Handler {
	app := App{cfg: cfg, store: appStore}
	router := chi.NewRouter()
	router.Use(httpx.RequestID)

	router.Route("/api/v1", func(api chi.Router) {
		api.Get("/health", app.health)
		api.Post("/auth/login", app.login)
		api.Post("/auth/refresh", app.refreshAuthToken)
		api.Post("/auth/logout", app.logout)
		api.Get("/auth/me", app.getCurrentUser)
		api.Get("/words", app.listWords)
		api.Post("/reviews/submit", app.submitReview)
		api.Get("/review-events", app.listReviewEvents)
		api.Get("/reading/articles", app.listReadingArticles)
		api.Get("/reading/articles/{articleId}", app.getReadingArticle)
		api.Post("/reading/articles/{articleId}/words/{wordId}/queue", app.addToWordLearningQueue)
		api.Get("/penpal/threads", app.listPenpalThreads)
		api.Post("/penpal/letters", app.sendPenpalLetter)
		api.Get("/analytics/daily-summary", app.getDailySummary)
	})

	return router
}

func mustBuildStore(cfg config.Config) store.Store {
	if cfg.DatabaseURL == "" {
		panic("DATABASE_URL is required for backend API")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		panic(err)
	}
	if cfg.AutoMigrate {
		if err := migrate.Run(ctx, pool); err != nil {
			panic(err)
		}
	}
	postgresStore := store.NewPostgres(pool)
	if err := postgresStore.EnsureContractTestData(ctx, cfg.ContractTestEmail, cfg.ContractTestPassword); err != nil {
		panic(err)
	}
	return postgresStore
}

func (a App) health(w http.ResponseWriter, r *http.Request) {
	httpx.WriteJSON(w, r, http.StatusOK, map[string]string{
		"status":  "ok",
		"service": "englishlover-api",
		"version": a.cfg.AppVersion,
	}, nil)
}

func (a App) login(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if !decode(w, r, &input) {
		return
	}
	if input.Email == "" || len(input.Password) < 8 {
		validation(w, r, "email and password are required")
		return
	}
	user, err := a.store.Authenticate(r.Context(), input.Email, input.Password)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	session, err := a.store.CreateSession(r.Context(), user.UserID)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	a.setSessionCookies(w, session)
	httpx.WriteJSON(w, r, http.StatusOK, map[string]any{"user": session.User}, nil)
}

func (a App) refreshAuthToken(w http.ResponseWriter, r *http.Request) {
	session, err := a.store.RefreshSession(r.Context(), cookieValue(r, "refresh_token"))
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	a.setSessionCookies(w, session)
	httpx.WriteJSON(w, r, http.StatusOK, map[string]any{"user": session.User}, nil)
}

func (a App) logout(w http.ResponseWriter, r *http.Request) {
	token := cookieValue(r, "refresh_token")
	if token == "" {
		token = cookieValue(r, "access_token")
	}
	if err := a.store.RevokeSession(r.Context(), token); err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	a.clearSessionCookies(w)
	httpx.WriteNoContent(w, r)
}

func (a App) getCurrentUser(w http.ResponseWriter, r *http.Request) {
	user, ok := a.requireUser(w, r)
	if !ok {
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, user, nil)
}

func (a App) listWords(w http.ResponseWriter, r *http.Request) {
	if _, ok := a.requireUser(w, r); !ok {
		return
	}
	page, pageSize, err := httpx.PageParams(r)
	if err != nil {
		validation(w, r, err.Error())
		return
	}
	result, err := a.store.ListWords(r.Context(), r.URL.Query().Get("stage"), page, pageSize)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) submitReview(w http.ResponseWriter, r *http.Request) {
	user, ok := a.requireUser(w, r)
	if !ok {
		return
	}
	body, ok := readBody(w, r)
	if !ok {
		return
	}
	var input store.ReviewSubmitInput
	if !unmarshalBody(w, r, body, &input) {
		return
	}
	if input.WordID == "" || !allowed(input.Mode, "recognition", "recall", "spelling") || input.Rating < 1 || input.Rating > 5 || input.DurationMs < 0 || input.ClientOccurredAt.IsZero() {
		validation(w, r, "invalid review submit payload")
		return
	}
	result, err := a.store.SubmitReview(r.Context(), user.UserID, idempotencyKey(r), store.HashPayload(body), input)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) listReviewEvents(w http.ResponseWriter, r *http.Request) {
	user, ok := a.requireUser(w, r)
	if !ok {
		return
	}
	limit, err := httpx.LimitParam(r)
	if err != nil {
		validation(w, r, err.Error())
		return
	}
	result, err := a.store.ListReviewEvents(r.Context(), user.UserID, r.URL.Query().Get("cursor"), limit)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) listReadingArticles(w http.ResponseWriter, r *http.Request) {
	if _, ok := a.requireUser(w, r); !ok {
		return
	}
	page, pageSize, err := httpx.PageParams(r)
	if err != nil {
		validation(w, r, err.Error())
		return
	}
	result, err := a.store.ListReadingArticles(r.Context(), page, pageSize)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) getReadingArticle(w http.ResponseWriter, r *http.Request) {
	if _, ok := a.requireUser(w, r); !ok {
		return
	}
	result, err := a.store.GetReadingArticle(r.Context(), chi.URLParam(r, "articleId"))
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) addToWordLearningQueue(w http.ResponseWriter, r *http.Request) {
	user, ok := a.requireUser(w, r)
	if !ok {
		return
	}
	body := []byte("{}")
	result, err := a.store.AddToWordLearningQueue(r.Context(), user.UserID, chi.URLParam(r, "articleId"), chi.URLParam(r, "wordId"), idempotencyKey(r), store.HashPayload(body))
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) listPenpalThreads(w http.ResponseWriter, r *http.Request) {
	user, ok := a.requireUser(w, r)
	if !ok {
		return
	}
	page, pageSize, err := httpx.PageParams(r)
	if err != nil {
		validation(w, r, err.Error())
		return
	}
	result, err := a.store.ListPenpalThreads(r.Context(), user.UserID, page, pageSize)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) sendPenpalLetter(w http.ResponseWriter, r *http.Request) {
	user, ok := a.requireUser(w, r)
	if !ok {
		return
	}
	body, ok := readBody(w, r)
	if !ok {
		return
	}
	var input store.SendPenpalLetterInput
	if !unmarshalBody(w, r, body, &input) {
		return
	}
	if input.ThreadID == "" || strings.TrimSpace(input.Body) == "" || len(input.Body) > 2000 {
		validation(w, r, "threadId and body are required")
		return
	}
	result, err := a.store.SendPenpalLetter(r.Context(), user.UserID, idempotencyKey(r), store.HashPayload(body), input)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) getDailySummary(w http.ResponseWriter, r *http.Request) {
	user, ok := a.requireUser(w, r)
	if !ok {
		return
	}
	date := r.URL.Query().Get("date")
	if date == "" {
		validation(w, r, "date is required")
		return
	}
	result, err := a.store.GetDailySummary(r.Context(), user.UserID, date)
	if err != nil {
		a.writeStoreError(w, r, err)
		return
	}
	httpx.WriteJSON(w, r, http.StatusOK, result, nil)
}

func (a App) requireUser(w http.ResponseWriter, r *http.Request) (domain.UserProfile, bool) {
	user, err := a.store.UserByAccessToken(r.Context(), cookieValue(r, "access_token"))
	if err != nil {
		a.writeStoreError(w, r, err)
		return domain.UserProfile{}, false
	}
	return user, true
}

func (a App) setSessionCookies(w http.ResponseWriter, session store.Session) {
	setCookie(w, "access_token", session.AccessToken, session.AccessTTL, a.cfg.CookieSecure)
	setCookie(w, "refresh_token", session.RefreshToken, session.RefreshTTL, a.cfg.CookieSecure)
}

func (a App) clearSessionCookies(w http.ResponseWriter) {
	setCookie(w, "access_token", "", -time.Hour, a.cfg.CookieSecure)
	setCookie(w, "refresh_token", "", -time.Hour, a.cfg.CookieSecure)
}

func (a App) writeStoreError(w http.ResponseWriter, r *http.Request, err error) {
	switch {
	case errors.Is(err, store.ErrInvalidCredentials):
		httpx.WriteError(w, r, http.StatusUnauthorized, httpx.ErrorAuthInvalid, "认证凭据无效。", nil)
	case errors.Is(err, store.ErrAuthRequired):
		httpx.WriteError(w, r, http.StatusUnauthorized, httpx.ErrorAuthRequired, "需要登录后访问。", nil)
	case errors.Is(err, store.ErrNotFound):
		httpx.WriteError(w, r, http.StatusNotFound, httpx.ErrorNotFound, "资源不存在。", nil)
	case errors.Is(err, store.ErrValidation):
		httpx.WriteError(w, r, http.StatusBadRequest, httpx.ErrorValidation, "请求参数不合法。", nil)
	case errors.Is(err, store.ErrIdempotencyConflict):
		httpx.WriteError(w, r, http.StatusConflict, httpx.ErrorIdempotency, "幂等键已被不同请求使用。", nil)
	default:
		httpx.WriteError(w, r, http.StatusInternalServerError, httpx.ErrorInternal, "服务器内部错误。", nil)
	}
}

func decode(w http.ResponseWriter, r *http.Request, target any) bool {
	if err := httpx.DecodeJSON(r, target); err != nil {
		validation(w, r, "invalid JSON body")
		return false
	}
	return true
}

func readBody(w http.ResponseWriter, r *http.Request) ([]byte, bool) {
	body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
	if err != nil || len(body) == 0 {
		validation(w, r, "request body is required")
		return nil, false
	}
	return body, true
}

func unmarshalBody(w http.ResponseWriter, r *http.Request, body []byte, target any) bool {
	decoder := json.NewDecoder(strings.NewReader(string(body)))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(target); err != nil {
		validation(w, r, "invalid JSON body")
		return false
	}
	return true
}

func validation(w http.ResponseWriter, r *http.Request, message string) {
	httpx.WriteError(w, r, http.StatusBadRequest, httpx.ErrorValidation, message, nil)
}

func cookieValue(r *http.Request, name string) string {
	cookie, err := r.Cookie(name)
	if err != nil {
		return ""
	}
	return cookie.Value
}

func idempotencyKey(r *http.Request) string {
	return r.Header.Get("Idempotency-Key")
}

func setCookie(w http.ResponseWriter, name string, value string, ttl time.Duration, secure bool) {
	cookie := &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: http.SameSiteLaxMode,
	}
	if ttl < 0 {
		cookie.MaxAge = -1
		cookie.Expires = time.Unix(0, 0)
	} else {
		cookie.Expires = time.Now().Add(ttl)
		cookie.MaxAge = int(ttl.Seconds())
	}
	http.SetCookie(w, cookie)
}

func allowed(value string, values ...string) bool {
	for _, item := range values {
		if value == item {
			return true
		}
	}
	return false
}
