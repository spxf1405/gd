package player

import (
	"backend/internal/db"
	playerpb "backend/internal/gen/player/v1"
	"backend/internal/repository"
	"context"
	"fmt"

	"google.golang.org/protobuf/types/known/wrapperspb"
)

type PlayerRepository struct {
	*repository.BaseRepository[*playerpb.Player]
}

func NewRepository(db *db.DB) *PlayerRepository {
	if db == nil {
		fmt.Println("Error")
	}
	return &PlayerRepository{repository.NewBaseRepository[*playerpb.Player](db)}
}

func (r *PlayerRepository) getPlayers(ctx context.Context) ([]*playerpb.Player, error) {
	query := `SELECT id, name, pid, phone, created_at FROM ctt_player;`

	if r.DB == nil || r.DB.Pool == nil {
		panic("DB pool is nil")
	}

	rows, err := r.DB.Pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var players []*playerpb.Player

	for rows.Next() {
		var (
			id                          int64
			name, pid, phone, createdAt string
		)

		err := rows.Scan(&id, &name, &pid, &phone, &createdAt)
		if err != nil {
			fmt.Println("error", err)
			return nil, err
		}

		player := &playerpb.Player{
			Id:       wrapperspb.Int64(id),
			Name:     wrapperspb.String(name),
			Pid:      wrapperspb.String(pid),
			Phone:    wrapperspb.String(phone),
			CreateAt: wrapperspb.String(createdAt),
		}

		players = append(players, player)
	}

	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return players, nil
}
