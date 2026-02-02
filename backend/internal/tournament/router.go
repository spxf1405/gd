// Package player router
package tournament

import (
	"backend/internal/gen/tournament/v1/tournamentpbconnect"

	"github.com/go-chi/chi/v5"
)

func MountTournamentRouter(r chi.Router, service *Service) {
	tournamentHandler := &tournamentServiceHandler{
		service: service,
	}
	path, handler := tournamentpbconnect.NewTournamentServiceHandler(tournamentHandler)
	r.Mount(path, handler)
}
