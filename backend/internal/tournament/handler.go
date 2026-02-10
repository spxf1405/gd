package tournament

import (
	tournamentpb "backend/internal/gen/tournament/v1"
	"context"
	"errors"
	"log"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
)

type Hanlder struct {
	service   *Service
	validator protovalidate.Validator
}

func NewHandler(service *Service, validator protovalidate.Validator) *Hanlder {
	return &Hanlder{
		service:   service,
		validator: validator,
	}
}

func (h *Hanlder) GetTournaments(
	ctx context.Context,
	req *connect.Request[tournamentpb.GetTournamentsRequestWrapper],
) (*connect.Response[tournamentpb.GetTournamentsResponse], error) {
	params, ok := req.Msg.Request.(*tournamentpb.GetTournamentsRequestWrapper_Query)
	if !ok {
		return nil, connect.NewError(
			connect.CodeInvalidArgument,
			errors.New("Test1"),
		)
	}

	if err := h.validator.Validate(req.Msg); err != nil {
		log.Println("get tournaments failed:", err)

		return nil, connect.NewError(
			connect.CodeInvalidArgument,
			errors.New(""),
		)
	}

	tournaments, err := h.service.getTournaments(ctx, params)
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

func (h *Hanlder) CreateTournament(
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
