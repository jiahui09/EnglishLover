package store

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"sort"
	"sync"
	"time"

	"englishlover/backend/internal/domain"
)

type MemoryStore struct {
	mu          sync.Mutex
	users       map[string]memoryUser
	sessions    map[string]Session
	refresh     map[string]Session
	words       []domain.WordSummary
	articles    []domain.ReadingArticleDetail
	threads     []domain.PenpalThreadSummary
	reviews     []domain.ReviewEvent
	letters     int
	idempotency map[string]memoryIdempotency
}

type memoryUser struct {
	profile  domain.UserProfile
	password string
}

type memoryIdempotency struct {
	hash string
	data []byte
}

func NewMemory() *MemoryStore {
	m := &MemoryStore{
		users:       map[string]memoryUser{},
		sessions:    map[string]Session{},
		refresh:     map[string]Session{},
		idempotency: map[string]memoryIdempotency{},
		words: []domain.WordSummary{
			{WordID: "00000000-0000-0000-0000-000000000101", Text: "resilient", Phonetic: "/rɪˈzɪliənt/", Stage: "general"},
			{WordID: "00000000-0000-0000-0000-000000000102", Text: "context", Phonetic: "/ˈkɑːntekst/", Stage: "cet4"},
		},
		articles: []domain.ReadingArticleDetail{
			{ArticleID: "00000000-0000-0000-0000-000000000201", Title: "Learning with Reliable Feedback", Content: "Reliable feedback helps learners continue."},
		},
		threads: []domain.PenpalThreadSummary{{ThreadID: "00000000-0000-0000-0000-000000000301", Status: "active"}},
	}
	_ = m.EnsureContractTestData(context.Background(), "learner@example.com", "learner-password")
	return m
}

func (m *MemoryStore) EnsureContractTestData(_ context.Context, email string, password string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.users[email] = memoryUser{profile: domain.UserProfile{UserID: "00000000-0000-0000-0000-000000000001", Email: email, DisplayName: "Contract Learner", Role: "learner"}, password: password}
	return nil
}

func (m *MemoryStore) Authenticate(_ context.Context, email string, password string) (domain.UserProfile, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	user, ok := m.users[email]
	if !ok || user.password != password {
		return domain.UserProfile{}, ErrInvalidCredentials
	}
	return user.profile, nil
}

func (m *MemoryStore) CreateSession(_ context.Context, userID string) (Session, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, user := range m.users {
		if user.profile.UserID == userID {
			return m.createSessionLocked(user.profile)
		}
	}
	return Session{}, ErrAuthRequired
}

func (m *MemoryStore) UserByAccessToken(_ context.Context, token string) (domain.UserProfile, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	session, ok := m.sessions[token]
	if !ok || token == "" {
		return domain.UserProfile{}, ErrAuthRequired
	}
	return session.User, nil
}

func (m *MemoryStore) UserByRefreshToken(_ context.Context, token string) (domain.UserProfile, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	session, ok := m.refresh[token]
	if !ok || token == "" {
		return domain.UserProfile{}, ErrAuthRequired
	}
	return session.User, nil
}

func (m *MemoryStore) RefreshSession(_ context.Context, refreshToken string) (Session, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	session, ok := m.refresh[refreshToken]
	if !ok || refreshToken == "" {
		return Session{}, ErrAuthRequired
	}
	delete(m.refresh, refreshToken)
	delete(m.sessions, session.AccessToken)
	return m.createSessionLocked(session.User)
}

func (m *MemoryStore) RevokeSession(_ context.Context, token string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if token == "" {
		return ErrAuthRequired
	}
	delete(m.sessions, token)
	delete(m.refresh, token)
	return nil
}

func (m *MemoryStore) ListWords(_ context.Context, stage string, page int, pageSize int) (PagedResult[domain.WordSummary], error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	items := []domain.WordSummary{}
	for _, word := range m.words {
		if stage == "" || word.Stage == stage {
			items = append(items, word)
		}
	}
	return pageItems(items, page, pageSize), nil
}

func (m *MemoryStore) SubmitReview(_ context.Context, userID string, key string, requestHash string, input ReviewSubmitInput) (ReviewSubmitResult, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	var output ReviewSubmitResult
	if found, err := m.loadIdempotentLocked(userID, key, requestHash, &output); found || err != nil {
		return output, err
	}
	if !m.wordExists(input.WordID) {
		return ReviewSubmitResult{}, ErrNotFound
	}
	output = ReviewSubmitResult{ReviewEventID: stableID("review" + key), Status: "accepted", NextReviewAt: input.ClientOccurredAt.Add(24 * time.Hour)}
	m.reviews = append(m.reviews, domain.ReviewEvent{EventID: output.ReviewEventID, Module: "word", OccurredAt: input.ClientOccurredAt})
	return output, m.saveIdempotentLocked(userID, key, requestHash, output)
}

func (m *MemoryStore) ListReviewEvents(_ context.Context, userID string, cursor string, limit int) (CursorResult[domain.ReviewEvent], error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	items := append([]domain.ReviewEvent{}, m.reviews...)
	sort.Slice(items, func(i, j int) bool { return items[i].OccurredAt.After(items[j].OccurredAt) })
	if len(items) > limit {
		items = items[:limit]
	}
	return CursorResult[domain.ReviewEvent]{Items: items, Cursor: cursor, Limit: limit}, nil
}

func (m *MemoryStore) ListReadingArticles(_ context.Context, page int, pageSize int) (PagedResult[domain.ReadingArticleSummary], error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	items := make([]domain.ReadingArticleSummary, 0, len(m.articles))
	for _, article := range m.articles {
		items = append(items, domain.ReadingArticleSummary{ArticleID: article.ArticleID, Title: article.Title, Level: "A2"})
	}
	return pageItems(items, page, pageSize), nil
}

func (m *MemoryStore) GetReadingArticle(_ context.Context, articleID string) (domain.ReadingArticleDetail, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, article := range m.articles {
		if article.ArticleID == articleID {
			return article, nil
		}
	}
	return domain.ReadingArticleDetail{}, ErrNotFound
}

func (m *MemoryStore) AddToWordLearningQueue(_ context.Context, userID string, articleID string, wordID string, key string, requestHash string) (AddToWordLearningQueueResult, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	var output AddToWordLearningQueueResult
	if found, err := m.loadIdempotentLocked(userID, key, requestHash, &output); found || err != nil {
		return output, err
	}
	if !m.wordExists(wordID) || !m.articleExists(articleID) {
		return AddToWordLearningQueueResult{}, ErrNotFound
	}
	output = AddToWordLearningQueueResult{Status: "success", Source: "reading"}
	return output, m.saveIdempotentLocked(userID, key, requestHash, output)
}

func (m *MemoryStore) ListPenpalThreads(_ context.Context, userID string, page int, pageSize int) (PagedResult[domain.PenpalThreadSummary], error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	return pageItems(m.threads, page, pageSize), nil
}

func (m *MemoryStore) SendPenpalLetter(_ context.Context, userID string, key string, requestHash string, input SendPenpalLetterInput) (SendPenpalLetterResult, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	var output SendPenpalLetterResult
	if found, err := m.loadIdempotentLocked(userID, key, requestHash, &output); found || err != nil {
		return output, err
	}
	if !m.threadExists(input.ThreadID) {
		return SendPenpalLetterResult{}, ErrNotFound
	}
	m.letters++
	output = SendPenpalLetterResult{LetterID: stableID("letter" + key), ActivityType: "letter_sent"}
	return output, m.saveIdempotentLocked(userID, key, requestHash, output)
}

func (m *MemoryStore) GetDailySummary(_ context.Context, userID string, date string) (domain.DailySummary, error) {
	if _, err := time.Parse("2006-01-02", date); err != nil {
		return domain.DailySummary{}, ErrValidation
	}
	m.mu.Lock()
	defer m.mu.Unlock()
	wordCount := len(m.reviews)
	writingCount := m.letters
	completed := 0
	if wordCount > 0 {
		completed++
	}
	if writingCount > 0 {
		completed++
	}
	return domain.DailySummary{Date: date, WordCompletedCount: wordCount, ReadingCompletedCount: 0, WritingCompletedCount: writingCount, TaskCompletionRate: float64(completed) / 3, StreakIncluded: completed > 0}, nil
}

func (m *MemoryStore) createSessionLocked(user domain.UserProfile) (Session, error) {
	access := stableID("access" + time.Now().String())
	refresh := stableID("refresh" + time.Now().String())
	session := Session{User: user, AccessToken: access, RefreshToken: refresh, AccessTTL: 15 * time.Minute, RefreshTTL: 7 * 24 * time.Hour}
	m.sessions[access] = session
	m.refresh[refresh] = session
	return session, nil
}

func (m *MemoryStore) loadIdempotentLocked(userID string, key string, hash string, target any) (bool, error) {
	if key == "" || len(key) < 8 {
		return false, ErrValidation
	}
	item, ok := m.idempotency[userID+":"+key]
	if !ok {
		return false, nil
	}
	if item.hash != hash {
		return false, ErrIdempotencyConflict
	}
	return true, json.Unmarshal(item.data, target)
}

func (m *MemoryStore) saveIdempotentLocked(userID string, key string, hash string, data any) error {
	payload, err := json.Marshal(data)
	if err != nil {
		return err
	}
	m.idempotency[userID+":"+key] = memoryIdempotency{hash: hash, data: payload}
	return nil
}

func (m *MemoryStore) wordExists(wordID string) bool {
	for _, word := range m.words {
		if word.WordID == wordID {
			return true
		}
	}
	return false
}

func (m *MemoryStore) articleExists(articleID string) bool {
	for _, article := range m.articles {
		if article.ArticleID == articleID {
			return true
		}
	}
	return false
}

func (m *MemoryStore) threadExists(threadID string) bool {
	for _, thread := range m.threads {
		if thread.ThreadID == threadID {
			return true
		}
	}
	return false
}

func pageItems[T any](items []T, page int, pageSize int) PagedResult[T] {
	start := (page - 1) * pageSize
	if start > len(items) {
		start = len(items)
	}
	end := start + pageSize
	if end > len(items) {
		end = len(items)
	}
	return PagedResult[T]{Items: append([]T{}, items[start:end]...), Page: page, PageSize: pageSize, Total: len(items)}
}

func stableID(input string) string {
	sum := sha256.Sum256([]byte(input))
	hexed := hex.EncodeToString(sum[:])
	return hexed[:8] + "-" + hexed[8:12] + "-4" + hexed[13:16] + "-a" + hexed[17:20] + "-" + hexed[20:32]
}
