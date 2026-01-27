package match

import (
	"backend/internal/gen/match/v1/matchpbconnect"

	"github.com/go-chi/chi/v5"
)

func MountMatchRouter(r chi.Router, service *MatchService) {
	matchServiceHandler := &MatchServiceHandler{
		service: service,
	}
	path, handler := matchpbconnect.NewMatchServiceHandler(matchServiceHandler)
	r.Mount(path, handler)
}
