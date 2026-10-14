package match

import (
	"backend/internal/app"
	"backend/internal/gen/match/v1/matchpbconnect"

	"github.com/go-chi/chi/v5"
)

func Mount(r chi.Router, infra *app.Infra) {
	repo := NewRepository(infra.DB)

	matchService := NewService(repo)

	handler := NewHandler(matchService)

	path, h := matchpbconnect.NewMatchServiceHandler(handler)

	r.Mount(path, h)
}
