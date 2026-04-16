package tournament

import (
	"backend/internal/bracket"
	matchpb "backend/internal/gen/match/v1"
	participantpb "backend/internal/gen/participant/v1"
	roundpb "backend/internal/gen/round/v1"
	tournamentpb "backend/internal/gen/tournament/v1"
	"backend/internal/match"
	"backend/internal/participant"
	"backend/internal/round"
	"context"

	"github.com/google/uuid"
)

type Service struct {
	repo               *TournamentRepository
	bracketService     *bracket.Service
	roundService       *round.Service
	matchService       *match.Service
	participantService *participant.Service
}

func NewService(repo *TournamentRepository, bracketService *bracket.Service, roundService *round.Service, matchService *match.Service, participantService *participant.Service) *Service {
	return &Service{
		repo:               repo,
		bracketService:     bracketService,
		roundService:       roundService,
		matchService:       matchService,
		participantService: participantService,
	}
}

func (s *Service) getTournaments(ctx context.Context, params *tournamentpb.GetTournamentsRequestWrapper_Query) ([]*tournamentpb.Tournament, error) {
	tournaments, err := s.repo.getTournaments(ctx, params)
	if err != nil {
		return nil, err
	}
	return tournaments, nil
}

func (s *Service) getTournamentByID(ctx context.Context, id string) (*tournamentpb.Tournament, error) {
	tournament, err := s.repo.getTournamentByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return tournament, nil
}

func (s *Service) UpdateTournament(ctx context.Context, tournament *tournamentpb.Tournament) error {
	err := s.repo.UpdateTournament(ctx, tournament)
	if err != nil {
		return err
	}
	return nil
}

func (s *Service) createTournament(ctx context.Context, name string) (uuid.UUID, error) {
	id, err := s.repo.createTournament(ctx, name)
	if err != nil {
		return uuid.Nil, err
	}
	return id, nil
}

func (s *Service) deleteTournament(ctx context.Context, name string) (string, error) {
	deletedAt, err := s.repo.deleteTournament(ctx, name)
	if err != nil {
		return "", err
	}
	return deletedAt, nil
}

func toUUIDs(ids []string) ([]uuid.UUID, error) {
	uuids := []uuid.UUID{}
	for _, id := range ids {
		u, err := uuid.Parse(id)
		if err != nil {
			return nil, err
		}
		uuids = append(uuids, u)
	}
	return uuids, nil
}

func extractIDs[T interface{ GetId() string }](items []T) []string {
	ids := make([]string, len(items))
	for i, item := range items {
		ids[i] = item.GetId()
	}
	return ids
}

func (s *Service) getTournamentByID1(ctx context.Context, id string) (*tournamentpb.Tournament, error) {
	tournament, err := s.repo.getTournamentByID1(ctx, id)
	if err != nil {
		return nil, err
	}

	brackets, err := s.bracketService.GetBracketsByTournamentID(ctx, tournament.GetId())
	if err != nil {
		return nil, err
	}

	bracketIDs := extractIDs(brackets)

	rounds, err := s.roundService.GetRoundsByBracketIDs(ctx, bracketIDs)
	if err != nil {
		return nil, err
	}

	roundIDs := extractIDs(rounds)

	matches, err := s.matchService.GetMatchesByRoundIDs(ctx, roundIDs)
	if err != nil {
		return nil, err
	}

	matchIDs := extractIDs(matches)

	participants, err := s.participantService.GetParticipantsByMatchIDs(ctx, matchIDs)
	if err != nil {
		return nil, err
	}

	participantPerMatchID := make(map[string][]*participantpb.Participant, len(matchIDs))
	for _, p := range participants {
		participantPerMatchID[p.MatchId] = append(participantPerMatchID[p.MatchId], p)
	}

	matchesPerRoundID := make(map[string][]*matchpb.Match, len(roundIDs))
	for _, m := range matches {
		m.Participants = participantPerMatchID[m.Id]
		matchesPerRoundID[m.RoundId] = append(matchesPerRoundID[m.RoundId], m)
	}

	roundsPerBracketID := make(map[string][]*roundpb.Round, len(bracketIDs))
	for _, r := range rounds {
		r.Matches = matchesPerRoundID[r.Id]
		roundsPerBracketID[r.BracketId] = append(roundsPerBracketID[r.BracketId], r)
	}

	for _, b := range brackets {
		b.Rounds = roundsPerBracketID[b.Id]
	}

	tournament.Brackets = brackets

	return tournament, nil
}
