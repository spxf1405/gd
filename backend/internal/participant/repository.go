package participant

import (
	"backend/internal/db"
	participantpb "backend/internal/gen/participant/v1"
	"backend/internal/repository"
	"context"
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
	query := `
		SELECT
			p.id,
			p.display_name,
			mp.match_id,
			mp.slot,
			mp.score,
		FROM
			gd_match_participants mp
		JOIN
			gd_participants p
			ON
				mp.participant_id = p.id
		WHERE
			mp.match_id = ANY($1)
		ORDER BY
			mp.slot
	`

	rows, err := r.DB.Pool.Query(ctx, query, matchIDs)

	if err != nil {
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
