package round

import (
	roundpb "backend/internal/gen/round/v1"
	"context"
	"errors"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/emptypb"
)

type RoundHandler struct {
	service *RoundService
}

func NewHandler(service *RoundService) *RoundHandler {
	return &RoundHandler{
		service: service,
	}
}

func (h *RoundHandler) ReplaceRounds(ctx context.Context, req *connect.Request[roundpb.ReplaceRoundsRequest]) (*connect.Response[emptypb.Empty], error) {

	if err := h.service.ReplaceRounds(ctx, req.Msg.TournamentId, req.Msg.Rounds); err != nil {
		//TODO: Internal server error is too general, fix with app internal code
		return nil, connect.NewError(connect.CodeInternal, errors.New("internal server error"))
	}

	return connect.NewResponse(&emptypb.Empty{}), nil
}
