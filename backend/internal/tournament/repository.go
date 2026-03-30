package tournament

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"backend/internal/db"
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/repository"

	sq "github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
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
	val *tournamentpb.FilterValue,
) sq.Sqlizer {

	switch op {

	case tournamentpb.FilterOperator_EQ:
		return sq.Eq{col: val.GetStringValue()}

	case tournamentpb.FilterOperator_NEQ:
		return sq.NotEq{col: val.GetStringValue()}

	case tournamentpb.FilterOperator_CONTAINS:
		return sq.Expr(col+" ILIKE ?", "%"+val.GetStringValue()+"%")

	case tournamentpb.FilterOperator_NOT_CONTAINS:
		return sq.Expr(col+" NOT ILIKE ?", "%"+val.GetStringValue()+"%")

	case tournamentpb.FilterOperator_STARTS_WITH:
		return sq.Expr(col+" ILIKE ?", val.GetStringValue()+"%")

	case tournamentpb.FilterOperator_ENDS_WITH:
		return sq.Expr(col+" ILIKE ?", "%"+val.GetStringValue())

	case tournamentpb.FilterOperator_GT:
		return sq.Gt{col: val.GetStringValue()}

	case tournamentpb.FilterOperator_GTE:
		return sq.GtOrEq{col: val.GetStringValue()}

	case tournamentpb.FilterOperator_LT:
		return sq.Lt{col: val.GetStringValue()}

	case tournamentpb.FilterOperator_LTE:
		return sq.LtOrEq{col: val.GetStringValue()}

	case tournamentpb.FilterOperator_IS_NULL:
		return sq.Expr(col + " IS NULL")

	case tournamentpb.FilterOperator_IS_NOT_NULL:
		return sq.Expr(col + " IS NOT NULL")

	case tournamentpb.FilterOperator_SET:
		switch val.Kind.(type) {

		case *tournamentpb.FilterValue_Int32List:
			values := val.GetInt32List().Values
			return sq.Eq{col: values}

		case *tournamentpb.FilterValue_StringList:
			values := val.GetStringList().Values
			return sq.Eq{col: values}
		}

		// Just default return
		return sq.Expr(col+" ILIKE ?", "%"+val.GetStringValue()+"%")

	// Just default return
	default:
		return sq.Expr(col+" ILIKE ?", "%"+val.GetStringValue()+"%")
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
			"t.format_description",
			"t.start_date",
			"t.end_date",
			"t.location",
			"t.total_prize",
			"t.entry_fee",
			"t.max_players",
			"t.status",
			"t.organizer",
			"t.created_at",
			"t.updated_at",
			"t.description",
			"t.max_age",
			"t.has_ranking",
			"t.max_ranking_class",
			"t.gender",
			`COALESCE(
				json_agg(
					json_build_object(
						'id', p.id,
						'name', p.name
					)
				) FILTER (WHERE p.id IS NOT NULL),
				'[]'
			) AS registered_players`,
		).
		From("tournaments t").
		LeftJoin("registrations r ON r.tournament_id = t.id").
		LeftJoin("players p ON p.id = r.player_id").
		GroupBy(`
			t.id,
			t.name,
			t.type,
			t.format,
			t.format_description,
			t.start_date,
			t.end_date,
			t.location,
			t.total_prize,
			t.entry_fee,
			t.max_players,
			t.status,
			t.organizer,
			t.created_at,
			t.updated_at,
			t.description,
			t.max_age,
			t.has_ranking,
			t.max_ranking_class,
			t.gender
		`)

	qb = qb.Where(sq.Eq{"deleted_at": nil})

	if params != nil {
		for _, f := range params.Query.Filters {
			col := filterByToColumn(f.FilterBy)
			if col == "" {
				continue
			}

			qb = qb.Where(buildExpr(
				col,
				f.FilterOperator,
				f.Value,
			))
		}
	}

	sortBy := tournamentpb.TournamentSortBy_TOURNAMENT_SORT_BY_CREATED_AT
	sortOrder := tournamentpb.SortOrder_SORT_ORDER_ASC

	if params != nil && params.Query != nil {
		sortBy = params.Query.SortBy
		sortOrder = params.Query.SortOrder
	}

	if sortOrder != tournamentpb.SortOrder_SORT_ORDER_UNSPECIFIED {
		qb = qb.OrderBy(
			fmt.Sprintf(
				"%s %s",
				sortByToColumn(sortBy),
				sortOrderToSQL(sortOrder),
			),
		)
	}

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

		var location, totalPrize, organizer, formatDescription, description, entryFee sql.NullString
		var createdAt, updatedAt time.Time
		var startDate sql.NullTime
		var maxPlayers sql.NullInt32
		var maxRankingClass sql.NullString

		err := rows.Scan(
			&t.Id,
			&t.Name,
			&t.Type,
			&t.Format,
			&formatDescription,
			&startDate,
			&t.EndDate,
			&location,
			&totalPrize,
			&entryFee,
			&maxPlayers,
			&t.Status,
			&organizer,
			&createdAt,
			&updatedAt,
			&description,
			&t.MaxAge,
			&t.HasRanking,
			&maxRankingClass,
			&t.Gender,
			&t.RegisteredPlayers,
		)

		if err != nil {
			fmt.Println(err)
			return nil, err
		}

		if formatDescription.Valid {
			t.FormatDescription = wrapperspb.String(formatDescription.String)
		}

		if description.Valid {
			t.Description = wrapperspb.String(description.String)
		}

		if location.Valid {
			t.Location = wrapperspb.String(location.String)
		}

		t.CreatedAt = createdAt.Format(time.RFC3339)
		t.UpdateAt = updatedAt.Format(time.RFC3339)

		if startDate.Valid {
			t.StartDate = wrapperspb.String(startDate.Time.Format(time.RFC3339))
		}

		if totalPrize.Valid {
			t.TotalPrize = wrapperspb.String(totalPrize.String)
		}

		if maxPlayers.Valid {
			t.MaxPlayers = wrapperspb.Int32(maxPlayers.Int32)
		}

		if organizer.Valid {
			t.Organizer = wrapperspb.String(organizer.String)
		}

		if entryFee.Valid {
			t.EntryFee = wrapperspb.String(entryFee.String)
		}

		tournaments = append(tournaments, t)
	}

	return tournaments, nil
}

func (r *TournamentRepository) getTournamentByID(ctx context.Context, id string) (*tournamentpb.Tournament, error) {
	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)

	queryBuilder := psql.Select(
		"t.id",
		"t.name",
		"t.type",
		"t.format",
		"t.format_description",
		"t.start_date",
		"t.end_date",
		"t.location",
		"t.total_prize",
		"t.entry_fee",
		"t.max_players",
		"t.status",
		"t.organizer",
		"t.created_at",
		"t.updated_at",
		"t.description",
		"t.max_age",
		"t.has_ranking",
		"t.max_ranking_class",
		"t.gender",
		`COALESCE(
				json_agg(
					json_build_object(
						'id', p.id,
						'name', p.name
					)
				) FILTER (WHERE p.id IS NOT NULL),
				'[]'
			) AS registered_players`,
	).
		From("tournaments t").
		LeftJoin("registrations r ON r.tournament_id = t.id").
		LeftJoin("players p ON p.id = r.player_id").
		GroupBy(`
			t.id,
			t.name,
			t.type,
			t.format,
			t.format_description,
			t.start_date,
			t.end_date,
			t.location,
			t.total_prize,
			t.entry_fee,
			t.max_players,
			t.status,
			t.organizer,
			t.created_at,
			t.updated_at,
			t.description,
			t.max_age,
			t.has_ranking,
			t.max_ranking_class,
			t.gender
		`).
		Where(sq.Eq{"t.id": id})

	query, args, err := queryBuilder.ToSql()

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	row := r.DB.Pool.QueryRow(ctx, query, args...)

	tournament := &tournamentpb.Tournament{}

	var location, totalPrize, organizer, formatDescription, description, entryFee, maxRankingClass sql.NullString
	var createdAt, updatedAt time.Time
	var startDate sql.NullTime
	var maxPlayers sql.NullInt32

	err = row.Scan(
		&tournament.Id,
		&tournament.Name,
		&tournament.Type,
		&tournament.Format,
		&formatDescription,
		&startDate,
		&tournament.EndDate,
		&location,
		&totalPrize,
		&entryFee,
		&maxPlayers,
		&tournament.Status,
		&organizer,
		&createdAt,
		&updatedAt,
		&description,
		&tournament.MaxAge,
		&tournament.HasRanking,
		&maxRankingClass,
		&tournament.Gender,
		&tournament.RegisteredPlayers,
	)

	if err != nil {
		fmt.Println("err", err)
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	if location.Valid {
		tournament.Location = wrapperspb.String(location.String)
	}

	if formatDescription.Valid {
		tournament.FormatDescription = wrapperspb.String(formatDescription.String)
	}

	if description.Valid {
		tournament.Description = wrapperspb.String(description.String)
	}

	tournament.CreatedAt = createdAt.Format(time.RFC3339)
	tournament.UpdateAt = updatedAt.Format(time.RFC3339)

	if startDate.Valid {
		tournament.StartDate = wrapperspb.String(startDate.Time.Format(time.RFC3339))
	}

	if totalPrize.Valid {
		tournament.TotalPrize = wrapperspb.String(totalPrize.String)
	}

	if organizer.Valid {
		tournament.Organizer = wrapperspb.String(organizer.String)
	}

	if maxPlayers.Valid {
		tournament.MaxPlayers = wrapperspb.Int32(maxPlayers.Int32)
	}

	if maxPlayers.Valid {
		tournament.MaxPlayers = wrapperspb.Int32(maxPlayers.Int32)
	}

	if maxRankingClass.Valid {
		tournament.MaxRankingClass = wrapperspb.String(maxRankingClass.String)
	}

	if entryFee.Valid {
		tournament.EntryFee = wrapperspb.String(entryFee.String)
	}

	return tournament, nil
}

func (r *TournamentRepository) createTournament(
	ctx context.Context,
	name string,
) (uuid.UUID, error) {

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	query := `INSERT INTO tournaments (name) VALUES ($1) RETURNING id`

	var id uuid.UUID
	err := r.DB.Pool.QueryRow(ctx, query, name).Scan(&id)
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r *TournamentRepository) deleteTournament(
	ctx context.Context,
	id string,
) (string, error) {

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	query := `UPDATE tournaments SET deleted_at = NOW() WHERE id = $1`

	var deletedAt time.Time
	err := r.DB.Pool.QueryRow(ctx, query, id).Scan(&deletedAt)

	if err != nil {
		return "", nil
	}

	return deletedAt.Format(time.RFC3339), nil
}
