package participant

import (
	"backend/internal/db"
	participantpb "backend/internal/gen/participant/v1"
	"backend/internal/logger"
	"backend/internal/repository"
	"context"
	"errors"
	"fmt"
	"log"

	"github.com/google/uuid"

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

func (r *ParticipantRepository) GetParticipantsByTournamentID(ctx context.Context, tournamentID string) ([]*participantpb.TournamentParticipant, error) {
	query := `SELECT
				player.id,
				player.name,
				player.nationality,
				player.ranking
			  FROM gd_players player
			  INNER JOIN gd_participants participant ON participant.player_id = player.id
			  WHERE participant.tournament_id = $1
			  `

	rows, err := r.DB.Pool.Query(ctx, query, tournamentID)
	if err != nil {
		logger.Error("failed to query participants", zap.Error(err), zap.String("tournament_id", tournamentID))
		return nil, err
	}
	defer rows.Close()

	participants := []*participantpb.TournamentParticipant{}

	for rows.Next() {
		var playerUUID uuid.UUID
		var displayName, nationality, ranking string

		if err := rows.Scan(&playerUUID, &displayName, &nationality, &ranking); err != nil {
			logger.Error("fail1", zap.Error(err), zap.String("tournament_id", tournamentID))
			return nil, err
		}

		if ranking == "UNRANKED" {
			fmt.Println("============1", displayName)
		}

		participants = append(participants, &participantpb.TournamentParticipant{
			Id:          playerUUID.String(),
			DisplayName: displayName,
			Nationality: nationality,
			Ranking:     ranking,
		})
	}

	if err := rows.Err(); err != nil {
		logger.Error("fail2", zap.Error(err), zap.String("tournament_id", tournamentID))
		return nil, err
	}

	return participants, nil
}

func (r *ParticipantRepository) DeleteTournamentParticipantByID(ctx context.Context, participantID string) error {
	query := `DELETE FROM gd_participants WHERE player_id = $1`

	cmdTag, err := r.DB.Pool.Exec(ctx, query, participantID)
	if err != nil {
		logger.Error("failed to delete participant", zap.String("participant_id", participantID), zap.Error(err))
		return err
	}

	if cmdTag.RowsAffected() == 0 {
		logger.Warn("participant not found", zap.String("participant_id", participantID))
		return errors.New("participant not found")
	}

	return nil
}
