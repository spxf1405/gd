package auth

import (
	"backend/internal/app"
	"backend/internal/gen/auth/v1/authpbconnect"
	"backend/internal/session"

	"github.com/go-chi/chi/v5"
)

func Mount(r chi.Router, infra *app.Infra) {
	repo := NewRepository(infra.DB)

	sessionService := session.NewService(session.NewRepository(infra.DB))

	authService := NewService(repo, sessionService)

	handler := NewHandler(authService, infra.Validator)

	path, h := authpbconnect.NewAuthServiceHandler(handler)

	r.Mount(path, h)
}
