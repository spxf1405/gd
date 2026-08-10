package round

import (
	"backend/internal/app"
	"backend/internal/gen/round/v1/roundpbconnect"

	"github.com/go-chi/chi/v5"
)

func Mount(r chi.Router, infra *app.Infra) {
	repo := NewRepository(infra.DB)

	roundService := NewService(repo)

	handler := NewHandler(roundService)

	path, h := roundpbconnect.NewRoundServiceHandler(handler)

	r.Mount(path, h)
}
