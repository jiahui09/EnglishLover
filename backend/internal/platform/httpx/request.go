package httpx

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
)

func DecodeJSON(r *http.Request, target any) error {
	if r.Body == nil {
		return errors.New("request body is required")
	}
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	return decoder.Decode(target)
}

func PageParams(r *http.Request) (int, int, error) {
	page, err := intQuery(r, "page", 1)
	if err != nil {
		return 0, 0, err
	}
	pageSize, err := intQuery(r, "pageSize", 20)
	if err != nil {
		return 0, 0, err
	}
	if page < 1 || pageSize < 1 || pageSize > 100 {
		return 0, 0, errors.New("page must be >= 1 and pageSize must be between 1 and 100")
	}
	return page, pageSize, nil
}

func LimitParam(r *http.Request) (int, error) {
	limit, err := intQuery(r, "limit", 50)
	if err != nil {
		return 0, err
	}
	if limit < 1 || limit > 100 {
		return 0, errors.New("limit must be between 1 and 100")
	}
	return limit, nil
}

func intQuery(r *http.Request, key string, fallback int) (int, error) {
	value := r.URL.Query().Get(key)
	if value == "" {
		return fallback, nil
	}
	parsed, err := strconv.Atoi(value)
	if err != nil {
		return 0, err
	}
	return parsed, nil
}
