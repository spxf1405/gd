package participant

import (
	participantpb "backend/internal/gen/participant/v1"
	"backend/internal/logger"
	"context"

	"go.uber.org/zap"
)

type Service struct {
	repo *ParticipantRepository
}

func NewService(repo *ParticipantRepository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetParticipantsByMatchIDs(ctx context.Context, matchIds []string) ([]*participantpb.Participant, error) {
	participants, err := s.repo.GetParticipantsByMatchIDs(ctx, matchIds)

	if err != nil {
		return nil, err
	}

	return participants, nil
}

func (s *Service) GetParticipantsByTournamentID(ctx context.Context, tournamentID string) ([]*participantpb.Participant, error) {
	logger.Info("tournament id", zap.String("id", tournamentID))
	participants, err := s.repo.GetParticipantsByTournamentID(ctx, tournamentID)

	if err != nil {
		logger.Error("Err", zap.Error(err))
		return nil, err
	}

	return participants, nil
}
