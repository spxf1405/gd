package tournament

import (
	"backend/internal/app"
	"backend/internal/bracket"
	"backend/internal/gen/tournament/v1/tournamentpbconnect"
	"backend/internal/match"
	"backend/internal/participant"
	"backend/internal/round"

	"github.com/go-chi/chi/v5"
)

func Mount(r chi.Router, infra *app.Infra) {
	repo := NewRepository(infra.DB)

	deps := ServiceDeps{
		BracketService:     bracket.NewService(bracket.NewRepository(infra.DB)),
		RoundService:       round.NewService(round.NewRepository(infra.DB)),
		MatchService:       match.NewService(match.NewRepository(infra.DB)),
		ParticipantService: participant.NewService(participant.NewRepository(infra.DB)),
	}

	assembleSvc := &AssembleService{
		bracketSvc:     deps.BracketService,
		roundSvc:       deps.RoundService,
		matchSvc:       deps.MatchService,
		participantSvc: deps.ParticipantService,
	}

	service := NewService(repo, assembleSvc)

	handler := NewHandler(service, infra.Validator)

	path, h := tournamentpbconnect.NewTournamentServiceHandler(handler)
	r.Mount(path, h)
}
