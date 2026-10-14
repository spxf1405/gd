import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";

export const useTournamentInfo = ({
  tournament,
}: {
  tournament?: Tournament;
}) => {
  if (!tournament) {
    return {
      matches: [],
      rounds: [],
      brackets: [],
      participants: []
    };
  }

  const { brackets, participants} = tournament;

  const rounds =
    tournament.brackets?.flatMap((bracket) => bracket.rounds ?? []) ?? [];

  const matches =
    rounds?.flatMap((round) => {
      if (!round.matches) return [];

      return round.matches.map((match) => ({
        ...match,
        orderIndex: round.orderIndex,
        roundCount: rounds.length,
      }));
    }) ?? [];

  return { matches, rounds, brackets, participants};
};
