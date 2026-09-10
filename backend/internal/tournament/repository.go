package tournament

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"backend/internal/db"
	roundpb "backend/internal/gen/round/v1"
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/logger"
	"backend/internal/repository"

	sq "github.com/Masterminds/squirrel"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
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
		From("gd_tournaments t").
		LeftJoin("gd_registrations r ON r.tournament_id = t.id").
		LeftJoin("gd_players p ON p.id = r.player_id").
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
		logger.Error("Error:", zap.Any("Err", err))
		return nil, err
	}

	rows, err := r.DB.Pool.Query(ctx, query, args...)

	if err != nil {
		logger.Error("Error:", zap.Any("Err", err))
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
			&t.Participants,
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
	query := `
		SELECT
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
			t.gender,
			t.deleted_at,
			COALESCE(
				json_agg(
					json_build_object(
						'id', player.id,
						'name', player.name
					) 
				) FILTER (WHERE player.id IS NOT NULL),
				'[]'::json
			) AS participants 
		FROM gd_tournaments t
		LEFT JOIN gd_participants participant ON participant.tournament_id = t.id
		LEFT JOIN gd_players player ON player.id = participant.player_id
		WHERE t.id = $1
		GROUP BY t.id
	`

	row := r.DB.Pool.QueryRow(ctx, query, id)

	tournament := &tournamentpb.Tournament{}

	var location, totalPrize, organizer, formatDescription, description, entryFee, maxRankingClass sql.NullString
	var createdAt, updatedAt time.Time
	var startDate, deletedAt sql.NullTime
	var maxPlayers sql.NullInt32

	type participantJSON struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}

	var rawParticipants []participantJSON

	err := row.Scan(
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
		&deletedAt,
		&rawParticipants,
	)

	if err != nil {
		log.Println("err", err)
		return nil, err
	}

	participants := make([]*tournamentpb.Participant, 0, len(rawParticipants))

	for _, p := range rawParticipants {
		participants = append(participants, &tournamentpb.Participant{
			Id:   p.ID,
			Name: p.Name,
		})
	}

	tournament.Participants = participants

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

	// logger.Dump(tournament)

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
	tx, err := r.DB.Pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	query := `
    UPDATE gd_tournaments
    SET
        name               = $1,
        type               = $2,
        format             = $3,
        format_description = $4,
        location           = $5,
        total_prize        = $6,
        entry_fee          = $7,
        organizer          = $8,
        updated_at         = NOW(),
        description        = $9,
        max_age            = $10,
        has_ranking        = $11,
        max_ranking_class  = $12,
        gender             = $13
    WHERE id = $14
`

	logger.Dump(tournament)

	tag, err := tx.Exec(ctx, query,
		tournament.Name,
		tournament.Type,
		tournament.Format,
		tournament.FormatDescription.Value,
		tournament.Location.Value,
		tournament.TotalPrize.Value,
		tournament.EntryFee.Value,
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

	_, err = tx.Exec(ctx,
		`DELETE FROM gd_prize_distributions WHERE tournament_id = $1`,
		tournament.Id,
	)
	if err != nil {
		return fmt.Errorf("delete prize distributions: %w", err)
	}

	batch := &pgx.Batch{}

	const insertPrizeQuery = `
        INSERT INTO gd_prize_distributions(
            id,
            tournament_id,
            name,
            amount,
            display_order
        )
        VALUES ($1, $2, $3, $4, $5)
    `

	for index, prize := range tournament.PrizeDistributions {
		batch.Queue(
			insertPrizeQuery,
			prize.Id,
			tournament.Id,
			prize.Name,
			prize.Amount,
			index,
		)
	}

	if len(tournament.PrizeDistributions) > 0 {
		br := tx.SendBatch(ctx, batch)
		defer br.Close()

		for index := range tournament.PrizeDistributions {
			if _, err := br.Exec(); err != nil {
				return fmt.Errorf(
					"insert prize distribution at index %d: %w",
					index,
					err,
				)
			}
		}
	}

	bracketIDs := make([]string, 0, len(tournament.Brackets))

	for _, bracket := range tournament.Brackets {
		bracketIDs = append(bracketIDs, bracket.Id)
	}

	_, err = tx.Exec(ctx,
		`DELETE FROM gd_rounds WHERE bracket_id = ANY($1)`,
		bracketIDs,
	)
	if err != nil {
		return fmt.Errorf("delete rounds: %w", err)
	}

	var rounds []*roundpb.Round

	for _, bracket := range tournament.Brackets {
		rounds = append(rounds, bracket.Rounds...)
	}

	if len(rounds) > 0 {
		const columnCount = 5

		query := `
            INSERT INTO gd_rounds (
                bracket_id,
                name,
                race_to,
                elimination_type,
                order_index
            ) VALUES
        `

		placeholders := make([]string, 0, len(rounds))
		params := make([]any, 0, len(rounds)*columnCount)

		for i, round := range rounds {
			index := i * columnCount

			placeholders = append(placeholders,
				fmt.Sprintf(
					"($%d,$%d,$%d,$%d,$%d)",
					index+1,
					index+2,
					index+3,
					index+4,
					index+5,
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

		query += strings.Join(placeholders, ",")

		if _, err := tx.Exec(ctx, query, params...); err != nil {
			return fmt.Errorf("insert rounds: %w", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit transaction: %w", err)
	}

	return nil
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
