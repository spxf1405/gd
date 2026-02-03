package tournament

import (
	tournamentpb "backend/internal/gen/tournament/v1"
	"context"
	"errors"
	"fmt"

	"connectrpc.com/connect"
)

type tournamentServiceHandler struct {
	service *Service
}

func (h *tournamentServiceHandler) GetTournaments(
	ctx context.Context,
	req *connect.Request[tournamentpb.GetTournamentsRequestWrapper],
) (*connect.Response[tournamentpb.GetTournamentsResponse], error) {
	var query = ""
	params, ok := req.Msg.Request.(*tournamentpb.GetTournamentsRequestWrapper_Filter)
	if ok {
		fmt.Print(params)
	}
	fmt.Println("=========================")
	fmt.Println(params)

	tournaments, err := h.service.getTournaments(ctx, req)
	if err != nil {
		return nil, connect.NewError(
			connect.CodeInternal,
			errors.New("internal server error"),
		)
	}

	res := connect.NewResponse(&tournamentpb.GetTournamentsResponse{
		Tournaments: tournaments,
	})

	return res, nil
}

func (h *tournamentServiceHandler) CreateTournament(
	ctx context.Context,
	req *connect.Request[tournamentpb.CreateTournamentRequest],
) (*connect.Response[tournamentpb.CreateTournamentResponse], error) {
	id, err := h.service.createTournament(ctx, req.Msg.Name)
	if err != nil {
		return nil, connect.NewError(
			connect.CodeInternal,
			errors.New("internal server error"),
		)
	}

	res := connect.NewResponse(&tournamentpb.CreateTournamentResponse{
		Id: id.String(),
	})

	return res, nil
}
