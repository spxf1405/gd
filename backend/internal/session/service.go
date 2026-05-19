package session

import (
	"backend/internal/config"
	"backend/internal/datetime"
	commonpb "backend/internal/gen/common/v1"
	sessionpb "backend/internal/gen/session/v1"
	"backend/internal/jwtoken"
	"backend/internal/logger"
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"
)

type Service struct {
	repo *SessionRepository
	cfg  *config.Config
}

func NewService(repo *SessionRepository, cfg *config.Config) *Service {
	return &Service{repo: repo, cfg: cfg}
}

func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}

func generateSecureToken() string {
	b := make([]byte, 32)
	_, _ = rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

type CreateSessionInput struct {
	UserID      string
	TTL         time.Duration
	AbsoluteTTL time.Duration
}

func generateNewSession(userID string, cfg *config.Config) (*sessionpb.Session, string) {
	refreshToken := generateSecureToken()
	refreshHash := hashToken(refreshToken)

	now := time.Now()

	if userID == "" {
		userID = uuid.New().String()
	}

	session := &sessionpb.Session{
		UserId:            userID,
		RefreshTokenHash:  refreshHash,
		TokenFamilyId:     uuid.New().String(),
		ExpiresAt:         now.Add(cfg.Auth.AccessTTL).Format(time.RFC3339),
		AbsoluteExpiresAt: now.Add(cfg.Auth.AbsoluteSessionTTL).Format(time.RFC3339),
		CreatedAt:         now.Format(time.RFC3339),
		Revoked:           false,
		IsReused:          false,
	}

	return session, refreshToken
}

func (s *Service) CreateSession(ctx context.Context, userID string) (*sessionpb.Session, string, error) {
	newSession, refreshTokenRaw := generateNewSession(userID, s.cfg)
	session, err := s.repo.CreateSession(ctx, newSession)

	if err != nil {
		return nil, "", err
	}

	return session, refreshTokenRaw, nil
}

type RefreshTokenResult struct {
	Session         *sessionpb.Session
	RefreshTokenRaw string
	AccessToken     string
}

func (s *Service) RefreshToken(ctx context.Context, clientRefreshToken string) (result *RefreshTokenResult, err error) {
	newSession, refreshTokenRaw := generateNewSession("", s.cfg)

	session, err := s.repo.GetRefreshToken(ctx, clientRefreshToken)

	if err != nil {
		logger.Error(
			"Refresh token reuse detected",
			zap.Any("SessionID", session.Id),
		)
		return nil, errors.New(commonpb.AuthError_AUTH_ERROR_REFRESH_TOKEN_REUSED.String())
	}

	if session.IsReused {
		logger.Error(
			"Refresh token reuse detected",
			zap.Any("SessionID", session.Id),
		)
		return nil, errors.New(commonpb.AuthError_AUTH_ERROR_REFRESH_TOKEN_REUSED.String())
	}

	if session.Revoked {
		logger.Error(
			"Refresh token reuse detected",
			zap.String("user_id", session.Id),
			zap.String("family_id", session.TokenFamilyId),
		)

		// TODO: Add hacker detecting, revoke all follow tokenFamilyID, 18/5/2026
		return nil, errors.New(commonpb.AuthError_AUTH_ERROR_SESSION_REVOKED.String())
	}

	absoluteExpiresAt := datetime.MustParseTime(
		session.AbsoluteExpiresAt,
		time.RFC3339,
	)

	if absoluteExpiresAt.Before(time.Now()) {
		logger.Error(
			"Refresh token absoluteTTL expired!",
			zap.Any("SessionID", session.Id),
		)
		// TODO: Handle soft login
		return nil, errors.New(commonpb.AuthError_AUTH_ERROR_SOFT_LOGIN_REQUIRED.String())
	}

	rotatedSession, _ := s.repo.RotateSession(ctx, session.Id, newSession)

	accessToken, _ := jwtoken.GenerateAccessToken(session.Id, s.cfg.Auth.JWTSecret, s.cfg.Auth.AccessTTL)

	refreshTokenResult := &RefreshTokenResult{
		Session:         rotatedSession,
		RefreshTokenRaw: refreshTokenRaw,
		AccessToken:     accessToken,
	}

	return refreshTokenResult, nil
}
