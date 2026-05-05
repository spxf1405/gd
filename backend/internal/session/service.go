package session

import (
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
}

func NewService(repo *SessionRepository) *Service {
	return &Service{repo: repo}
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

func (s *Service) CreateSession(ctx context.Context, input CreateSessionInput) (*sessionpb.Session, error) {
	refreshToken := generateSecureToken()
	refreshHash := hashToken(refreshToken)

	now := time.Now()

	session := &sessionpb.Session{
		UserId: input.UserID,

		RefreshTokenHash: refreshHash,
		TokenFamilyId:    uuid.New().String(),

		ExpiresAt:         now.Add(input.TTL).Format(time.RFC3339),
		AbsoluteExpiresAt: now.Add(input.AbsoluteTTL).Format(time.RFC3339),

		CreatedAt: now.Format(time.RFC3339),

		Revoked:       false,
		IsCompromised: false,
	}

	session, err := s.repo.Insert(ctx, session)

	if err != nil {
		return nil, err
	}

	return session, nil
}
