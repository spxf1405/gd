// Package user implements the UserService gRPC/Connect handler
package user

import (
	"backend/internal/gen/user/v1/userpbconnect"

	"github.com/go-chi/chi/v5"
)

func MountUserService(r chi.Router, service *Service) {
	userHandler := &UserServiceHandler{
		service: service,
	}
	path, handler := userpbconnect.NewUserServiceHandler(userHandler)
	r.Mount(path, handler)
}
