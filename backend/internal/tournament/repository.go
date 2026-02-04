package tournament

import (
	"backend/internal/db"
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/repository"
	"context"
	"fmt"
	"log"
	"time"

	"github.com/google/uuid"
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

func (r *TournamentRepository) getTournaments(ctx context.Context, params *tournamentpb.GetTournamentsRequestWrapper_Filter) ([]*tournamentpb.Tournament, error) {
	query := fmt.Sprintf(`SELECT * FROM tournament WHERE %s = $1 ORDER BY %s %s`, filterByToColumn(params.Filter.FilterBy), sortByToColumn(params.Filter.SortBy), sortOrderToSQL(params.Filter.SortOrder))
	fmt.Println("query1", query)

	// query := `SELECT * FROM tournament ORDER BY created_at DESC`

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	rows, err := r.DB.Pool.Query(ctx, query, params.Filter.Filter)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var tournaments []*tournamentpb.Tournament

	for rows.Next() {
		var tournament = &tournamentpb.Tournament{}

		var createdAt, updateAt time.Time

		err := rows.Scan(
			&tournament.Id,
			&tournament.Name,
			&tournament.Type,
			&tournament.Format,
			&tournament.StartDate,
			&tournament.EndDate,
			&tournament.Location,
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
