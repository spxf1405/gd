package tournament

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"backend/internal/db"
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/repository"

	sq "github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

type TournamentRepository struct {
	*repository.BaseRepository[*tournamentpb.Tournament]
}

func NewRepository(db *db.DB) *TournamentRepository {
	return &TournamentRepository{
		BaseRepository: repository.NewBaseRepository[*tournamentpb.Tournament](db),
	}
}

/* =========================
   Column mapping helpers
   ========================= */

func filterByToColumn(f tournamentpb.TournamentFilterBy) string {
	switch f {
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_NAME:
		return "name"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_TYPE:
		return "type"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_FORMAT:
		return "format"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_LOCATION:
		return "location"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_START_DATE:
		return "start_date"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_STATUS:
		return "status"
	default:
		return ""
	}
}

func sortByToColumn(f tournamentpb.TournamentSortBy) string {
	switch f {
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_CREATED_AT:
		return "created_at"
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_START_DATE:
		return "start_date"
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_END_DATE:
		return "end_date"
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_TOTAL_PRIZE:
		return "total_prize"
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_NAME:
		return "name"
	default:
		return "created_at"
	}
}

func sortOrderToSQL(o tournamentpb.SortOrder) string {
	switch o {
	case tournamentpb.SortOrder_SORT_ORDER_DESC:
		return "DESC"
	default:
		return "ASC"
	}
}

/* =========================
   Filter builder
   ========================= */

func buildExpr(
	col string,
	op tournamentpb.FilterOperator,
	val string,
) sq.Sqlizer {

	switch op {

	case tournamentpb.FilterOperator_EQ:
		return sq.Eq{col: val}

	case tournamentpb.FilterOperator_NEQ:
		return sq.NotEq{col: val}

	case tournamentpb.FilterOperator_CONTAINS:
		return sq.Expr(col+" ILIKE ?", "%"+val+"%")

	case tournamentpb.FilterOperator_NOT_CONTAINS:
		return sq.Expr(col+" NOT ILIKE ?", "%"+val+"%")

	case tournamentpb.FilterOperator_STARTS_WITH:
		return sq.Expr(col+" ILIKE ?", val+"%")

	case tournamentpb.FilterOperator_ENDS_WITH:
		return sq.Expr(col+" ILIKE ?", "%"+val)

	case tournamentpb.FilterOperator_GT:
		return sq.Gt{col: val}

	case tournamentpb.FilterOperator_GTE:
		return sq.GtOrEq{col: val}

	case tournamentpb.FilterOperator_LT:
		return sq.Lt{col: val}

	case tournamentpb.FilterOperator_LTE:
		return sq.LtOrEq{col: val}

	case tournamentpb.FilterOperator_IS_NULL:
		return sq.Expr(col + " IS NULL")

	case tournamentpb.FilterOperator_IS_NOT_NULL:
		return sq.Expr(col + " IS NOT NULL")

	default:
		return sq.Expr(col+" ILIKE ?", "%"+val+"%")
	}
}

/* =========================
   Query
   ========================= */

func (r *TournamentRepository) getTournaments(
	ctx context.Context,
	params *tournamentpb.GetTournamentsRequestWrapper_Query,
) ([]*tournamentpb.Tournament, error) {
	fmt.Println("params", params)
	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	qb := psql.
		Select(
			"id",
			"name",
			"type",
			"format",
			"start_date",
			"end_date",
			"location",
			"total_prize",
			"entry_fee",
			"max_players",
			"registered_players",
			"status",
			"created_at",
			"updated_at",
			"organizer",
		).
		From("tournament")

	if params != nil {
		for _, f := range params.Query.Filters {
			col := filterByToColumn(f.FilterBy)
			if col == "" {
				continue
			}

			qb = qb.Where(buildExpr(
				col,
				f.FilterOperator,
				f.Filter,
			))
		}
	}

	sortBy := tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_CREATED_AT
	sortOrder := tournamentpb.SortOrder_SORT_ORDER_ASC

	if params != nil && params.Query != nil {
		sortBy = params.Query.SortBy
		sortOrder = params.Query.SortOrder
	}

	qb = qb.OrderBy(
		fmt.Sprintf(
			"%s %s",
			sortByToColumn(sortBy),
			sortOrderToSQL(sortOrder),
		),
	)

	query, args, err := qb.ToSql()
	fmt.Println("query", query)
	if err != nil {
		return nil, err
	}

	rows, err := r.DB.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tournaments []*tournamentpb.Tournament

	for rows.Next() {
		t := &tournamentpb.Tournament{}

		var location sql.NullString
		var createdAt, updatedAt time.Time
		var startDate sql.NullTime

		err := rows.Scan(
			&t.Id,
			&t.Name,
			&t.Type,
			&t.Format,
			&startDate,
			&t.EndDate,
			&location,
			&t.TotalPrize,
			&t.EntryFee,
			&t.MaxPlayers,
			&t.RegisteredPlayers,
			&t.Status,
			&createdAt,
			&updatedAt,
			&t.Organizer,
		)
		if err != nil {
			fmt.Println("err", err)
			return nil, err
		}

		if location.Valid {
			t.Location = wrapperspb.String(location.String)
		}

		t.CreatedAt = createdAt.Format(time.RFC3339)
		t.UpdateAt = updatedAt.Format(time.RFC3339)

		if startDate.Valid {
			t.StartDate = wrapperspb.String(startDate.Time.Format(time.RFC3339))
		}

		tournaments = append(tournaments, t)
	}

	return tournaments, nil
}

/* =========================
   Create
   ========================= */

func (r *TournamentRepository) createTournament(
	ctx context.Context,
	name string,
) (uuid.UUID, error) {

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	query := `INSERT INTO tournament (name) VALUES ($1) RETURNING id`

	var id uuid.UUID
	err := r.DB.Pool.QueryRow(ctx, query, name).Scan(&id)
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}
