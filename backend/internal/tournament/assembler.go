package tournament

import (
	"backend/internal/bracket"
	bracketpb "backend/internal/gen/bracket/v1"
	matchpb "backend/internal/gen/match/v1"
	participantpb "backend/internal/gen/participant/v1"
	roundpb "backend/internal/gen/round/v1"
	logger "backend/internal/logger"
	"backend/internal/match"
	"backend/internal/participant"
	"backend/internal/round"
	"context"

	"go.uber.org/zap"
)

type ServiceDeps struct {
	BracketService     *bracket.Service
	RoundService       *round.Service
	MatchService       *match.Service
	ParticipantService *participant.Service
}

type AssembleService struct {
	bracketSvc     *bracket.Service
	roundSvc       *round.Service
	matchSvc       *match.Service
	participantSvc *participant.Service
}

func NewAssembleService(deps ServiceDeps) *AssembleService {
	return &AssembleService{
		bracketSvc:     deps.BracketService,
		roundSvc:       deps.RoundService,
		matchSvc:       deps.MatchService,
		participantSvc: deps.ParticipantService,
	}
}

func (s *AssembleService) AssembleTournament(ctx context.Context, tournamentID string) ([]*bracketpb.Bracket, error) {
	brackets, err := s.bracketSvc.GetBracketsByTournamentID(ctx, tournamentID)
	if err != nil {
		logger.Error("Failed to get brackets",
			zap.Error(err),
			zap.String("tournament_id", tournamentID),
		)
		return nil, err
	}

	bracketIDs := extractIDs(brackets)

	rounds, err := s.roundSvc.GetRoundsByBracketIDs(ctx, bracketIDs)
	if err != nil {
		logger.Error("Failed to get rounds",
			zap.Error(err),
			zap.Any("bracket_ids", bracketIDs),
		)
		return nil, err
	}

	roundIDs := extractIDs(rounds)

	matches, err := s.matchSvc.GetMatchesByRoundIDs(ctx, roundIDs)
	if err != nil {
		logger.Error("Failed to get matches",
			zap.Error(err),
			zap.Any("round_ids", roundIDs),
		)
		return nil, err
	}

	matchIDs := extractIDs(matches)

	participants, err := s.participantSvc.GetParticipantsByMatchIDs(ctx, matchIDs)
	if err != nil {
		logger.Error("Failed to get participants",
			zap.Error(err),
			zap.Any("match_ids", matchIDs),
		)
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

	return brackets, nil
}

func extractBracketIDs(brackets []*bracketpb.Bracket) []string {
	ids := make([]string, 0, len(brackets))
	for _, b := range brackets {
		ids = append(ids, b.Id)
	}
	return ids
}

func extractRoundIDs(rounds []*roundpb.Round) []string {
	ids := make([]string, 0, len(rounds))
	for _, r := range rounds {
		ids = append(ids, r.Id)
	}
	return ids
}
