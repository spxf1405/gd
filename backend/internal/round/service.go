package round

import (
	roundpb "backend/internal/gen/round/v1"
	"backend/internal/logger"
	"context"

	"go.uber.org/zap"
)

type RoundService struct {
	repo *RoundRepository
}

func NewService(repo *RoundRepository) *RoundService {
	return &RoundService{repo: repo}
}

func (s *RoundService) GetRoundsByBracketIDs(ctx context.Context, bracketIDs []string) ([]*roundpb.Round, error) {
	rounds, err := s.repo.GetRoundsByBracketIDs(ctx, bracketIDs)

	if err != nil {
		return nil, err
	}

	return rounds, nil
}

func (s *RoundService) ReplaceRounds(ctx context.Context, tournamentID string, rounds []*roundpb.Round) error {
	err := s.repo.ReplaceRounds(ctx, tournamentID, rounds)

	if err != nil {
		logger.Error("replace rounds failed", zap.Error(err))
		return err
	}

	return nil
}
