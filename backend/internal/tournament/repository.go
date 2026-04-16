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

func (r *TournamentRepository) getTournamentByID1(ctx context.Context, id string) (*tournamentpb.Tournament, error) {
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
			"t.deleted_at",
		).
		From("gd_tournaments tournament").
		Where(sq.Eq{"tournament": id})

	query, args, err := qb.ToSql()

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	row := r.DB.Pool.QueryRow(ctx, query, args...)

	tournament := &tournamentpb.Tournament{}

	var location, totalPrize, organizer, formatDescription, description, entryFee, maxRankingClass sql.NullString
	var createdAt, updatedAt time.Time
	var startDate, deletedAt sql.NullTime
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
		&deletedAt,
		&tournament.PrizeDistributions,
		&tournament.Brackets,
	)

	return tournament, nil
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
		`COALESCE (
			(
				SELECT (
					json_agg(
						json_build_object(
							'id', p.id,
							'name', p.name
						)
					)
				)
				FROM gd_registrations as r
				JOIN gd_players as p ON p.id = r.player_id
				WHERE r.tournament_id = t.id
			),
			'[]'::json
		) AS registered_players`,
		"t.deleted_at",
		`COALESCE (
			(
				SELECT json_agg(
					json_build_object(
						'id', pd.id,
						'tournament_id', pd.tournament_id,
						'name', pd.name,
						'amount', pd.amount,
						'display_order', pd.display_order
					) ORDER BY pd.display_order ASC
				)
				FROM gd_prize_distributions as pd
				WHERE pd.tournament_id = t.id
			),
			'[]'::json
		) AS prize_distributions`,
		`COALESCE (
			(
				SELECT json_agg(
					json_build_object(
						'id', bracket.id,
						'name', bracket.name,
						'rounds', (
							SELECT json_agg(
								json_build_object(
									'id', round.id,
									'name', round.name,
									'match', (
										SELECT json_agg(
											json_build_object(
												'id', match.id,
												'name', match.name,
												'participants', (
													SELECT json_agg(
														json_build_object(
															'id', paritcipant.id,
															'users', (
																SELECT json_agg(
																	json_build_object(
																		'id', user.id,
																		'display_name', user.display_name
																	)
																)
																FROM gd_users as user
																WHERE paritcipant.user_id = user.id
															)
														)
													)
													FROM gd_participants as paritcipant
													WHERE paritcipant.match_id = match.id
												) 
											)
										)
										FROM gd_matches as match
										WHERE match.round_id = round.id
									)
								)
							)
							FROM gd_rounds as round
							WHERE bracket_id = bracket.id
						) 
					)
				)
				FROM gd_brackets as bracket
				WHERE bracket.tournament_id = t.id
			),
			'[]'::json
		) AS brackets`,
	).
		From("gd_tournaments t").
		Where(sq.Eq{"deleted_at": nil}).
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
	var startDate, deletedAt sql.NullTime
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
		&deletedAt,
		&tournament.PrizeDistributions,
		&tournament.Brackets,
	)

	fmt.Println('1', tournament.Brackets)

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

	if maxRankingClass.Valid {
		tournament.MaxRankingClass = wrapperspb.String(maxRankingClass.String)
	}

	if entryFee.Valid {
		tournament.EntryFee = wrapperspb.String(entryFee.String)
	}

	if deletedAt.Valid {
		tournament.DeletedAt = wrapperspb.String(deletedAt.Time.Format(time.RFC3339))
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

	query := `INSERT INTO gd_tournaments (name) VALUES ($1) RETURNING id`

	var id uuid.UUID
	err := r.DB.Pool.QueryRow(ctx, query, name).Scan(&id)
	if err != nil {
		return uuid.Nil, err
	}

	return id, nil
}

func (r *TournamentRepository) UpdateTournament(
	ctx context.Context,
	tournament *tournamentpb.Tournament,
) error {
	if r.DB == nil || r.DB.Pool == nil {
		return errors.New("DB pool is nil")
	}

	sd, err := time.Parse(time.RFC3339, tournament.StartDate.Value)
	if err != nil {
		return fmt.Errorf("invalid start_date: %w", err)
	}

	tx, err := r.DB.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx)

	const query = `
		UPDATE gd_tournaments
		SET
			name               = $1,
			type               = $2,
			format             = $3,
			format_description = $4,
			start_date         = $5,
			location           = $6,
			total_prize        = $7,
			entry_fee          = $8,
			max_players        = $9,
			status             = $10,
			organizer          = $11,
			updated_at         = NOW(),
			description        = $12,
			max_age            = $13,
			has_ranking        = $14,
			max_ranking_class  = $15,
			gender             = $16
		WHERE id = $17
	`

	tag, err := tx.Exec(
		ctx, query,
		tournament.Name,
		tournament.Type,
		tournament.Format,
		tournament.FormatDescription.Value,
		sd,
		tournament.Location.Value,
		tournament.TotalPrize.Value,
		tournament.EntryFee.Value,
		tournament.MaxPlayers.Value,
		tournament.Status,
		tournament.Organizer.Value,
		tournament.Description.Value,
		tournament.MaxAge,
		tournament.HasRanking,
		tournament.MaxRankingClass.Value,
		tournament.Gender,
		tournament.Id,
	)
	if err != nil {
		return fmt.Errorf("update tournament: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return errors.New("tournament not found")
	}

	// Prize Distribution
	batch := &pgx.Batch{}

	for index, prize := range tournament.PrizeDistributions {
		batch.Queue(`
			INSERT INTO gd_prize_distributions(id, tournament_id, name, amount, display_order)
			VALUES ($1, $2, $3, $4, $5)
			ON CONFLICT (id)
			DO UPDATE SET
				id            = EXCLUDED.id,
				name		  = EXCLUDED.name,
				amount        = EXCLUDED.amount,
				display_order = EXCLUDED.display_order
		`, prize.Id, tournament.Id, prize.Name, prize.Amount, index)
	}

	prizeIds := make([]string, len(tournament.PrizeDistributions))
	for i, prize := range tournament.PrizeDistributions {
		prizeIds[i] = prize.Id
	}

	batch.Queue(
		`DELETE FROM gd_prize_distributions WHERE tournament_id = $1 AND id NOT IN (SELECT UNNEST($2::uuid[]))`,
		tournament.Id, prizeIds,
	)

	br := tx.SendBatch(ctx, batch)

	for index, prize := range tournament.PrizeDistributions {
		tag, err := br.Exec()
		if err != nil {
			br.Close()
			return fmt.Errorf("prize upsert failed at index %d (id=%s, name=%s, amount=%v): %w",
				index, prize.Id, prize.Name, prize.Amount, err)
		}
		fmt.Printf("[DEBUG] prize upsert index=%d id=%s rows_affected=%d\n",
			index, prize.Id, tag.RowsAffected())
	}

	deleteTag, err := br.Exec()
	if err != nil {
		br.Close()
		return fmt.Errorf("prize delete failed (tournament_id=%s, keeping_ids=%v): %w",
			tournament.Id, prizeIds, err)
	}
	fmt.Printf("[DEBUG] prize delete tournament_id=%s rows_affected=%d\n",
		tournament.Id, deleteTag.RowsAffected())

	if err := br.Close(); err != nil {
		return fmt.Errorf("batch close: %w", err)
	}

	return tx.Commit(ctx)
}

func (r *TournamentRepository) deleteTournament(
	ctx context.Context,
	id string,
) (string, error) {

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	query := `UPDATE gd_tournaments SET deleted_at = NOW() WHERE id = $1`

	var deletedAt time.Time
	err := r.DB.Pool.QueryRow(ctx, query, id).Scan(&deletedAt)

	if err != nil {
		return "", nil
	}

	return deletedAt.Format(time.RFC3339), nil
}
