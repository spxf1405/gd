package tournament

import (
	"backend/internal/db"
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/repository"
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

type TournamentRepository struct {
	*repository.BaseRepository[*tournamentpb.Tournament]
}

func NewRepository(db *db.DB) *TournamentRepository {
	return &TournamentRepository{repository.NewBaseRepository[*tournamentpb.Tournament](db)}
}

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
	case tournamentpb.TournamentFilterBy_TOURNAMENT_FILTER_BY_TOTAL_PRIZE:
		return "total_prize"
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
	case tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_UNSPECIFIED:
		fallthrough
	default:
		return "created_at" // default sort
	}
}

func sortOrderToSQL(o tournamentpb.SortOrder) string {
	switch o {
	case tournamentpb.SortOrder_SORT_ORDER_DESC:
		return "DESC"

	case tournamentpb.SortOrder_SORT_ORDER_ASC:
		fallthrough
	case tournamentpb.SortOrder_SORT_ORDER_UNSPECIFIED:
		fallthrough
	default:
		return "ASC"
	}
}

func buildExpr(
	col string,
	op tournamentpb.FilterOperator,
	val string,
) (string, []any) {

	switch op {

	case tournamentpb.FilterOperator_EQ:
		return fmt.Sprintf("%s = $1", col), []any{val}

	case tournamentpb.FilterOperator_NEQ:
		return fmt.Sprintf("%s != $1", col), []any{val}

	case tournamentpb.FilterOperator_CONTAINS:
		return fmt.Sprintf("%s ILIKE '%%' || $1 || '%%'", col), []any{val}

	case tournamentpb.FilterOperator_NOT_CONTAINS:
		return fmt.Sprintf("%s NOT ILIKE '%%' || $1 || '%%'", col), []any{val}

	case tournamentpb.FilterOperator_STARTS_WITH:
		return fmt.Sprintf("%s ILIKE $1 || '%%'", col), []any{val}

	case tournamentpb.FilterOperator_ENDS_WITH:
		return fmt.Sprintf("%s ILIKE '%%' || $1", col), []any{val}

	case tournamentpb.FilterOperator_GT:
		return fmt.Sprintf("%s > $1", col), []any{val}

	case tournamentpb.FilterOperator_GTE:
		return fmt.Sprintf("%s >= $1", col), []any{val}

	case tournamentpb.FilterOperator_LT:
		return fmt.Sprintf("%s < $1", col), []any{val}

	case tournamentpb.FilterOperator_LTE:
		return fmt.Sprintf("%s <= $1", col), []any{val}

	case tournamentpb.FilterOperator_IS_NULL:
		return fmt.Sprintf("%s IS NULL", col), nil

	case tournamentpb.FilterOperator_IS_NOT_NULL:
		return fmt.Sprintf("%s IS NOT NULL", col), nil

	default:
		return fmt.Sprintf("%s ILIKE '%%' || $1 || '%%'", col), []any{val}
	}
}

func (r *TournamentRepository) getTournaments(ctx context.Context, params *tournamentpb.GetTournamentsRequestWrapper_Filter) ([]*tournamentpb.Tournament, error) {
	expr, args := buildExpr(
		filterByToColumn(params.Filter.FilterBy),
		params.Filter.FilterOperator,
		params.Filter.Filter,
	)

	query := fmt.Sprintf(
		`SELECT * FROM tournament WHERE %s ORDER BY %s %s`,
		expr,
		sortByToColumn(params.Filter.SortBy),
		sortOrderToSQL(params.Filter.SortOrder),
	)

	fmt.Println("====================")
	fmt.Println(query)

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	rows, err := r.DB.Pool.Query(ctx, query, args...)

	if err != nil {
		fmt.Println("err", err)
		return nil, err
	}

	defer rows.Close()

	var tournaments []*tournamentpb.Tournament

	for rows.Next() {
		var tournament = &tournamentpb.Tournament{}

		var location sql.NullString
		var createdAt, updateAt time.Time

		err := rows.Scan(
			&tournament.Id,
			&tournament.Name,
			&tournament.Type,
			&tournament.Format,
			&tournament.StartDate,
			&tournament.EndDate,
			&location,
			&tournament.TotalPrize,
			&tournament.EntryFee,
			&tournament.MaxPlayers,
			&tournament.RegisteredPlayers,
			&tournament.Status,
			&createdAt,
			&updateAt,
			&tournament.Organizer,
		)

		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		if location.Valid {
			tournament.Location = wrapperspb.String(location.String)
		}

		tournament.CreatedAt = createdAt.Format(time.RFC3339)
		tournament.UpdateAt = updateAt.Format(time.RFC3339)

		tournaments = append(tournaments, tournament)
	}

	return tournaments, nil
}

func (r *TournamentRepository) createTournament(ctx context.Context, name string) (uuid.UUID, error) {
	query := `INSERT INTO tournament (name) VALUES ($1) RETURNING id`

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	var id uuid.UUID
	err := r.DB.Pool.QueryRow(ctx, query, name).Scan(&id)

	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}
