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

func (s *Service) getTournaments(ctx context.Context, params *tournamentpb.GetTournamentsRequestWrapper_Query) ([]*tournamentpb.Tournament, error) {
	tournaments, err := s.repo.getTournaments(ctx, params)
	if err != nil {
		return nil, err
	}
	return tournaments, nil
}

func (s *Service) getTournamentByID(ctx context.Context, id string) (*tournamentpb.Tournament, error) {
	tournament, err := s.repo.getTournamentByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return tournament, nil
}

func (s *Service) createTournament(ctx context.Context, name string) (uuid.UUID, error) {
	id, err := s.repo.createTournament(ctx, name)
	if err != nil {
		return uuid.Nil, err
	}
	return id, nil
}

func (s *Service) deleteTournament(ctx context.Context, name string) (string, error) {
	deletedAt, err := s.repo.deleteTournament(ctx, name)
	if err != nil {
		return "", err
	}
	return deletedAt, nil
}
