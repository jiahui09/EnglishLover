package postgres

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrDatabaseURLRequired = errors.New("DATABASE_URL is required")

type Pool = pgxpool.Pool

func Connect(ctx context.Context, databaseURL string) (*Pool, error) {
	if databaseURL == "" {
		return nil, ErrDatabaseURLRequired
	}
	return pgxpool.New(ctx, databaseURL)
}
