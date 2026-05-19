package auth

import (
	"backend/internal/firebase"
	authpb "backend/internal/gen/auth/v1"
	"backend/internal/jwtoken"
	"backend/internal/logger"
	"backend/internal/session"
	"context"
	"errors"

	"firebase.google.com/go/v4/auth"
	"go.uber.org/zap"
)

type Service struct {
	repo           *AuthRepository
	sessionService *session.Service
}

func NewService(repo *AuthRepository, sessionService *session.Service) *Service {
	return &Service{repo: repo, sessionService: sessionService}
}

func (s *Service) verifyIDToken(ctx context.Context, token string) (*auth.Token, error) {
	authClient, err := firebase.InitFirebase()

	if err != nil {
		logger.Info("Init Firebase failed",
			zap.Any("clientID", err),
		)
	}

	authToken, err := authClient.VerifyIDToken(ctx, token)

	logger.Info("Token", zap.Any("authToken", authToken))
	if err != nil {
		logger.Info("Validate failed",
			zap.Any("err", err),
		)
	}

	return authToken, nil
}

type LoginWithGoogleResult struct {
	User         *authpb.User
	AccessToken  string
	RefreshToken string
}

func (s *Service) loginWithGoogle(
	ctx context.Context,
	idToken string,
) (*LoginWithGoogleResult, error) {

	userPayload, err := s.verifyIDToken(ctx, idToken)
	if err != nil {
		logger.Error("verify idToken failed",
			zap.Error(err),
		)
		return nil, err
	}

	emailVerified, ok := userPayload.Claims["email_verified"].(bool)
	if !ok {
		err := errors.New("invalid email_verified claim")

		logger.Error("invalid email_verified claim",
			zap.Any("email_verified", userPayload.Claims["email_verified"]),
			zap.Error(err),
		)

		return nil, err
	}

	if !emailVerified {
		err := errors.New("email not verified")

		logger.Error("email not verified",
			zap.String("sub", userPayload.Subject),
			zap.Error(err),
		)

		return nil, err
	}

	email, ok := userPayload.Claims["email"].(string)
	if !ok {
		err := errors.New("invalid email claim")

		logger.Error("invalid email claim",
			zap.Any("email", userPayload.Claims["email"]),
			zap.Error(err),
		)

		return nil, err
	}

	guid := userPayload.Subject

	user, err := s.repo.checkExistOrCreateUser(ctx, email, guid)
	if err != nil {
		logger.Error("check/create user failed",
			zap.String("email", email),
			zap.String("guid", guid),
			zap.Error(err),
		)
		return nil, err
	}

	_, refreshToken, err := s.sessionService.CreateSession(ctx, user.Id)

	if err != nil {
		logger.Error("create session failed",
			zap.String("userID", user.Id),
			zap.Error(err),
		)
		return nil, err
	}

	accessToken, err := jwtoken.GenerateAccessToken(
		user.Id,
		s.cfg.Auth.JWTSecret,
		s.cfg.Auth.AccessTTL,
	)

	if err != nil {
		logger.Error("generate access token failed",
			zap.String("userID", user.Id),
			zap.Error(err),
		)
		return nil, err
	}

	logger.Info("user login success",
		zap.String("userID", user.Id),
		zap.String("email", email),
	)

	return &LoginWithGoogleResult{
		User:         user,
		RefreshToken: refreshToken,
		AccessToken:  "",
	}, nil
}
