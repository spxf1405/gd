package auth

import (
	authpb "backend/internal/gen/auth/v1"
	"backend/internal/logger"
	"context"
	"errors"
	"net/http"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"google.golang.org/protobuf/types/known/emptypb"
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

func (h *Hanlder) RefreshToken(
	ctx context.Context,
	req *connect.Request[emptypb.Empty],
) (*connect.Response[authpb.AccessToken], error) {
	cookieHeader := req.Header().Get("Cookie")

	httpReq := &http.Request{
		Header: http.Header{
			"Cookie": []string{cookieHeader},
		},
	}

	refreshTokenCookie, err := httpReq.Cookie("refresh_token")

	if err != nil {
		logger.Info("Refresh Token", zap.Error(err))
		return nil, connect.NewError(
			connect.CodeUnauthenticated,
			errors.New("missing refresh token"),
		)
	}

	logger.Info(
		"refresh token received",
		zap.String("refresh_token", refreshTokenCookie.Value),
	)

	refreshTokenResult, err := h.service.sessionService.RefreshToken(ctx, refreshTokenCookie.Value)

	if err != nil {
		logger.Error(
			"refreshToken failed",
			zap.Error(err),
		)

		return nil, connect.NewError(
			connect.CodeUnauthenticated,
			err,
		)
	}

	cookie := &http.Cookie{
		Name:  "refresh_token",
		Value: uuid.NewString(),

		Path: "/",

		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	}

	res := connect.NewResponse(
		&authpb.AccessToken{
			AccessToken: refreshTokenResult.AccessToken,
		},
	)

	res.Header().Add(
		"Set-Cookie",
		cookie.String(),
	)

	return res, nil
}
