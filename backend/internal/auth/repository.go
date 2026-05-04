package auth

import (
	"backend/internal/db"
	authpb "backend/internal/gen/auth/v1"
	"backend/internal/repository"
	"context"
)

type AuthRepository struct {
	*repository.BaseRepository[*authpb.User]
}

func NewRepository(db *db.DB) *AuthRepository {
	return &AuthRepository{
		BaseRepository: repository.NewBaseRepository[*authpb.User](db),
	}
}

func (r *AuthRepository) createUser(ctx context.Context, email string, googleUID string) (*authpb.User, error) {
	query := `
		INSERT INTO gd_users(email, google_uid)
		VALUES ($1, $2)
		ON CONFLICT (google_uid)
		DO UPDATE SET email = EXCLUDED.email
		RETURNING id, email, google_uid, created_at, (xmax = 0) AS inserted;
	`

	user := &authpb.User{}
	var isNew bool

	err := r.DB.Pool.QueryRow(ctx, query, email, googleUID).Scan(
		&user.Id,
		&user.Email,
		&user.Guid,
		&user.CreatedAt,
		&isNew,
	)
	if err != nil {
		return nil, err
	}

	user.IsNewUser = isNew
	return user, nil
}
