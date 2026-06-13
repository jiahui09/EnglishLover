package app

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"englishlover/backend/internal/platform/config"
	"englishlover/backend/internal/store"
)

func TestHealthUsesUnifiedEnvelope(t *testing.T) {
	router := NewRouterWithStore(config.Config{AppVersion: "test"}, store.NewMemory())
	response := httptest.NewRecorder()
	router.ServeHTTP(response, httptest.NewRequest(http.MethodGet, "/api/v1/health", nil))
	if response.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}
	var payload struct {
		RequestID string `json:"requestId"`
		Data      struct {
			Status  string `json:"status"`
			Service string `json:"service"`
			Version string `json:"version"`
		} `json:"data"`
	}
	if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
		t.Fatalf("response is not valid JSON: %v", err)
	}
	if payload.RequestID == "" || payload.Data.Status != "ok" || payload.Data.Service != "englishlover-api" || payload.Data.Version != "test" {
		t.Fatalf("unexpected health payload: %+v", payload)
	}
}

func TestBusinessFlowUsesRealHandlers(t *testing.T) {
	router := NewRouterWithStore(config.Config{AppVersion: "test"}, store.NewMemory())
	cookies := login(t, router)

	getOK(t, router, "/api/v1/auth/me", cookies)
	getOK(t, router, "/api/v1/words", cookies)
	getOK(t, router, "/api/v1/reading/articles", cookies)
	getOK(t, router, "/api/v1/reading/articles/00000000-0000-0000-0000-000000000201", cookies)
	postOK(t, router, "/api/v1/reading/articles/00000000-0000-0000-0000-000000000201/words/00000000-0000-0000-0000-000000000101/queue", cookies, "queue-key-1", `{}`)
	postOK(t, router, "/api/v1/reviews/submit", cookies, "review-key-1", `{"wordId":"00000000-0000-0000-0000-000000000101","mode":"recall","rating":4,"isCorrect":true,"durationMs":1200,"clientOccurredAt":"`+time.Now().UTC().Format(time.RFC3339)+`"}`)
	getOK(t, router, "/api/v1/review-events", cookies)
	getOK(t, router, "/api/v1/penpal/threads", cookies)
	postOK(t, router, "/api/v1/penpal/letters", cookies, "letter-key-1", `{"threadId":"00000000-0000-0000-0000-000000000301","body":"Hello from contract test."}`)
	getOK(t, router, "/api/v1/analytics/daily-summary?date=2026-06-13", cookies)
}

func TestAuthAndValidationErrorsUseContractCodes(t *testing.T) {
	router := NewRouterWithStore(config.Config{AppVersion: "test"}, store.NewMemory())
	assertError(t, router, http.MethodGet, "/api/v1/words", nil, nil, http.StatusUnauthorized, "AUTH_REQUIRED")
	assertError(t, router, http.MethodPost, "/api/v1/auth/login", []byte(`{"email":"learner@example.com","password":"wrong-password"}`), nil, http.StatusUnauthorized, "AUTH_INVALID")
	cookies := login(t, router)
	assertError(t, router, http.MethodGet, "/api/v1/words?page=0", nil, cookies, http.StatusBadRequest, "VALIDATION_ERROR")
	assertError(t, router, http.MethodGet, "/api/v1/reading/articles/00000000-0000-0000-0000-000000009999", nil, cookies, http.StatusNotFound, "NOT_FOUND")
}

func TestIdempotencyConflict(t *testing.T) {
	router := NewRouterWithStore(config.Config{AppVersion: "test"}, store.NewMemory())
	cookies := login(t, router)
	path := "/api/v1/reviews/submit"
	first := `{"wordId":"00000000-0000-0000-0000-000000000101","mode":"recall","rating":4,"isCorrect":true,"durationMs":1200,"clientOccurredAt":"2026-06-13T00:00:00Z"}`
	second := `{"wordId":"00000000-0000-0000-0000-000000000101","mode":"recall","rating":3,"isCorrect":true,"durationMs":1200,"clientOccurredAt":"2026-06-13T00:00:00Z"}`
	postOK(t, router, path, cookies, "same-key-1", first)
	assertErrorWithIdempotency(t, router, http.MethodPost, path, []byte(second), cookies, "same-key-1", http.StatusConflict, "IDEMPOTENCY_CONFLICT")
}

func login(t *testing.T, router http.Handler) []*http.Cookie {
	t.Helper()
	request := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBufferString(`{"email":"learner@example.com","password":"learner-password"}`))
	request.Header.Set("Content-Type", "application/json")
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("login failed: %d %s", response.Code, response.Body.String())
	}
	return response.Result().Cookies()
}

func getOK(t *testing.T, router http.Handler, path string, cookies []*http.Cookie) {
	t.Helper()
	request := httptest.NewRequest(http.MethodGet, path, nil)
	for _, cookie := range cookies {
		request.AddCookie(cookie)
	}
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("GET %s failed: %d %s", path, response.Code, response.Body.String())
	}
}

func postOK(t *testing.T, router http.Handler, path string, cookies []*http.Cookie, key string, body string) {
	t.Helper()
	request := httptest.NewRequest(http.MethodPost, path, bytes.NewBufferString(body))
	request.Header.Set("Content-Type", "application/json")
	for _, cookie := range cookies {
		request.AddCookie(cookie)
	}
	request.Header.Set("Idempotency-Key", key)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	if response.Code != http.StatusOK {
		t.Fatalf("POST %s failed: %d %s", path, response.Code, response.Body.String())
	}
}

func assertError(t *testing.T, router http.Handler, method string, path string, body []byte, cookies []*http.Cookie, status int, code string) {
	t.Helper()
	request := httptest.NewRequest(method, path, bytes.NewReader(body))
	request.Header.Set("Content-Type", "application/json")
	for _, cookie := range cookies {
		request.AddCookie(cookie)
	}
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	if response.Code != status {
		t.Fatalf("expected %d, got %d: %s", status, response.Code, response.Body.String())
	}
	var payload struct {
		Error struct {
			Code string `json:"code"`
		} `json:"error"`
	}
	if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
		t.Fatalf("invalid error JSON: %v", err)
	}
	if payload.Error.Code != code {
		t.Fatalf("expected code %s, got %s", code, payload.Error.Code)
	}
}

func assertErrorWithIdempotency(t *testing.T, router http.Handler, method string, path string, body []byte, cookies []*http.Cookie, key string, status int, code string) {
	t.Helper()
	request := httptest.NewRequest(method, path, bytes.NewReader(body))
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Idempotency-Key", key)
	for _, cookie := range cookies {
		request.AddCookie(cookie)
	}
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)
	if response.Code != status {
		t.Fatalf("expected %d, got %d: %s", status, response.Code, response.Body.String())
	}
	var payload struct {
		Error struct {
			Code string `json:"code"`
		} `json:"error"`
	}
	if err := json.Unmarshal(response.Body.Bytes(), &payload); err != nil {
		t.Fatalf("invalid error JSON: %v", err)
	}
	if payload.Error.Code != code {
		t.Fatalf("expected code %s, got %s", code, payload.Error.Code)
	}
}
