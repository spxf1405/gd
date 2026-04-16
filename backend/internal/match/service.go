package match

import (
	matchpb "backend/internal/gen/match/v1"
	"context"
)

type Service struct {
	repo *MatchRepository
}

func NewService(repo *MatchRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetMatchesByRoundIDs(ctx context.Context, roundIds []string) ([]*matchpb.Match, error) {
	matches, err := s.repo.GetMatchesByRoundIDs(ctx, roundIds)

	if err != nil {
		return nil, err
	}

	return matches, nil
}
