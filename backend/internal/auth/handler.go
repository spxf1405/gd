package auth

import (
	authpb "backend/internal/gen/auth/v1"
	"context"
	"net/http"

	"connectrpc.com/connect"
)

type AuthServiceHandler struct{}

func (s *AuthServiceHandler) Login(ctx context.Context,
	req *connect.Request[authpb.LoginRequest]) (*connect.Response[authpb.LoginResponse], error) {

	var csrf_token = "1"

	res := connect.NewResponse(&authpb.LoginResponse{
		CsrfToken: csrf_token,
	})

	var cookie = &http.Cookie{
		Name:  "session_id",
		Value: "ABC123123213",
	}

	res.Header().Add("Set-Cookie", cookie.String())
	return res, nil
}
