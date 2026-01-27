package player

import (
	playerpb "backend/internal/gen/player/v1"
	"context"
	"fmt"

	"connectrpc.com/connect"
	"google.golang.org/protobuf/types/known/emptypb"
)

type PlayerServiceHandler struct {
	service *Service
}

func (h *PlayerServiceHandler) GetPlayer(
	ctx context.Context,
	req *connect.Request[emptypb.Empty],
) (*connect.Response[playerpb.GetPlayerResponse], error) {
	players, err := h.service.getPlayers(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed")
	}

	res := connect.NewResponse(&playerpb.GetPlayerResponse{
		Players: players,
	})
	return res, nil
}
