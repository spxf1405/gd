package session

import (
	"backend/internal/db"
	sessionpb "backend/internal/gen/session/v1"
	"backend/internal/logger"
	"backend/internal/repository"
	"context"
	"database/sql"
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
			is_reused
		) VALUES ($1,$2,$3,$4,$5,$6,$7)
		RETURNING 
			id, user_id, refresh_token_hash, token_family_id,
			expires_at, absolute_expires_at, rotated_at, last_used_at,
			revoked, is_reused, created_at
	`

	row := db.QueryRow(ctx, query,
		session.UserId,
		session.RefreshTokenHash,
		session.TokenFamilyId,
		session.ExpiresAt,
		session.AbsoluteExpiresAt,
		session.Revoked,
		session.IsReused,
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
		&session.IsReused,
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

func (r *SessionRepository) GetRefreshToken(
	ctx context.Context,
	tokenRaw string,
) (*sessionpb.Session, error) {

	var (
		id                string
		refreshTokenHash  string
		userID            string
		tokenFamilyID     string
		revoked           bool
		isReused          bool
		expiresAt         time.Time
		absoluteExpiresAt time.Time
		revokedReason     sql.NullInt32
	)

	query := `
		SELECT
			id,
			user_id,
			refresh_token_hash,
			revoked,
			expires_at,
			token_family_id,
			is_reused,
			absolute_expires_at,
			revoked_reason
		FROM gd_sessions
		WHERE refresh_token_hash = $1
	`

	hashed := hashToken(tokenRaw)

	err := r.DB.Pool.QueryRow(ctx, query, hashed).Scan(
		&id,
		&userID,
		&refreshTokenHash,
		&revoked,
		&expiresAt,
		&tokenFamilyID,
		&isReused,
		&absoluteExpiresAt,
		&revokedReason,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			logger.Debug(
				"Refresh token not found",
				zap.String("RefreshTokenHash", hashed),
			)

			return nil, nil
		}

		logger.Error(
			"Failed to get refresh token",
			zap.Error(err),
			zap.String("RefreshTokenHash", hashed),
		)

		return nil, err
	}

	logger.Debug(
		"Refresh token retrieved",
		zap.String("SessionID", id),
		zap.String("UserID", userID),
	)

	return &sessionpb.Session{
		Id:                id,
		UserId:            userID,
		RefreshTokenHash:  refreshTokenHash,
		Revoked:           revoked,
		TokenFamilyId:     tokenFamilyID,
		IsReused:          isReused,
		ExpiresAt:         expiresAt.Format(time.RFC3339),
		AbsoluteExpiresAt: absoluteExpiresAt.Format(time.RFC3339),
	}, nil
}

func (r *SessionRepository) RotateSession(
	ctx context.Context,
	sessionID string,
	newSession *sessionpb.Session,
) (*sessionpb.Session, error) {

	tx, err := r.DB.Pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		logger.Error("Failed to begin transaction", zap.Error(err))
		return nil, err
	}

	defer func() {
		_ = tx.Rollback(ctx)
	}()

	query := `
		UPDATE gd_sessions
		SET revoked = true,
			revoked_reason = 1
		WHERE id = $1
	`

	cmdT, err := tx.Exec(ctx, query, sessionID)
	if err != nil {
		logger.Error("Failed to revoke session", zap.Error(err))
		return nil, err
	}

	if cmdT.RowsAffected() == 0 {
		err = errors.New("session not found")

		logger.Error("Session not found", zap.Error(err))

		return nil, err
	}

	session, err := r.insertSession(ctx, tx, newSession)
	if err != nil {
		logger.Error("Failed to insert session", zap.Error(err))
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		logger.Error("Failed to commit transaction", zap.Error(err))
		return nil, err
	}

	return session, nil
}
