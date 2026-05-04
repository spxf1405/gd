package auth

import (
	authpb "backend/internal/gen/auth/v1"
	"context"
	"net/http"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
)

type Hanlder struct {
	service   *Service
	validator protovalidate.Validator
}

func NewHandler(service *Service, validator protovalidate.Validator) *Hanlder {
	return &Hanlder{
		service:   service,
		validator: validator,
	}
}

func (h *Hanlder) LoginWithGoogle(ctx context.Context,
	req *connect.Request[authpb.AuthWithGoogleRequest]) (*connect.Response[authpb.AuthwithGoogleResponse], error) {

	var IdToken = req.Msg.IdToken

	res := connect.NewResponse(&authpb.AuthwithGoogleResponse{
		csrf_token: csrf_token,
	})

	var cookie = &http.Cookie{
		Name:  "session_id",
		Value: "ABC123123213",
	}

	res.Header().Add("Set-Cookie", cookie.String())
	return res, nil
}
