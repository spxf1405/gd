package user

import (
	"backend/internal/db"
	userpb "backend/internal/gen/user/v1"
	"backend/internal/repository"
	"context"
	"fmt"
	"time"

	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

type UserRepository struct {
	*repository.BaseRepository[*userpb.User]
}

func NewRepository(db *db.DB) *repository.BaseRepository[*userpb.User] {
	return repository.NewBaseRepository[*userpb.User](db)
}

func (repo *UserRepository) GetUserByID(ctx context.Context, id int64) (*userpb.User, error) {
	if id == 1 {
		user := &userpb.User{
			Id:        wrapperspb.String("1"),
			Name:      wrapperspb.String("PNS"),
			CreatedAt: timestamppb.New(time.Now()),
			SecretKey: wrapperspb.String("303"),
		}
		return user, nil
	}
	return nil, fmt.Errorf("user with ID %d not found", id)
}
