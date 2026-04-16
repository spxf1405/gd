package bracket

import (
	bracketpb "backend/internal/gen/bracket/v1"
	"context"
)

type Service struct {
	repo *BracketRepository
}

func NewService(repo *BracketRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetBracketsByTournamentID(ctx context.Context, tournamentId string) ([]*bracketpb.Bracket, error) {
	brackets, err := s.repo.getBracketsByTournamentID(ctx, tournamentId)

	if err != nil {
		return nil, err
	}

	return brackets, nil
}
