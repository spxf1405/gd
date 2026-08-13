package participant

import (
	"backend/internal/app"
	"backend/internal/gen/participant/v1/participantpbconnect"

	"github.com/go-chi/chi/v5"
)

func Mount(r chi.Router, infra *app.Infra) {
	repo := NewRepository(infra.DB)

	roundService := NewService(repo)

	handler := NewHandler(roundService)

	path, h := participantpbconnect.NewParticipantServiceHandler(handler)

	r.Mount(path, h)
}
