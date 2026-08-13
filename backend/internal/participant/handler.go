package participant

import (
	participantpb "backend/internal/gen/participant/v1"
	"context"
	"fmt"

	"connectrpc.com/connect"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) GetParticipantsByTournamentID(
	ctx context.Context,
	req *connect.Request[participantpb.GetParticipantsByTournamentIDRequest],
) (*connect.Response[participantpb.GetParticipantsByTournamentIDResponse], error) {

	participants, err := h.service.GetParticipantsByTournamentID(ctx, req.Msg.TournamentId)
	if err != nil {
		return nil, fmt.Errorf("failed")
	}

	res := connect.NewResponse(&participantpb.GetParticipantsByTournamentIDResponse{
		Participants: participants,
	})
	return res, nil
}
