package tournament

import (
	tournamentpb "backend/internal/gen/tournament/v1"
	"context"
	"log"

	"github.com/google/uuid"
)

type Service struct {
	repo        *TournamentRepository
	assembleSvc *AssembleService
}

func NewService(repo *TournamentRepository, assembleSvc *AssembleService) *Service {
	return &Service{
		repo:        repo,
		assembleSvc: assembleSvc,
	}
}

func (s *Service) getTournaments(ctx context.Context, params *tournamentpb.GetTournamentsRequestWrapper_Query) ([]*tournamentpb.Tournament, error) {
	tournaments, err := s.repo.getTournaments(ctx, params)
	if err != nil {
		return nil, err
	}
	return tournaments, nil
}

// func (s *Service) getTournamentByID(ctx context.Context, id string) (*tournamentpb.Tournament, error) {
// 	tournament, err := s.repo.getTournamentByID(ctx, id)
// 	if err != nil {
// 		return nil, err
// 	}
// 	return tournament, nil
// }

func (s *Service) UpdateTournament(ctx context.Context, tournament *tournamentpb.Tournament) error {
	err := s.repo.UpdateTournament(ctx, tournament)
	if err != nil {
		return err
	}
	return nil
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

func toUUIDs(ids []string) ([]uuid.UUID, error) {
	uuids := []uuid.UUID{}
	for _, id := range ids {
		u, err := uuid.Parse(id)
		if err != nil {
			return nil, err
		}
		uuids = append(uuids, u)
	}
	return uuids, nil
}

func extractIDs[T interface{ GetId() string }](items []T) []string {
	ids := make([]string, len(items))
	for i, item := range items {
		ids[i] = item.GetId()
	}
	return ids
}

func (s *Service) getTournamentByID(ctx context.Context, id string) (*tournamentpb.Tournament, error) {
	log.Println("id", id)
	tournament, err := s.repo.getTournamentByID1(ctx, id)

	if err != nil {
		log.Println("getTournament error:", err)
		return nil, err
	}
	brackets, err := s.assembleSvc.AssembleTournament(ctx, tournament.GetId())

	if err != nil {
		return nil, err
	}

	tournament.Brackets = brackets

	return tournament, nil
}
