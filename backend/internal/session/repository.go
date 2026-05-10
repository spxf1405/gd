package session

import (
	"backend/internal/db"
	sessionpb "backend/internal/gen/session/v1"
	"backend/internal/logger"
	"backend/internal/repository"
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
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

func (r *SessionRepository) insertSession(ctx context.Context, db interface {
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
}, session *sessionpb.Session) (*sessionpb.Session, error) {
	query := `
		INSERT INTO gd_sessions(
			user_id,
			refresh_token_hash,
			token_family_id,
			expires_at,
			absolute_expires_at,
			revoked,
			is_compromised
		) VALUES ($1,$2,$3,$4,$5,$6,$7)
		RETURNING 
			id, user_id, refresh_token_hash, token_family_id,
			expires_at, absolute_expires_at, rotated_at, last_used_at,
			revoked, is_compromised, created_at
	`

	row := db.QueryRow(ctx, query,
		session.UserId,
		session.RefreshTokenHash,
		session.TokenFamilyId,
		session.ExpiresAt,
		session.AbsoluteExpiresAt,
		session.Revoked,
		session.IsCompromised,
	)

	if err := scanSession(row, session); err != nil {
		return nil, err
	}

	return session, nil
}

func scanSession(row pgx.Row, session *sessionpb.Session) error {
	var expiresAt, absoluteExpiresAt, createdAt time.Time
	var rotatedAt, lastUsedAt *time.Time

	err := row.Scan(
		&session.Id,
		&session.UserId,
		&session.RefreshTokenHash,
		&session.TokenFamilyId,
		&expiresAt,
		&absoluteExpiresAt,
		&rotatedAt,
		&lastUsedAt,
		&session.Revoked,
		&session.IsCompromised,
		&createdAt,
	)
	if err != nil {
		return err
	}

	session.ExpiresAt = expiresAt.Format(time.RFC3339)
	session.AbsoluteExpiresAt = absoluteExpiresAt.Format(time.RFC3339)
	session.CreatedAt = createdAt.Format(time.RFC3339)

	if rotatedAt != nil {
		session.RotatedAt = rotatedAt.Format(time.RFC3339)
	}
	if lastUsedAt != nil {
		session.LastUsedAt = lastUsedAt.Format(time.RFC3339)
	}

	return nil
}

func (r *SessionRepository) CreateSession(ctx context.Context, session *sessionpb.Session) (*sessionpb.Session, error) {
	result, err := r.insertSession(ctx, r.DB.Pool, session)
	if err != nil {
		logger.Info("Create session failed", zap.Error(err))
		return nil, err
	}
	return result, nil
}

func (r *SessionRepository) RefreshToken(ctx context.Context, tokenRaw string, newSession *sessionpb.Session) (*sessionpb.Session, error) {
	tx, err := r.DB.Pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		logger.Error("Failed to begin transaction", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)

	var id, userId, refreshTokenHash, tokenFamilyID string
	var revoked bool
	var expiresAt time.Time

	err = tx.QueryRow(ctx,
		`SELECT id, user_id, refresh_token_hash, revoked, expires_at, token_family_id FROM gd_sessions WHERE refresh_token_hash = $1 FOR UPDATE`,
		hashToken(tokenRaw),
	).Scan(&id, &userId, &refreshTokenHash, &revoked, &expiresAt, &tokenFamilyID)

	if err != nil {
		logger.Error("Session not found", zap.Error(err))
		return nil, err
	}

	if revoked {
		logger.Warn(
			"Refresh token reuse detected",
			zap.String("user_id", userId),
			zap.String("family_id", tokenFamilyID),
		)
		_, err = tx.Exec(ctx, "UPDATE gd_sessions SET revoked = TRUE, is_compromised = TRUE WHERE token_family_id = $1", tokenFamilyID)
		return nil, errors.New("Refresh token reuse detected!")
	}

	// test
	_, err = tx.Exec(ctx, "UPDATE gd_sessions SET revoked = TRUE, WHERE id = $1", id)

	if err != nil {
		logger.Error("Failed to revoke old session", zap.String("session_id", id), zap.Error(err))
		return nil, err
	}

	newSession.UserId = userId
	result, err := r.insertSession(ctx, tx, newSession)
	if err != nil {
		logger.Error("Failed to insert new session", zap.String("user_id", userId), zap.Error(err))
		return nil, err
	}

	if err = tx.Commit(ctx); err != nil {
		logger.Error("Failed to commit transaction", zap.String("user_id", userId), zap.Error(err))
		return nil, err
	}

	logger.Info("Token refreshed successfully", zap.String("user_id", userId), zap.String("new_session_id", result.Id))

	return result, nil
}
