package auth

import (
	"backend/internal/config"
	authpb "backend/internal/gen/auth/v1"
	"backend/internal/logger"
	"context"
	"errors"

	"go.uber.org/zap"
	"google.golang.org/api/idtoken"
)

type Service struct {
	repo *AuthRepository
}

func NewService(repo *AuthRepository) *Service {
	return &Service{repo: repo}
}

func verifyIDToken(ctx context.Context, token string) (*idtoken.Payload, error) {
	clientID := config.LoadConfig().GoogleClientID

	logger.Info("Loaded Google Client ID",
		zap.String("clientID", clientID),
	)

	payload, err := idtoken.Validate(ctx, token, clientID)
	if err != nil {
		return nil, err
	}
	return payload, nil
}

func (s *Service) loginWithGoogle(ctx context.Context, idToken string) (*authpb.User, error) {
	userPayload, err := verifyIDToken(ctx, idToken)

	if err != nil {
		logger.Error("verify idToken failed",
			zap.Error(err),
		)
		return nil, err
	}

	emailVerified, ok := userPayload.Claims["email_verified"].(bool)

	if !ok {
		err := errors.New("email_verified is not a bool")

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
			zap.Any("email", userPayload.Claims["email"]),
		)

		return nil, err
	}

	guid := userPayload.Subject

	email, ok := userPayload.Claims["email"].(string)
	if !ok {
		err := errors.New("invalid email")

		logger.Error("invalid email claim",
			zap.Any("email", userPayload.Claims["email"]),
			zap.Error(err),
		)

		return nil, err
	}

	user, err := s.repo.createUser(ctx, email, guid)

	if err != nil {
		return nil, err
	}

	return user, nil
}
