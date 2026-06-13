package store

import "errors"

var (
	ErrInvalidCredentials  = errors.New("invalid credentials")
	ErrAuthRequired        = errors.New("auth required")
	ErrNotFound            = errors.New("not found")
	ErrValidation          = errors.New("validation error")
	ErrIdempotencyConflict = errors.New("idempotency conflict")
)
