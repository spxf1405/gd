// Package match
package match

import (
	"backend/internal/db"
	matchpb "backend/internal/gen/match/v1"
	"backend/internal/repository"
	"context"

	"google.golang.org/protobuf/types/known/wrapperspb"
)

type MatchRepository struct {
	*repository.BaseRepository[*matchpb.Match]
}

func NewMatchRepository(db *db.DB) *MatchRepository {
	return &MatchRepository{repository.NewBaseRepository[*matchpb.Match](db)}
}

func (r *MatchRepository) GenerateMatches(ctx context.Context, tournamentId int32, players []string) ([]*matchpb.Match, error) {
	match := &matchpb.Match{
		Id:           wrapperspb.Int64(1),
		Player1Id:    wrapperspb.Int64(1),
		Player2Id:    wrapperspb.Int64(1),
		IsPlayer1Win: wrapperspb.Bool(true),
		IsPlayer2Win: wrapperspb.Bool(false),
		Player1Score: wrapperspb.Int64(9),
		Player2Score: wrapperspb.Int64(3),
		TournamentId: wrapperspb.Int64(1231),
		Display: &matchpb.Display{
			X: wrapperspb.Int64(100),
			Y: wrapperspb.Int64(100),
		},
	}
	return []*matchpb.Match{match}, nil
}
