package session

import (
	"backend/internal/config"
	sessionpb "backend/internal/gen/session/v1"
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"time"

	"github.com/google/uuid"
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
		UserId: userID,

		RefreshTokenHash: refreshHash,
		TokenFamilyId:    uuid.New().String(),

		ExpiresAt:         now.Add(cfg.Auth.AccessTTL).Format(time.RFC3339),
		AbsoluteExpiresAt: now.Add(cfg.Auth.AbsoluteSessionTTL).Format(time.RFC3339),

		CreatedAt: now.Format(time.RFC3339),

		Revoked:       false,
		IsCompromised: false,
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

func (s *Service) RefreshToken(ctx context.Context, clientRefreshToken string) (*sessionpb.Session, string, error) {
	newSession, refreshTokenRaw := generateNewSession("", s.cfg)

	session, err := s.repo.RefreshToken(ctx, clientRefreshToken, newSession)

	if err != nil {
		return nil, "", err
	}

	return session, refreshTokenRaw, nil
}
