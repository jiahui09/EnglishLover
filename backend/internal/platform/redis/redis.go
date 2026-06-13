package redis

import (
	"context"
	"errors"

	redisclient "github.com/redis/go-redis/v9"
)

var ErrRedisURLRequired = errors.New("REDIS_URL is required")

type Client = redisclient.Client

func Connect(ctx context.Context, redisURL string) (*Client, error) {
	if redisURL == "" {
		return nil, ErrRedisURLRequired
	}
	options, err := redisclient.ParseURL(redisURL)
	if err != nil {
		return nil, err
	}
	client := redisclient.NewClient(options)
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, err
	}
	return client, nil
}
