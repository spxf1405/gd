package main

import (
	"backend/internal/db"
	"backend/internal/match"
	"backend/internal/player"
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	prefix := "[backend]"

	ctx := context.Background()

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"Connect-Protocol-Version",
			"Connect-Timeout-Ms",
			"Connect-Accept-Encoding",
			"Connect-Content-Encoding",
			"Grpc-Timeout",
			"X-Grpc-Web",
			"X-User-Agent",
		},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	db, _ := db.NewDB(ctx)

	player.MountPlayerRouter(r, player.NewService(player.NewRepository(db)))
	match.MountMatchRouter(r, match.NewMatchService(match.NewMatchRepository(db)))

	addr := ":5000"
	fmt.Fprintln(os.Stdout, prefix, "Starting server on", addr)

	if err := http.ListenAndServe(addr, r); err != nil {
		fmt.Fprintln(os.Stderr, prefix, "❌ Server error:", err)
		os.Exit(1)
	}
}
