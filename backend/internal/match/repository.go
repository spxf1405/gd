package match

import (
	"backend/internal/db"
	matchpb "backend/internal/gen/match/v1"
	"backend/internal/repository"
	"context"
	"database/sql"
	"fmt"
	"log"

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
		SELECT id, round_id, position_x, position_y FROM gd_matches WHERE round_id = ANY($1)
	`

	log.Println()
	rows, err := r.DB.Pool.Query(ctx, query, roundIds)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	matches := []*matchpb.Match{}

	for rows.Next() {
		match := &matchpb.Match{}

		var positionX, positionY sql.NullInt32

		err := rows.Scan(
			&match.Id,
			&match.RoundId,
			&positionX,
			&positionY,
		)
		if err != nil {
			return nil, err
		}

		if !positionX.Valid || !positionY.Valid {
			return nil, fmt.Errorf("position is NULL: match_id=%s", match.Id)
		}

		match.Position = &matchpb.Position{
			X: positionX.Int32,
			Y: positionY.Int32,
		}
		matches = append(matches, match)
	}

	return matches, nil
}
