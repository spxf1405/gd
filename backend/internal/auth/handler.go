package auth

import (
	authpb "backend/internal/gen/auth/v1"
	"backend/internal/logger"
	"context"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
	"go.uber.org/zap"
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
	req *connect.Request[authpb.AuthWithGoogleRequest]) (*connect.Response[authpb.AuthWithGoogleResponse], error) {

	var idToken = req.Msg.IdToken

	loginInfo, err := h.service.loginWithGoogle(ctx, idToken)

	if err != nil {
		logger.Error("loginWithGoogle failed",
			zap.Error(err),
		)

		return nil, connect.NewError(connect.CodeUnauthenticated, err)
	}

	res := connect.NewResponse(&authpb.AuthWithGoogleResponse{
		User:         loginInfo.User,
		AccessToken:  loginInfo.AccessToken,
		RefreshToken: loginInfo.RefreshToken,
	})

	return res, nil
}
