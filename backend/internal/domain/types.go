package domain

import "time"

type UserProfile struct {
	UserID      string `json:"userId"`
	Email       string `json:"email"`
	DisplayName string `json:"displayName"`
	Role        string `json:"role"`
}

type WordSummary struct {
	WordID   string `json:"wordId"`
	Text     string `json:"text"`
	Phonetic string `json:"phonetic,omitempty"`
	Stage    string `json:"stage"`
}

type ReadingArticleSummary struct {
	ArticleID string `json:"articleId"`
	Title     string `json:"title"`
	Level     string `json:"level,omitempty"`
}

type ReadingArticleDetail struct {
	ArticleID string `json:"articleId"`
	Title     string `json:"title"`
	Content   string `json:"content"`
}

type ReviewEvent struct {
	EventID    string    `json:"eventId"`
	Module     string    `json:"module"`
	OccurredAt time.Time `json:"occurredAt"`
}

type PenpalThreadSummary struct {
	ThreadID string `json:"threadId"`
	Status   string `json:"status"`
}

type DailySummary struct {
	Date                  string  `json:"date"`
	WordCompletedCount    int     `json:"wordCompletedCount"`
	ReadingCompletedCount int     `json:"readingCompletedCount"`
	WritingCompletedCount int     `json:"writingCompletedCount"`
	TaskCompletionRate    float64 `json:"taskCompletionRate"`
	StreakIncluded        bool    `json:"streakIncluded"`
}
