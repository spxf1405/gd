package match

import (
	"backend/internal/db"
	matchpb "backend/internal/gen/match/v1"
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/logger"
	"backend/internal/repository"
	"context"
	"database/sql"
	"errors"
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
		SELECT id, round_id, position_x, position_y, match_index, display_order FROM gd_matches WHERE round_id = ANY($1)
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

		var positionX, positionY, matchIndex, displayOrder sql.NullInt32

		err := rows.Scan(
			&match.Id,
			&match.RoundId,
			&positionX,
			&positionY,
			&matchIndex,
			&displayOrder,
		)

		if err != nil {
			return nil, err
		}

		if !positionX.Valid || !positionY.Valid || !matchIndex.Valid || !displayOrder.Valid {
			return nil, fmt.Errorf("position is NULL: match_id=%s", match.Id)
		}

		match.MatchIndex = matchIndex.Int32

		match.Position = &matchpb.Position{
			X: positionX.Int32,
			Y: positionY.Int32,
		}

		match.DisplayOrder = displayOrder.Int32
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

func (r *MatchRepository) setWinner(ctx context.Context, matchId string, winnerParticipantId string) error {
	tx, err := r.DB.Pool.Begin(ctx)

	if err != nil {
		logger.Error("cant create tx")
		return err
	}

	defer tx.Rollback(ctx)

	var selectTournamentQuery = `
		SELECT
			m.id,
			tournament.status,
			round.raceTo,
			COALESCE(
				(
					SELECT json_agg(
						json_build_object(
							'participant_id', participant.id,
							'participant_name', player.name,
							'slot': match_participant.slot,
							'score': match_participant.score
						)
					)
					FROM gd_match_participants match_participant
					JOIN gd_participants participant
						ON participant.id = match_participant.participant_id
					JOIN gd_players player
						ON player.id = participant.player_id
					WHERE match_participant.match_id = m.id
				),
				'[]'::json
			) AS participants
		FROM
			gd_matches m
		JOIN
			gd_rounds round ON m.round_id = round.id
		JOIN
			gd_brackets bracket ON round.bracket_id = bracket.id
		JOIN
			gd_tournaments tournament ON bracket.tournament_id = tournament.id
		WHERE
			m.id = $1
		FOR UPDATE OF m;
	`

	match := &matchpb.Match{}

	tournament := &tournamentpb.Tournament{}

	err = tx.QueryRow(ctx, selectTournamentQuery, matchId).Scan(&tournament.Status)

	if err != nil {
		logger.Error("tournament doesn't exist")
		return err
	}

	if tournament.Status != tournamentpb.TournamentStatus_TOURNAMENT_STATUS_RUNNING {
		var eMsg = "tournament aren't running"
		logger.Error(eMsg)
		return errors.New(eMsg)
	}

	if err := tx.Commit(ctx); err != nil {
		logger.Error("can't commit transaction")
		return err
	}

	return nil
}
