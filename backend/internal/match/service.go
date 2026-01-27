package match

import (
	matchpb "backend/internal/gen/match/v1"
	"context"
	"fmt"
)

type MatchService struct {
	repo *MatchRepository
}

func NewMatchService(repo *MatchRepository) *MatchService {
	return &MatchService{repo: repo}
}

func (service *MatchService) GenerateMatches(ctx context.Context, tournamentID int32, players []string) ([]*matchpb.Match, error) {
	if len(players) == 0 {
		return nil, fmt.Errorf("players list needed")
	}
	for _, v := range players {
		fmt.Println(v)
	}
	matches, err := service.repo.GenerateMatches(ctx, tournamentID, players)
	if err != nil {
		return nil, fmt.Errorf("can't generate matches")
	}
	return matches, nil
}
