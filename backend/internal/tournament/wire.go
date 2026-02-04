package tournament

import (
	"backend/internal/app"
	"backend/internal/gen/tournament/v1/tournamentpbconnect"

	"github.com/go-chi/chi/v5"
)

func Mount(r chi.Router, infra *app.Infra) {
	repo := NewRepository(infra.DB)
	service := NewService(repo)
	handler := NewHandler(service, infra.Validator)

	path, h := tournamentpbconnect.NewTournamentServiceHandler(handler)
	r.Mount(path, h)
}
