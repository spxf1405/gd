package auth

import (
	"backend/internal/config"
	authpb "backend/internal/gen/auth/v1"
	"backend/internal/logger"
	"backend/internal/session"
	"backend/internal/token"
	"context"
	"errors"

	"go.uber.org/zap"
	"google.golang.org/api/idtoken"
)

type Service struct {
	repo           *AuthRepository
	sessionService *session.Service
	cfg            *config.Config
}

func NewService(repo *AuthRepository, sessionService *session.Service, cfg *config.Config) *Service {
	return &Service{repo: repo, sessionService: sessionService, cfg: cfg}
}

func verifyIDToken(ctx context.Context, token string) (*idtoken.Payload, error) {
	clientID := config.LoadConfig().OAuth.GoogleClientID

	logger.Info("Loaded Google Client ID",
		zap.String("clientID", clientID),
	)

	payload, err := idtoken.Validate(ctx, token, clientID)
	if err != nil {
		return nil, err
	}
	return payload, nil
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
	userPayload, err := verifyIDToken(ctx, idToken)
	if err != nil {
		logger.Error("verify idToken failed", zap.Error(err))
		return nil, err
	}

	emailVerified, ok := userPayload.Claims["email_verified"].(bool)
	if !ok || !emailVerified {
		err := errors.New("email not verified")
		logger.Error("invalid email_verified claim",
			zap.Any("email_verified", userPayload.Claims["email_verified"]),
			zap.Error(err),
		)
		return nil, err
	}

	email, ok := userPayload.Claims["email"].(string)
	if !ok {
		err := errors.New("invalid email")
		logger.Error("invalid email claim",
			zap.Any("email", userPayload.Claims["email"]),
			zap.Error(err),
		)
		return nil, err
	}

	guid := userPayload.Subject

	user, err := s.repo.createUser(ctx, email, guid)
	if err != nil {
		return nil, err
	}

	_, refreshToken, err := s.sessionService.CreateSession(ctx, session.CreateSessionInput{
		UserID:      user.Id,
		TTL:         s.cfg.Auth.RefreshTTL,
		AbsoluteTTL: s.cfg.Auth.AbsoluteSessionTTL,
	})

	if err != nil {
		logger.Error("create session failed", zap.Error(err))
		return nil, err
	}

	accessToken, err := token.GenerateAccessToken(
		user.Id,
		s.cfg.Auth.JWTSecret,
		s.cfg.Auth.AccessTTL,
	)

	if err != nil {
		logger.Error("generate access token failed", zap.Error(err))
		return nil, err
	}

	return &LoginWithGoogleResult{
		User:         user,
		RefreshToken: refreshToken,
		AccessToken:  accessToken,
	}, nil
}
