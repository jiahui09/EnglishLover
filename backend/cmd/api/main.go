package main

import (
	"log"
	"net/http"

	"englishlover/backend/internal/app"
	"englishlover/backend/internal/platform/config"
)

func main() {
	cfg := config.Load()
	server := &http.Server{
		Addr:              cfg.HTTPAddr,
		Handler:           app.NewRouter(cfg),
		ReadHeaderTimeout: cfg.ReadHeaderTimeout,
	}

	log.Printf("englishlover api listening on %s", cfg.HTTPAddr)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("api server failed: %v", err)
	}
}
