package tournament

import (
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/logger"
	"context"
	"errors"
	"fmt"
	"log"

	"buf.build/go/protovalidate"
	"connectrpc.com/connect"
	"go.uber.org/zap"
	"google.golang.org/protobuf/types/known/emptypb"
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
	fmt.Println("============================================")
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

func (h *Hanlder) GetTournamentByID(ctx context.Context, req *connect.Request[tournamentpb.GetTournamentByIDRequest]) (*connect.Response[tournamentpb.GetTournamentByIDResponse], error) {
	tournament, err := h.service.getTournamentByID(ctx, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(
			connect.CodeInternal,
			errors.New("internal server error"),
		)
	}

	res := connect.NewResponse(&tournamentpb.GetTournamentByIDResponse{
		Tournament: tournament,
	})

	return res, nil
}

func (h *Hanlder) UpdateTournament(
	ctx context.Context,
	req *connect.Request[tournamentpb.UpdateTournamentRequest],
) (*connect.Response[emptypb.Empty], error) {
	err := h.service.UpdateTournament(ctx, req.Msg.Tournament)

	if err != nil {
		return nil, connect.NewError(
			connect.CodeInternal,
			errors.New("internal server error"),
		)
	}

	res := connect.NewResponse(&emptypb.Empty{})

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

func (h *Hanlder) DeleteTournament(
	ctx context.Context,
	req *connect.Request[tournamentpb.DeleteTournamentRequest],
) (*connect.Response[tournamentpb.DeleteTournamentResponse], error) {
	deletedAt, err := h.service.deleteTournament(ctx, req.Msg.Id)
	if err != nil {
		return nil, connect.NewError(
			connect.CodeInternal,
			errors.New("internal server error"),
		)
	}

	res := connect.NewResponse(&tournamentpb.DeleteTournamentResponse{
		DeletedAt: deletedAt,
	})

	return res, nil
}

func (h *Hanlder) ChangeTournamentStatus(
	ctx context.Context,
	req *connect.Request[tournamentpb.ChangeTournamentStatusRequest],
) (*connect.Response[emptypb.Empty], error) {
	code, err := h.service.ChangeTournamentStatus(ctx, req.Msg.Id, req.Msg.Status)
	if err != nil {
		logger.Error("failed to change tournament status",
			zap.String("tournament_id", req.Msg.Id),
			zap.Error(err),
		)

		return nil, connect.NewError(connect.CodeInternal, err)
	}

	if code != tournamentpb.TournamentErrorCode_UNSPECIFIED {
		cErr := connect.NewError(connect.CodeFailedPrecondition, errors.New(code.String()))

		detail, dErr := connect.NewErrorDetail(&tournamentpb.TournamentError{Code: code})
		if dErr != nil {
			logger.Error("failed to create error detail", zap.Error(dErr))
			return nil, cErr
		}

		cErr.AddDetail(detail)

		return nil, cErr
	}

	return connect.NewResponse(&emptypb.Empty{}), nil
}
