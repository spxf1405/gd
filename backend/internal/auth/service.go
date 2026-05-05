package auth

import (
	"backend/internal/config"
	authpb "backend/internal/gen/auth/v1"
	sessionpb "backend/internal/gen/session/v1"
	"backend/internal/logger"
	"backend/internal/session"
	"context"
	"errors"

	"go.uber.org/zap"
	"google.golang.org/api/idtoken"
)

type Service struct {
	repo           *AuthRepository
	sessionService *session.Service
}

func NewService(repo *AuthRepository) *Service {
	return &Service{repo: repo}
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

func (s *Service) loginWithGoogle(ctx context.Context, idToken string) (*authpb.User, *sessionpb.Session, error) {
	userPayload, err := verifyIDToken(ctx, idToken)

	if err != nil {
		logger.Error("verify idToken failed",
			zap.Error(err),
		)
		return nil, nil, err
	}

	emailVerified, ok := userPayload.Claims["email_verified"].(bool)

	if !ok {
		err := errors.New("email_verified is not a bool")

		logger.Error("invalid email_verified claim",
			zap.Any("email_verified", userPayload.Claims["email_verified"]),
			zap.Error(err),
		)

		return nil, nil, err
	}

	if !emailVerified {
		err := errors.New("email not verified")

		logger.Error("email not verified",
			zap.String("sub", userPayload.Subject),
			zap.Any("email", userPayload.Claims["email"]),
		)

		return nil, nil, err
	}

	guid := userPayload.Subject

	email, ok := userPayload.Claims["email"].(string)
	if !ok {
		err := errors.New("invalid email")

		logger.Error("invalid email claim",
			zap.Any("email", userPayload.Claims["email"]),
			zap.Error(err),
		)

		return nil, nil, err
	}

	user, err := s.repo.createUser(ctx, email, guid)

	createSessionInput := &session.CreateSessionInput{
		UserID:      user.Id,
		TTL:         config.LoadConfig().Auth.AccessTTL,
		AbsoluteTTL: config.LoadConfig().Auth.AbsoluteSessionTTL,
	}

	session, err := s.sessionService.CreateSession(ctx, *createSessionInput)

	if err != nil {
		return nil, nil, err
	}

	return user, session, nil
}
