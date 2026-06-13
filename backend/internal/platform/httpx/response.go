package httpx

import (
	"encoding/json"
	"net/http"
)

type ErrorCode string

const (
	ErrorAuthRequired ErrorCode = "AUTH_REQUIRED"
	ErrorAuthInvalid  ErrorCode = "AUTH_INVALID"
	ErrorForbidden    ErrorCode = "FORBIDDEN"
	ErrorValidation   ErrorCode = "VALIDATION_ERROR"
	ErrorNotFound     ErrorCode = "NOT_FOUND"
	ErrorConflict     ErrorCode = "CONFLICT"
	ErrorIdempotency  ErrorCode = "IDEMPOTENCY_CONFLICT"
	ErrorRateLimited  ErrorCode = "RATE_LIMITED"
	ErrorInternal     ErrorCode = "INTERNAL_ERROR"
)

type Envelope struct {
	RequestID string `json:"requestId"`
	Data      any    `json:"data,omitempty"`
	Meta      any    `json:"meta,omitempty"`
	Error     *Error `json:"error,omitempty"`
}

type Error struct {
	Code    ErrorCode `json:"code"`
	Message string    `json:"message"`
	Details any       `json:"details,omitempty"`
}

func WriteJSON(w http.ResponseWriter, r *http.Request, status int, data any, meta any) {
	writeEnvelope(w, r, status, Envelope{Data: data, Meta: meta})
}

func WriteError(w http.ResponseWriter, r *http.Request, status int, code ErrorCode, message string, details any) {
	writeEnvelope(w, r, status, Envelope{Error: &Error{Code: code, Message: message, Details: details}})
}

func WriteNoContent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("X-Request-Id", RequestIDFrom(r))
	w.WriteHeader(http.StatusNoContent)
}

func writeEnvelope(w http.ResponseWriter, r *http.Request, status int, envelope Envelope) {
	envelope.RequestID = RequestIDFrom(r)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(envelope); err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
	}
}
