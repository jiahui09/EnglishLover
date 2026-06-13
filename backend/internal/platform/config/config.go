package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	HTTPAddr             string
	AppVersion           string
	DatabaseURL          string
	RedisURL             string
	AutoMigrate          bool
	CookieSecure         bool
	ContractTestEmail    string
	ContractTestPassword string
	ReadHeaderTimeout    time.Duration
}

func Load() Config {
	return Config{
		HTTPAddr:             getEnv("HTTP_ADDR", ":8080"),
		AppVersion:           getEnv("APP_VERSION", "1.0.0"),
		DatabaseURL:          os.Getenv("DATABASE_URL"),
		RedisURL:             os.Getenv("REDIS_URL"),
		AutoMigrate:          getBoolEnv("AUTO_MIGRATE", true),
		CookieSecure:         getBoolEnv("COOKIE_SECURE", false),
		ContractTestEmail:    getEnv("CONTRACT_TEST_EMAIL", "learner@example.com"),
		ContractTestPassword: getEnv("CONTRACT_TEST_PASSWORD", "learner-password"),
		ReadHeaderTimeout:    5 * time.Second,
	}
}

func getEnv(key string, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	return value
}

func getBoolEnv(key string, fallback bool) bool {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}
	return parsed
}
