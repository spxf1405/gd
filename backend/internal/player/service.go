package player

import (
	playerpb "backend/internal/gen/player/v1"
	"context"
)

type Service struct {
	repo *PlayerRepository
}

func NewService(repo *PlayerRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) getPlayers(ctx context.Context) ([]*playerpb.Player, error) {
	player, err := s.repo.getPlayers(ctx)
	if err != nil {
		return nil, err
	}
	return player, nil
}
