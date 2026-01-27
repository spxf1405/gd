package user

import (
	"context"
)

type Service struct {
	repo *UserRepository
}

func NewService(repo *UserRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetByID(ctx context.Context, id int64) string {
	return "test"
}
