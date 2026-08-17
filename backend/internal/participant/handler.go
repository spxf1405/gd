package participant

import (
	participantpb "backend/internal/gen/participant/v1"
	"context"
	"fmt"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/emptypb"
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

	tournamentParticipants, err := h.service.GetParticipantsByTournamentID(ctx, req.Msg.TournamentId)
	if err != nil {
		return nil, fmt.Errorf("failed")
	}

	res := connect.NewResponse(&participantpb.GetParticipantsByTournamentIDResponse{
		TournamentParticipants: tournamentParticipants,
	})
	return res, nil
}

func (h *Handler) DeleteTournamentParticipantByID(
	ctx context.Context,
	req *connect.Request[participantpb.DeleteTournamentParticipantByIDRequest],
) (*connect.Response[emptypb.Empty], error) {
	if err := h.service.DeleteTournamentParticipantByID(ctx, req.Msg.Id); err != nil {
		return nil, err
	}

	return connect.NewResponse(&emptypb.Empty{}), nil
}
