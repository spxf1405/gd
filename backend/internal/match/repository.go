package match

import (
	"backend/internal/db"
	matchpb "backend/internal/gen/match/v1"
	"backend/internal/repository"
	"context"

	"github.com/google/uuid"
)

type MatchRepository struct {
	*repository.BaseRepository[*matchpb.Match]
}

func NewRepository(db *db.DB) *MatchRepository {
	return &MatchRepository{
		BaseRepository: repository.NewBaseRepository[*matchpb.Match](db),
	}
}

func (r *MatchRepository) GetMatchesByRoundIDs(ctx context.Context, roundIds []string) ([]*matchpb.Match, error) {
	uuids := []uuid.UUID{}

	for _, roundId := range roundIds {
		parsed, err := uuid.Parse(roundId)
		if err != nil {
			return nil, err
		}
		uuids = append(uuids, parsed)
	}

	query := `
		SELECT (id, round_id, position_x, position_y) FROM gd_matches WHERE id = ANY($1)
	`

	rows, err := r.DB.Pool.Query(ctx, query, roundIds)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	matches := []*matchpb.Match{}

	for rows.Next() {
		match := &matchpb.Match{}
		err := rows.Scan(
			&match.Id,
			&match.RoundId,
			&match.Position.X,
			&match.Position.Y,
		)

		if err != nil {
			return nil, err
		}

		matches = append(matches, match)
	}

	return matches, nil
}
