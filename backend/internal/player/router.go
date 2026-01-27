// Package player router
package player

import (
	"backend/internal/gen/player/v1/playerpbconnect"

	"github.com/go-chi/chi/v5"
)

func MountPlayerRouter(r chi.Router, service *Service) {
	playerHandler := &PlayerServiceHandler{
		service: service,
	}
	path, handler := playerpbconnect.NewPlayerServiceHandler(playerHandler)
	r.Mount(path, handler)
}
