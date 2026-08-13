package participant

import (
	"backend/internal/db"
	participantpb "backend/internal/gen/participant/v1"
	"backend/internal/logger"
	"backend/internal/repository"
	"context"
	"log"

	"go.uber.org/zap"
)

type ParticipantRepository struct {
	*repository.BaseRepository[*participantpb.Participant]
}

func NewRepository(db *db.DB) *ParticipantRepository {
	return &ParticipantRepository{
		BaseRepository: repository.NewBaseRepository[*participantpb.Participant](db),
	}
}

func (r *ParticipantRepository) GetParticipantsByMatchIDs(ctx context.Context, matchIDs []string) ([]*participantpb.Participant, error) {
	logger.Info("List match", zap.Strings("Match Ids:", matchIDs))

	query := `
        SELECT
            participant.id,
            player.name,
            mp.match_id,
            mp.position,
            mp.score
        FROM
            gd_match_participants mp
        JOIN
            gd_participants participant
            ON 
                mp.participant_id = participant.id
        JOIN  
            gd_players player
            ON
                participant.player_id = player.id
        WHERE
            mp.match_id = ANY($1)
        ORDER BY
            mp.position
    `

	rows, err := r.DB.Pool.Query(ctx, query, matchIDs)

	if err != nil {
		log.Println("err", err)
		return nil, err
	}

	defer rows.Close()

	participants := []*participantpb.Participant{}

	for rows.Next() {
		participant := &participantpb.Participant{}

		err := rows.Scan(
			&participant.Id,
			&participant.DisplayName,
			&participant.MatchId,
			&participant.Slot,
			&participant.Score,
		)

		if err != nil {
			return nil, err
		}

		participants = append(participants, participant)
	}

	return participants, nil
}

func (r *ParticipantRepository) GetParticipantsByTournamentID(ctx context.Context, tournamentID string) ([]*participantpb.Participant, error) {
	query := `SELECT
				player.id,
				player.name 
			  FROM gd_players player
			  INNER JOIN gd_participants participant ON participant.player_id = player.id
			  WHERE participant.tournament_id = $1
			  `

	rows, err := r.DB.Pool.Query(ctx, query, tournamentID)

	if err != nil {
		logger.Info("create connection failed")
		return nil, err
	}

	defer rows.Close()

	players := []*participantpb.Participant{}

	for rows.Next() {
		player := &participantpb.Participant{}

		err := rows.Scan(
			player.Id,
			player.DisplayName,
		)

		if err != nil {
			logger.Error("can not get ")
			return nil, err
		}

		players = append(players, player)
	}

	return players, nil
}
