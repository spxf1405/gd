package match

import (
	matchpb "backend/internal/gen/match/v1"
	"context"
	"errors"

	"connectrpc.com/connect"
)

type MatchServiceHandler struct {
	service *MatchService
}

func (handler *MatchServiceHandler) GenerateMatches(
	ctx context.Context,
	req *connect.Request[matchpb.GenerateMatchesRequest],
) (*connect.Response[matchpb.GenerateMatchesResponse], error) {
	tournamentID := req.Msg.TournamentId
	playerIDs := req.Msg.PlayerIds

	matches, err := handler.service.GenerateMatches(ctx, tournamentID, playerIDs)
	if err != nil {
		return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("invalid input"))
	}

	rsp := &matchpb.GenerateMatchesResponse{
		Matches: matches,
	}

	return connect.NewResponse(rsp), nil
}

func (handler *MatchServiceHandler) GetMatchByID(
	ctx context.Context,
	req *connect.Request[matchpb.GetMatchByIDRequest],
) (*connect.Response[matchpb.GetMatchByIDResponse], error) {
	rsp := &matchpb.GetMatchByIDResponse{
		Match: nil,
	}

	return connect.NewResponse(rsp), nil
}
