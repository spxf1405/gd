package participant

import (
	participantpb "backend/internal/gen/participant/v1"
	"context"
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
