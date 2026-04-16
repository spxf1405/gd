package round

import (
	"backend/internal/db"
	roundpb "backend/internal/gen/round/v1"
	"backend/internal/repository"
	"context"

	sq "github.com/Masterminds/squirrel"
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
		)

		if err != nil {
			return nil, err
		}

		rounds = append(rounds, round)
	}

	return rounds, nil
}
