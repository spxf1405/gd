package bracket

import (
	"backend/internal/db"
	bracketpb "backend/internal/gen/bracket/v1"
	"backend/internal/repository"
	"context"
	"errors"
	"fmt"

	sq "github.com/Masterminds/squirrel"
)

type BracketRepository struct {
	*repository.BaseRepository[*bracketpb.Bracket]
}

func NewRepository(db *db.DB) *BracketRepository {
	return &BracketRepository{
		BaseRepository: repository.NewBaseRepository[*bracketpb.Bracket](db),
	}
}

func (r *BracketRepository) GetBracketsByTournamentID(ctx context.Context, tournamentId string) ([]*bracketpb.Bracket, error) {
	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	qb := psql.
		Select(
			"b.id",
			"b.name",
			"b.side",
		).
		From("gd_brackets b").
		Where(sq.Eq{"b.tournament_id": tournamentId})

	query, args, err := qb.ToSql()
	fmt.Println(query)

	if err != nil {
		fmt.Println("err", err)
		return nil, err
	}

	rows, err := r.DB.Pool.Query(ctx, query, args...)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	brackets := []*bracketpb.Bracket{}

	for rows.Next() {
		bracket := &bracketpb.Bracket{}
		err := rows.Scan(
			&bracket.Id,
			&bracket.Name,
			&bracket.Side,
		)

		if err != nil {
			return nil, err
		}

		brackets = append(brackets, bracket)
	}

	return brackets, nil
}

func (r *BracketRepository) CreateBracketsByTournamentID(ctx context.Context, tournamentID string) error {
	query := `INSERT INTO gd_brackets VALUES ($1, 'Nhánh thắng', 'winner'), ($1, 'Nhánh thua', 'loser')`

	cmtTag, err := r.DB.Pool.Exec(ctx, query, tournamentID, tournamentID)

	if err != nil {
		return err
	}

	if cmtTag.RowsAffected() == 0 {
		return errors.New("can't create brackets")
	}

	return nil
}
