package match

import (
	"backend/internal/db"
	matchpb "backend/internal/gen/match/v1"
	"backend/internal/logger"
	"backend/internal/repository"
	"context"
	"database/sql"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
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

func (r *MatchRepository) AddMatches(ctx context.Context, matches []*matchpb.Match) error {
	for _, match := range matches {
		match.Id = uuid.NewString()
	}

	logger.Dump(matches)

	tx, err := r.DB.Pool.Begin(ctx)

	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	batch := &pgx.Batch{}

	insertMatchesQuery := `INSERT INTO gd_matches (id, round_id, display_order, match_index, round, side, is_auto_win, is_skipped, position_x, position_y) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`
	insertMatchParticipantsQuery := `INSERT INTO gd_match_participants (participant_id, match_id, slot, score, is_winner) values ($1, $2, $3, $4, $5)`

	for _, match := range matches {
		batch.Queue(insertMatchesQuery, match.Id, match.RoundId, match.DisplayOrder, match.MatchIndex, match.Round, match.Side, match.IsAutoWin, match.IsSkipped, match.Position.X, match.Position.Y)
		for _, p := range match.Participants {
			if p.Id != "" {
				logger.Dump(p.PlayerId)
				batch.Queue(insertMatchParticipantsQuery, p.Id, match.Id, p.Slot, p.Score, p.IsWinner)
			}
		}
	}

	br := tx.SendBatch(ctx, batch)

	for i := 0; i < batch.Len(); i++ {
		if _, err := br.Exec(); err != nil {
			fmt.Printf("batch query %d failed: %v\n", i, err)
			br.Close()
			return err
		}

		fmt.Printf("batch query %d OK\n", i)
	}

	if err := br.Close(); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}

	return nil
}
