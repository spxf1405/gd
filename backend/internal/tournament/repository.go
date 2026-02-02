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

func (r *TournamentRepository) getTournaments(ctx context.Context) ([]*tournamentpb.Tournament, error) {
	query := `SELECT * FROM tournament ORDER BY created_at DESC`

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	rows, err := r.DB.Pool.Query(ctx, query)
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
	fmt.Println("tournaments1", tournaments)
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
