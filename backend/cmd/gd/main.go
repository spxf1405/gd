package main

import (
	"backend/internal/db"
	"backend/internal/player"
	"backend/internal/tournament"
	"context"
	"fmt"
	"log"
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
			"Origin",
			"User-Agent",
			"Referer",
			"Accept-Encoding",
			"Cache-Control",
			"Pragma",
			"Connect-Protocol-Version",
			"Connect-Timeout-Ms",
			"Connect-Accept-Encoding",
			"Connect-Content-Encoding",
			"Grpc-Timeout",
			"X-Grpc-Web",
			"X-User-Agent",
			"Grpc-Accept-Encoding",
			"Grpc-Encoding",
		},
		ExposedHeaders: []string{
			"Link",
			"Content-Type",
			"Content-Length",
			"Date",
			"Server",
			"Vary",
			"Content-Encoding",
			"Trailer",
			"Connect-Protocol-Version",
			"Connect-Content-Encoding",
			"Connect-Accept-Encoding",
			"Grpc-Status",
			"Grpc-Message",
			"Grpc-Status-Details-Bin",
		},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	db, err := db.NewDB(ctx)

	if err != nil {
		log.Fatal(err)
	}

	player.MountPlayerRouter(r, player.NewService(player.NewRepository(db)))
	// match.MountMatchRouter(r, match.NewMatchService(match.NewMatchRepository(db)))

	tournament.MountTournamentRouter(r, tournament.NewService(tournament.NewRepository(db)))

	addr := ":5000"
	fmt.Fprintln(os.Stdout, prefix, "Starting server on", addr)

	if err := http.ListenAndServe(addr, r); err != nil {
		fmt.Fprintln(os.Stderr, prefix, "❌ Server error:", err)
		os.Exit(1)
	}
}
