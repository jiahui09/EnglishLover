package store

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"

	"englishlover/backend/internal/domain"
)

type PostgresStore struct {
	pool *pgxpool.Pool
	now  func() time.Time
}

func NewPostgres(pool *pgxpool.Pool) *PostgresStore {
	return &PostgresStore{pool: pool, now: time.Now}
}

func (s *PostgresStore) EnsureContractTestData(ctx context.Context, email string, password string) error {
	userID := "00000000-0000-0000-0000-000000000001"
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	_, err = s.pool.Exec(ctx, `
		INSERT INTO users (id, email, display_name, role, password_hash)
		VALUES ($1, $2, $3, 'learner', $4)
		ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, display_name = EXCLUDED.display_name, role = EXCLUDED.role
	`, userID, email, "Contract Learner", string(hashed))
	if err != nil {
		return err
	}
	_, err = s.pool.Exec(ctx, `
		INSERT INTO penpal_threads (id, user_id, status)
		VALUES ('00000000-0000-0000-0000-000000000301', $1, 'active')
		ON CONFLICT (id) DO NOTHING
	`, userID)
	return err
}

func (s *PostgresStore) Authenticate(ctx context.Context, email string, password string) (domain.UserProfile, error) {
	var profile domain.UserProfile
	var hashed string
	err := s.pool.QueryRow(ctx, `SELECT id, email, display_name, role, password_hash FROM users WHERE email = $1`, email).Scan(&profile.UserID, &profile.Email, &profile.DisplayName, &profile.Role, &hashed)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.UserProfile{}, ErrInvalidCredentials
	}
	if err != nil {
		return domain.UserProfile{}, err
	}
	if bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password)) != nil {
		return domain.UserProfile{}, ErrInvalidCredentials
	}
	return profile, nil
}

func (s *PostgresStore) CreateSession(ctx context.Context, userID string) (Session, error) {
	user, err := s.userByID(ctx, userID)
	if err != nil {
		return Session{}, err
	}
	return s.createSessionForUser(ctx, user)
}

func (s *PostgresStore) UserByAccessToken(ctx context.Context, token string) (domain.UserProfile, error) {
	return s.userByToken(ctx, token, true)
}

func (s *PostgresStore) UserByRefreshToken(ctx context.Context, token string) (domain.UserProfile, error) {
	return s.userByToken(ctx, token, false)
}

func (s *PostgresStore) RefreshSession(ctx context.Context, refreshToken string) (Session, error) {
	user, err := s.UserByRefreshToken(ctx, refreshToken)
	if err != nil {
		return Session{}, err
	}
	_, err = s.pool.Exec(ctx, `UPDATE sessions SET revoked_at = now() WHERE refresh_token = $1`, refreshToken)
	if err != nil {
		return Session{}, err
	}
	return s.createSessionForUser(ctx, user)
}

func (s *PostgresStore) RevokeSession(ctx context.Context, token string) error {
	if token == "" {
		return ErrAuthRequired
	}
	_, err := s.pool.Exec(ctx, `UPDATE sessions SET revoked_at = now() WHERE access_token = $1 OR refresh_token = $1`, token)
	return err
}

func (s *PostgresStore) ListWords(ctx context.Context, stage string, page int, pageSize int) (PagedResult[domain.WordSummary], error) {
	if stage != "" && !allowed(stage, "cet4", "cet6", "kaoyan", "toefl", "ielts", "general") {
		return PagedResult[domain.WordSummary]{}, ErrValidation
	}
	offset := (page - 1) * pageSize
	args := []any{pageSize, offset}
	where := ""
	if stage != "" {
		where = "WHERE stage = $3"
		args = append(args, stage)
	}
	var total int
	countSQL := "SELECT count(*) FROM words " + where
	if err := s.pool.QueryRow(ctx, countSQL, args[2:]...).Scan(&total); err != nil {
		return PagedResult[domain.WordSummary]{}, err
	}
	rows, err := s.pool.Query(ctx, "SELECT id, text, phonetic, stage FROM words "+where+" ORDER BY text LIMIT $1 OFFSET $2", args...)
	if err != nil {
		return PagedResult[domain.WordSummary]{}, err
	}
	defer rows.Close()
	items := []domain.WordSummary{}
	for rows.Next() {
		var item domain.WordSummary
		if err := rows.Scan(&item.WordID, &item.Text, &item.Phonetic, &item.Stage); err != nil {
			return PagedResult[domain.WordSummary]{}, err
		}
		items = append(items, item)
	}
	return PagedResult[domain.WordSummary]{Items: items, Page: page, PageSize: pageSize, Total: total}, rows.Err()
}

func (s *PostgresStore) SubmitReview(ctx context.Context, userID string, key string, requestHash string, input ReviewSubmitInput) (ReviewSubmitResult, error) {
	var output ReviewSubmitResult
	status, found, err := s.loadIdempotent(ctx, userID, key, requestHash, &output)
	if err != nil || found {
		_ = status
		return output, err
	}

	var exists bool
	if err := s.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM words WHERE id = $1)`, input.WordID).Scan(&exists); err != nil {
		return ReviewSubmitResult{}, err
	}
	if !exists {
		return ReviewSubmitResult{}, ErrNotFound
	}
	eventID, err := newUUID()
	if err != nil {
		return ReviewSubmitResult{}, err
	}
	nextReviewAt := input.ClientOccurredAt.Add(time.Duration(input.Rating) * 24 * time.Hour)
	_, err = s.pool.Exec(ctx, `
		INSERT INTO review_events (id, user_id, word_id, module, mode, rating, is_correct, duration_ms, occurred_at, next_review_at)
		VALUES ($1, $2, $3, 'word', $4, $5, $6, $7, $8, $9)
	`, eventID, userID, input.WordID, input.Mode, input.Rating, input.IsCorrect, input.DurationMs, input.ClientOccurredAt, nextReviewAt)
	if err != nil {
		return ReviewSubmitResult{}, err
	}
	output = ReviewSubmitResult{ReviewEventID: eventID, Status: "accepted", NextReviewAt: nextReviewAt}
	return output, s.saveIdempotent(ctx, userID, key, requestHash, 200, output)
}

func (s *PostgresStore) ListReviewEvents(ctx context.Context, userID string, cursor string, limit int) (CursorResult[domain.ReviewEvent], error) {
	args := []any{userID, limit + 1}
	where := "WHERE user_id = $1"
	if cursor != "" {
		where += " AND occurred_at < $3"
		parsed, err := time.Parse(time.RFC3339, cursor)
		if err != nil {
			return CursorResult[domain.ReviewEvent]{}, ErrValidation
		}
		args = append(args, parsed)
	}
	rows, err := s.pool.Query(ctx, "SELECT id, module, occurred_at FROM review_events "+where+" ORDER BY occurred_at DESC LIMIT $2", args...)
	if err != nil {
		return CursorResult[domain.ReviewEvent]{}, err
	}
	defer rows.Close()
	items := []domain.ReviewEvent{}
	for rows.Next() {
		var item domain.ReviewEvent
		if err := rows.Scan(&item.EventID, &item.Module, &item.OccurredAt); err != nil {
			return CursorResult[domain.ReviewEvent]{}, err
		}
		items = append(items, item)
	}
	result := CursorResult[domain.ReviewEvent]{Items: items, Cursor: cursor, Limit: limit}
	if len(items) > limit {
		result.NextCursor = items[limit-1].OccurredAt.Format(time.RFC3339)
		result.Items = items[:limit]
	}
	return result, rows.Err()
}

func (s *PostgresStore) ListReadingArticles(ctx context.Context, page int, pageSize int) (PagedResult[domain.ReadingArticleSummary], error) {
	offset := (page - 1) * pageSize
	var total int
	if err := s.pool.QueryRow(ctx, `SELECT count(*) FROM reading_articles`).Scan(&total); err != nil {
		return PagedResult[domain.ReadingArticleSummary]{}, err
	}
	rows, err := s.pool.Query(ctx, `SELECT id, title, level FROM reading_articles ORDER BY title LIMIT $1 OFFSET $2`, pageSize, offset)
	if err != nil {
		return PagedResult[domain.ReadingArticleSummary]{}, err
	}
	defer rows.Close()
	items := []domain.ReadingArticleSummary{}
	for rows.Next() {
		var item domain.ReadingArticleSummary
		if err := rows.Scan(&item.ArticleID, &item.Title, &item.Level); err != nil {
			return PagedResult[domain.ReadingArticleSummary]{}, err
		}
		items = append(items, item)
	}
	return PagedResult[domain.ReadingArticleSummary]{Items: items, Page: page, PageSize: pageSize, Total: total}, rows.Err()
}

func (s *PostgresStore) GetReadingArticle(ctx context.Context, articleID string) (domain.ReadingArticleDetail, error) {
	var item domain.ReadingArticleDetail
	err := s.pool.QueryRow(ctx, `SELECT id, title, content FROM reading_articles WHERE id = $1`, articleID).Scan(&item.ArticleID, &item.Title, &item.Content)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.ReadingArticleDetail{}, ErrNotFound
	}
	return item, err
}

func (s *PostgresStore) AddToWordLearningQueue(ctx context.Context, userID string, articleID string, wordID string, key string, requestHash string) (AddToWordLearningQueueResult, error) {
	var output AddToWordLearningQueueResult
	_, found, err := s.loadIdempotent(ctx, userID, key, requestHash, &output)
	if err != nil || found {
		return output, err
	}
	if err := s.ensureArticleAndWord(ctx, articleID, wordID); err != nil {
		return AddToWordLearningQueueResult{}, err
	}
	queueID, err := newUUID()
	if err != nil {
		return AddToWordLearningQueueResult{}, err
	}
	_, err = s.pool.Exec(ctx, `INSERT INTO word_queue (id, user_id, word_id, article_id, source) VALUES ($1, $2, $3, $4, 'reading')`, queueID, userID, wordID, articleID)
	status := "success"
	if isUniqueViolation(err) {
		status = "duplicate"
	} else if err != nil {
		return AddToWordLearningQueueResult{}, err
	}
	output = AddToWordLearningQueueResult{Status: status, Source: "reading"}
	return output, s.saveIdempotent(ctx, userID, key, requestHash, 200, output)
}

func (s *PostgresStore) ListPenpalThreads(ctx context.Context, userID string, page int, pageSize int) (PagedResult[domain.PenpalThreadSummary], error) {
	offset := (page - 1) * pageSize
	var total int
	if err := s.pool.QueryRow(ctx, `SELECT count(*) FROM penpal_threads WHERE user_id = $1`, userID).Scan(&total); err != nil {
		return PagedResult[domain.PenpalThreadSummary]{}, err
	}
	rows, err := s.pool.Query(ctx, `SELECT id, status FROM penpal_threads WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`, userID, pageSize, offset)
	if err != nil {
		return PagedResult[domain.PenpalThreadSummary]{}, err
	}
	defer rows.Close()
	items := []domain.PenpalThreadSummary{}
	for rows.Next() {
		var item domain.PenpalThreadSummary
		if err := rows.Scan(&item.ThreadID, &item.Status); err != nil {
			return PagedResult[domain.PenpalThreadSummary]{}, err
		}
		items = append(items, item)
	}
	return PagedResult[domain.PenpalThreadSummary]{Items: items, Page: page, PageSize: pageSize, Total: total}, rows.Err()
}

func (s *PostgresStore) SendPenpalLetter(ctx context.Context, userID string, key string, requestHash string, input SendPenpalLetterInput) (SendPenpalLetterResult, error) {
	var output SendPenpalLetterResult
	_, found, err := s.loadIdempotent(ctx, userID, key, requestHash, &output)
	if err != nil || found {
		return output, err
	}
	var exists bool
	if err := s.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM penpal_threads WHERE id = $1 AND user_id = $2)`, input.ThreadID, userID).Scan(&exists); err != nil {
		return SendPenpalLetterResult{}, err
	}
	if !exists {
		return SendPenpalLetterResult{}, ErrNotFound
	}
	letterID, err := newUUID()
	if err != nil {
		return SendPenpalLetterResult{}, err
	}
	_, err = s.pool.Exec(ctx, `INSERT INTO penpal_letters (id, thread_id, user_id, body) VALUES ($1, $2, $3, $4)`, letterID, input.ThreadID, userID, input.Body)
	if err != nil {
		return SendPenpalLetterResult{}, err
	}
	_, err = s.pool.Exec(ctx, `INSERT INTO learning_events (id, user_id, module, activity_type, relation_id) VALUES ($1, $2, 'writing', 'letter_sent', $3) ON CONFLICT DO NOTHING`, mustUUID(), userID, letterID)
	if err != nil {
		return SendPenpalLetterResult{}, err
	}
	output = SendPenpalLetterResult{LetterID: letterID, ActivityType: "letter_sent"}
	return output, s.saveIdempotent(ctx, userID, key, requestHash, 200, output)
}

func (s *PostgresStore) GetDailySummary(ctx context.Context, userID string, date string) (domain.DailySummary, error) {
	start, err := time.Parse("2006-01-02", date)
	if err != nil {
		return domain.DailySummary{}, ErrValidation
	}
	end := start.Add(24 * time.Hour)
	var wordCount, readingCount, writingCount int
	if err := s.pool.QueryRow(ctx, `SELECT count(*) FROM review_events WHERE user_id = $1 AND occurred_at >= $2 AND occurred_at < $3`, userID, start, end).Scan(&wordCount); err != nil {
		return domain.DailySummary{}, err
	}
	if err := s.pool.QueryRow(ctx, `SELECT count(*) FROM learning_events WHERE user_id = $1 AND module = 'reading' AND occurred_at >= $2 AND occurred_at < $3`, userID, start, end).Scan(&readingCount); err != nil {
		return domain.DailySummary{}, err
	}
	if err := s.pool.QueryRow(ctx, `SELECT count(*) FROM learning_events WHERE user_id = $1 AND module = 'writing' AND occurred_at >= $2 AND occurred_at < $3`, userID, start, end).Scan(&writingCount); err != nil {
		return domain.DailySummary{}, err
	}
	completedKinds := 0
	for _, count := range []int{wordCount, readingCount, writingCount} {
		if count > 0 {
			completedKinds++
		}
	}
	return domain.DailySummary{Date: date, WordCompletedCount: wordCount, ReadingCompletedCount: readingCount, WritingCompletedCount: writingCount, TaskCompletionRate: float64(completedKinds) / 3, StreakIncluded: completedKinds > 0}, nil
}

func (s *PostgresStore) userByID(ctx context.Context, userID string) (domain.UserProfile, error) {
	var profile domain.UserProfile
	err := s.pool.QueryRow(ctx, `SELECT id, email, display_name, role FROM users WHERE id = $1`, userID).Scan(&profile.UserID, &profile.Email, &profile.DisplayName, &profile.Role)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.UserProfile{}, ErrAuthRequired
	}
	return profile, err
}

func (s *PostgresStore) userByToken(ctx context.Context, token string, access bool) (domain.UserProfile, error) {
	if token == "" {
		return domain.UserProfile{}, ErrAuthRequired
	}
	column := "access_token"
	expires := "access_expires_at"
	if !access {
		column = "refresh_token"
		expires = "refresh_expires_at"
	}
	var profile domain.UserProfile
	err := s.pool.QueryRow(ctx, fmt.Sprintf(`
		SELECT u.id, u.email, u.display_name, u.role
		FROM sessions s
		JOIN users u ON u.id = s.user_id
		WHERE s.%s = $1 AND s.%s > now() AND s.revoked_at IS NULL
	`, column, expires), token).Scan(&profile.UserID, &profile.Email, &profile.DisplayName, &profile.Role)
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.UserProfile{}, ErrAuthRequired
	}
	return profile, err
}

func (s *PostgresStore) createSessionForUser(ctx context.Context, user domain.UserProfile) (Session, error) {
	sessionID, err := newUUID()
	if err != nil {
		return Session{}, err
	}
	accessToken, err := newToken()
	if err != nil {
		return Session{}, err
	}
	refreshToken, err := newToken()
	if err != nil {
		return Session{}, err
	}
	accessTTL := 15 * time.Minute
	refreshTTL := 7 * 24 * time.Hour
	_, err = s.pool.Exec(ctx, `
		INSERT INTO sessions (id, user_id, access_token, refresh_token, access_expires_at, refresh_expires_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, sessionID, user.UserID, accessToken, refreshToken, s.now().Add(accessTTL), s.now().Add(refreshTTL))
	if err != nil {
		return Session{}, err
	}
	return Session{User: user, AccessToken: accessToken, RefreshToken: refreshToken, AccessTTL: accessTTL, RefreshTTL: refreshTTL}, nil
}

func (s *PostgresStore) loadIdempotent(ctx context.Context, userID string, key string, requestHash string, target any) (int, bool, error) {
	if key == "" || len(key) < 8 {
		return 0, false, ErrValidation
	}
	var storedHash string
	var status int
	var data []byte
	err := s.pool.QueryRow(ctx, `SELECT request_hash, status, data_json FROM idempotency_keys WHERE user_id = $1 AND key = $2`, userID, key).Scan(&storedHash, &status, &data)
	if errors.Is(err, pgx.ErrNoRows) {
		return 0, false, nil
	}
	if err != nil {
		return 0, false, err
	}
	if storedHash != requestHash {
		return 0, false, ErrIdempotencyConflict
	}
	if err := json.Unmarshal(data, target); err != nil {
		return 0, false, err
	}
	return status, true, nil
}

func (s *PostgresStore) saveIdempotent(ctx context.Context, userID string, key string, requestHash string, status int, data any) error {
	payload, err := json.Marshal(data)
	if err != nil {
		return err
	}
	_, err = s.pool.Exec(ctx, `INSERT INTO idempotency_keys (user_id, key, request_hash, status, data_json) VALUES ($1, $2, $3, $4, $5)`, userID, key, requestHash, status, payload)
	if isUniqueViolation(err) {
		return ErrIdempotencyConflict
	}
	return err
}

func (s *PostgresStore) ensureArticleAndWord(ctx context.Context, articleID string, wordID string) error {
	var exists bool
	if err := s.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM reading_articles WHERE id = $1)`, articleID).Scan(&exists); err != nil {
		return err
	}
	if !exists {
		return ErrNotFound
	}
	if err := s.pool.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM words WHERE id = $1)`, wordID).Scan(&exists); err != nil {
		return err
	}
	if !exists {
		return ErrNotFound
	}
	return nil
}

func HashPayload(payload []byte) string {
	sum := sha256.Sum256(payload)
	return hex.EncodeToString(sum[:])
}

func allowed(value string, values ...string) bool {
	for _, item := range values {
		if value == item {
			return true
		}
	}
	return false
}

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23505"
}

func mustUUID() string {
	id, err := newUUID()
	if err != nil {
		panic(err)
	}
	return id
}
