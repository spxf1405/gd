package tournament

import (
	roundpb "backend/internal/gen/round/v1"
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/logger"
	"context"
	"fmt"
	"log"

	"github.com/google/uuid"
	"go.uber.org/zap"
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
		logger.Debug("Debug", zap.Error(err))
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
	tournament, err := s.repo.getTournamentByID(ctx, id)

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

func (s *Service) ChangeTournamentStatus(
	ctx context.Context,
	id string,
	status tournamentpb.TournamentStatus,
) (tournamentpb.TournamentErrorCode, error) {
	tournament, err := s.repo.getTournamentByID(ctx, id)

	if err != nil {
		return tournamentpb.TournamentErrorCode_UNSPECIFIED, fmt.Errorf("get tournament %s: %w", id, err)
	}

	if status == tournamentpb.TournamentStatus_TOURNAMENT_STATUS_REGISTERING {
		if tournament.Venue == nil {
			return tournamentpb.TournamentErrorCode_VENUE_REQUIRED, nil
		}
		if tournament.Name == "" {
			return tournamentpb.TournamentErrorCode_NAME_REQUIRED, nil
		}
	}

	if status == tournamentpb.TournamentStatus_TOURNAMENT_STATUS_REGISTRATION_CLOSED {
		var rounds []*roundpb.Round

		for _, bracket := range tournament.Brackets {
			rounds = append(rounds, bracket.Rounds...)
		}

		if len(rounds) == 0 {
			return tournamentpb.TournamentErrorCode_ROUNDS_REQUIRED, nil
		}
	}

	err = s.repo.changeTournamentStatus(ctx, id, int(status))

	if err != nil {
		return tournamentpb.TournamentErrorCode_UNSPECIFIED, fmt.Errorf("change tournament status %s: %w", id, err)
	}

	return tournamentpb.TournamentErrorCode_UNSPECIFIED, nil
}
