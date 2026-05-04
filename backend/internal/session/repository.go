package session

import (
	"backend/internal/db"
	sessionpb "backend/internal/gen/session/v1"
	"backend/internal/logger"
	"backend/internal/repository"
	"context"

	"go.uber.org/zap"
)

type SessionRepository struct {
	*repository.BaseRepository[*sessionpb.Session]
}

func NewRepository(db *db.DB) *SessionRepository {
	return &SessionRepository{
		BaseRepository: repository.NewBaseRepository[*sessionpb.Session](db),
	}
}

func (r *SessionRepository) Insert(
	ctx context.Context,
	session *sessionpb.Session,
) (*sessionpb.Session, error) {

	query := `
		INSERT INTO gd_sessions(
			user_id,
			refresh_token_hash,
			token_family_id,
			expires_at,
			absolute_expires_at,
			rotated_at,
			last_used_at,
			revoked,
			is_compromised
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
		RETURNING 
			id,
			user_id,
			refresh_token_hash,
			token_family_id,
			expires_at,
			absolute_expires_at,
			rotated_at,
			last_used_at,
			revoked,
			is_compromised,
			created_at
		`

	row := r.DB.Pool.QueryRow(ctx, query,
		session.UserId,
		session.RefreshTokenHash,
		session.TokenFamilyId,
		session.ExpiresAt,
		session.AbsoluteExpiresAt,
		session.RotatedAt,
		session.LastUsedAt,
		session.Revoked,
		session.IsCompromised,
	)

	err := row.Scan(
		&session.Id,
		&session.UserId,
		&session.RefreshTokenHash,
		&session.TokenFamilyId,
		&session.ExpiresAt,
		&session.AbsoluteExpiresAt,
		&session.RotatedAt,
		&session.LastUsedAt,
		&session.Revoked,
		&session.IsCompromised,
		&session.CreatedAt,
	)

	if err != nil {
		logger.Info("Create session failed", zap.Error(err))
		return nil, err
	}

	return session, nil
}
