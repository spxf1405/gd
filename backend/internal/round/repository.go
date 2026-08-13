package round

import (
	"backend/internal/db"
	roundpb "backend/internal/gen/round/v1"
	"backend/internal/logger"
	"backend/internal/repository"
	"context"
	"fmt"
	"strings"

	sq "github.com/Masterminds/squirrel"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
)

type RoundRepository struct {
	*repository.BaseRepository[*roundpb.Round]
}

func NewRepository(db *db.DB) *RoundRepository {
	return &RoundRepository{
		BaseRepository: repository.NewBaseRepository[*roundpb.Round](db),
	}
}

func (r *RoundRepository) GetRoundsByBracketIDs(ctx context.Context, bracketIDs []string) ([]*roundpb.Round, error) {
	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	qb := psql.
		Select(
			"round.id",
			"round.name",
			"round.bracket_id",
			"round.race_to",
			"round.elimination_type",
			"round.order_index",
		).
		From("gd_rounds round").
		Where(sq.Eq{"round.bracket_id": bracketIDs})

	query, args, err := qb.ToSql()

	if err != nil {
		return nil, err
	}

	rows, err := r.DB.Pool.Query(ctx, query, args...)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	rounds := []*roundpb.Round{}

	for rows.Next() {
		round := &roundpb.Round{}
		err := rows.Scan(
			&round.Id,
			&round.Name,
			&round.BracketId,
			&round.RaceTo,
			&round.EliminationType,
			&round.OrderIndex,
		)

		if err != nil {
			return nil, err
		}

		rounds = append(rounds, round)
	}

	return rounds, nil
}

func (r *RoundRepository) ReplaceRounds(ctx context.Context, bracketIDs []string, rounds []*roundpb.Round) error {
	if len(rounds) == 0 {
		return fmt.Errorf("no rounds provided")
	}

	tx, err := r.DB.Pool.BeginTx(ctx, pgx.TxOptions{})

	if err != nil {
		return fmt.Errorf("failed to create transaction %w", err)
	}

	defer func() {
		_ = tx.Rollback(ctx)
	}()

	deleteQuery := `DELETE FROM gd_rounds WHERE bracket_id = ANY($1)`

	commandTag, err := tx.Exec(ctx, deleteQuery, bracketIDs)

	if err != nil {
		return fmt.Errorf("delete rounds failed %w", err)
	}

	logger.Info("rounds deleted", zap.Any("number of rounds affected", commandTag.RowsAffected()))

	const columnCount = 5

	insertQuery := `INSERT INTO gd_rounds (
		bracket_id,
		name,
		race_to,
		elimination_type,
		order_index
	) VALUES `

	placeholders := make([]string, 0, len(rounds))
	params := make([]any, 0, len(rounds)*columnCount)

	for i, round := range rounds {
		paramIndex := i*columnCount + 1

		placeholders = append(placeholders,
			fmt.Sprintf("($%d,$%d,$%d,$%d,$%d)",
				paramIndex, paramIndex+1, paramIndex+2, paramIndex+3, paramIndex+4,
			),
		)

		params = append(params,
			round.BracketId,
			round.Name,
			round.RaceTo,
			round.EliminationType,
			round.OrderIndex,
		)
	}

	insertQuery += strings.Join(placeholders, ",")

	insCommandTag, err := tx.Exec(ctx, insertQuery, params...)

	if err != nil {
		logger.Error("insert rounds failed", zap.Error(err))
		return fmt.Errorf("insert rounds failed %w", err)
	}

	logger.Info("insert rounds succeed", zap.Any("row affected ", insCommandTag.RowsAffected()))

	if err := tx.Commit(ctx); err != nil {
		logger.Error("cannot commit tx %w", zap.Error(err))
		return fmt.Errorf("cannot commit tx")
	}

	return nil
}
