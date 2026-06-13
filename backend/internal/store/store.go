package store

import (
	"context"
	"time"

	"englishlover/backend/internal/domain"
)

type Store interface {
	EnsureContractTestData(ctx context.Context, email string, password string) error
	Authenticate(ctx context.Context, email string, password string) (domain.UserProfile, error)
	CreateSession(ctx context.Context, userID string) (Session, error)
	UserByAccessToken(ctx context.Context, token string) (domain.UserProfile, error)
	UserByRefreshToken(ctx context.Context, token string) (domain.UserProfile, error)
	RefreshSession(ctx context.Context, refreshToken string) (Session, error)
	RevokeSession(ctx context.Context, token string) error
	ListWords(ctx context.Context, stage string, page int, pageSize int) (PagedResult[domain.WordSummary], error)
	SubmitReview(ctx context.Context, userID string, key string, requestHash string, input ReviewSubmitInput) (ReviewSubmitResult, error)
	ListReviewEvents(ctx context.Context, userID string, cursor string, limit int) (CursorResult[domain.ReviewEvent], error)
	ListReadingArticles(ctx context.Context, page int, pageSize int) (PagedResult[domain.ReadingArticleSummary], error)
	GetReadingArticle(ctx context.Context, articleID string) (domain.ReadingArticleDetail, error)
	AddToWordLearningQueue(ctx context.Context, userID string, articleID string, wordID string, key string, requestHash string) (AddToWordLearningQueueResult, error)
	ListPenpalThreads(ctx context.Context, userID string, page int, pageSize int) (PagedResult[domain.PenpalThreadSummary], error)
	SendPenpalLetter(ctx context.Context, userID string, key string, requestHash string, input SendPenpalLetterInput) (SendPenpalLetterResult, error)
	GetDailySummary(ctx context.Context, userID string, date string) (domain.DailySummary, error)
}

type Session struct {
	User         domain.UserProfile
	AccessToken  string
	RefreshToken string
	AccessTTL    time.Duration
	RefreshTTL   time.Duration
}

type PagedResult[T any] struct {
	Items    []T `json:"items"`
	Page     int `json:"page"`
	PageSize int `json:"pageSize"`
	Total    int `json:"total"`
}

type CursorResult[T any] struct {
	Items      []T    `json:"items"`
	Cursor     string `json:"cursor,omitempty"`
	Limit      int    `json:"limit"`
	NextCursor string `json:"nextCursor,omitempty"`
}

type ReviewSubmitInput struct {
	WordID           string    `json:"wordId"`
	Mode             string    `json:"mode"`
	Rating           int       `json:"rating"`
	IsCorrect        bool      `json:"isCorrect"`
	DurationMs       int       `json:"durationMs"`
	ClientOccurredAt time.Time `json:"clientOccurredAt"`
}

type ReviewSubmitResult struct {
	ReviewEventID string    `json:"reviewEventId"`
	Status        string    `json:"status"`
	NextReviewAt  time.Time `json:"nextReviewAt"`
}

type AddToWordLearningQueueResult struct {
	Status string `json:"status"`
	Source string `json:"source"`
}

type SendPenpalLetterInput struct {
	ThreadID string `json:"threadId"`
	Body     string `json:"body"`
}

type SendPenpalLetterResult struct {
	LetterID     string `json:"letterId"`
	ActivityType string `json:"activityType"`
}
