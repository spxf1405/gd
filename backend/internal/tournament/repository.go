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

func filterByToColumn(f tournamentpb.TournamentFilterBy) string {
	switch f {
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_NAME:
		return "t.name"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_TYPE:
		return "t.type"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_FORMAT:
		return "t.format"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_LOCATION:
		return "t.location"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_START_DATE:
		return "t.start_date"
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_STATUS:
		return "t.status"
	default:
		return ""
	}
}

func sortByToColumn(f tournamentpb.TournamentSortBy) string {
	switch f {
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_CREATED_AT:
		return "t.created_at"
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_START_DATE:
		return "t.start_date"
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_END_DATE:
		return "t.end_date"
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_TOTAL_PRIZE:
		return "t.total_prize"
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_NAME:
		return "t.name"
	default:
		return "t.created_at"
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

func (r *TournamentRepository) getTournaments(
	ctx context.Context,
	params *tournamentpb.GetTournamentsRequestWrapper_Query,
) ([]*tournamentpb.Tournament, error) {
	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	qb := psql.
		Select(
			"t.id",
			"t.name",
			"t.type",
			"t.format",
			"t.start_date",
			"t.end_date",
			"t.location",
			"t.total_prize",
			"t.entry_fee",
			"t.max_players",
			"t.status",
			"t.created_at",
			"t.updated_at",
			"t.organizer",
			`COALESCE(
				json_agg(
					json_build_object(
						'id', p.id,
						'name', p.name
					)
				) FILTER (WHERE p.id IS NOT NULL),
				'[]'
			) AS registed_players`,
		).
		From("tournaments t").
		LeftJoin("registrations r ON r.tournament_id = t.id").
		LeftJoin("players p ON p.id = r.player_id").
		GroupBy(`
			t.id,
			t.name,
			t.type,
			t.format,
			t.start_date,
			t.end_date,
			t.location,
			t.total_prize,
			t.entry_fee,
			t.max_players,
			t.status,
			t.created_at,
			t.updated_at,
			t.organizer
		`)

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

		var typeT, location, format, totalPrize sql.NullString
		var createdAt, updatedAt time.Time
		var startDate sql.NullTime
		var max_players sql.NullInt32

		err := rows.Scan(
			&t.Id,
			&t.Name,
			&typeT,
			&format,
			&startDate,
			&t.EndDate,
			&location,
			&totalPrize,
			&t.EntryFee,
			&max_players,
			&t.Status,
			&createdAt,
			&updatedAt,
			&t.Organizer,
			&t.RegisteredPlayers,
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

		if typeT.Valid {
			t.Type = wrapperspb.String(typeT.String)
		}

		if format.Valid {
			t.Format = wrapperspb.String(format.String)
		}

		if totalPrize.Valid {
			t.TotalPrize = wrapperspb.String(totalPrize.String)
		}

		if max_players.Valid {
			t.MaxPlayers = wrapperspb.Int32(max_players.Int32)
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
