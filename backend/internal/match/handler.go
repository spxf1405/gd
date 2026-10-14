package match

import (
	matchpb "backend/internal/gen/match/v1"
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

func (h *Handler) AddMatches(
	ctx context.Context,
	req *connect.Request[matchpb.AddMatchesRequest],
) (*connect.Response[matchpb.AddMatchesResponse], error) {

	err := h.service.AddMatches(ctx, req.Msg.Matches)
	if err != nil {
		return nil, fmt.Errorf("failed to add matches: %w", err)
	}

	res := connect.NewResponse(&matchpb.AddMatchesResponse{
		Empty: &emptypb.Empty{},
	})

	return res, nil
}
