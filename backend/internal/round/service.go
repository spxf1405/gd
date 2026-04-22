package round

import (
	roundpb "backend/internal/gen/round/v1"
	"context"
)

type Service struct {
	repo *RoundRepository
}

func NewService(repo *RoundRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetRoundsByBracketIDs(ctx context.Context, bracketIDs []string) ([]*roundpb.Round, error) {
	rounds, err := s.repo.GetRoundsByBracketIDs(ctx, bracketIDs)

	if err != nil {
		return nil, err
	}

	return rounds, nil
}
