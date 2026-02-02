package tournament

import (
	tournamentpb "backend/internal/gen/tournament/v1"
	"context"

	"github.com/google/uuid"
)

type Service struct {
	repo *TournamentRepository
}

func NewService(repo *TournamentRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) getTournaments(ctx context.Context) ([]*tournamentpb.Tournament, error) {
	tournaments, err := s.repo.getTournaments(ctx)
	if err != nil {
		return nil, err
	}
	return tournaments, nil
}

func (s *Service) createTournament(ctx context.Context, name string) (uuid.UUID, error) {
	id, err := s.repo.createTournament(ctx, name)
	if err != nil {
		return uuid.Nil, err
	}
	return id, nil
}
