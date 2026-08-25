import { useParticipantsByTournamentID } from "@/features/configurations/players/hooks";
import { useTournament } from "@/hook/tournament";
import { Form, Input } from "antd";
import { Trophy } from "lucide-react";

import type { Bracket } from "@gd/proto/bracket/v1/bracket_pb";
import { EliminationType } from "@gd/proto/round/v1/round_pb";
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";

import { CreateRoundsButton } from "./create-rounds";
import { RoundCard } from "./round-card";
import type { TournamentRound } from "./types/types";
import { useTournamentStore } from "@/store/match";

export function FormatTab() {
  const form = Form.useFormInstance<Tournament>();

  const { tournament } = useTournamentStore();

  const { data: participants } = useParticipantsByTournamentID({
    tournamentId: tournament?.id,
  });

  const { isLoading } = useTournament(tournament?.id) ?? {};

  /**
   * Get all rounds from all brackets and attach the bracket side.
   *
   * Form structure:
   *
   * brackets[]
   *   └── rounds[]
   *
   * UI structure:
   *
   * roundsStore[]
   *   └── side
   */
  const getRoundsFromBrackets = (brackets: Bracket[]): TournamentRound[] => {
    return brackets.flatMap((bracket) =>
      bracket.rounds.map((round) => ({
        ...round,
        side: bracket.side,
      })),
    );
  };

  /**
   * Get unique group names while preserving their current order.
   *
   * Multiple rounds can belong to the same group:
   *
   * winner Round 1
   * loser  Round 1
   *
   * Both belong to group "Round 1".
   */
  const getOrderedGroupNames = (rounds: TournamentRound[]): string[] => {
    const seen = new Set<string>();
    const names: string[] = [];

    for (const round of rounds) {
      if (seen.has(round.name)) {
        continue;
      }

      seen.add(round.name);
      names.push(round.name);
    }

    return names;
  };

  /**
   * Replace a single round inside Form.brackets.
   */
  const updateRound = (updatedRound: TournamentRound) => {
    const brackets =
      (form.getFieldValue("brackets") as Bracket[] | undefined) ?? [];

    const nextBrackets = brackets.map((bracket) => {
      const hasRound = bracket.rounds.some(
        (round) => round.id === updatedRound.id,
      );

      if (!hasRound) {
        return bracket;
      }

      return {
        ...bracket,
        rounds: bracket.rounds.map((round) =>
          round.id === updatedRound.id ? updatedRound : round,
        ),
      };
    });

    form.setFieldValue("brackets", nextBrackets);
  };

  const convertGroupsToSingleElimination = (
    groupName: string,
    rounds: TournamentRound[],
  ): TournamentRound[] => {
    const orderedGroupNames = getOrderedGroupNames(rounds);

    const groupIndex = orderedGroupNames.indexOf(groupName);

    if (groupIndex === -1) {
      return rounds;
    }

    const affectedGroupNames = new Set(orderedGroupNames.slice(groupIndex));

    return rounds
      .filter(
        (round) =>
          !(affectedGroupNames.has(round.name) && round.side === "loser"),
      )
      .map((round) =>
        affectedGroupNames.has(round.name)
          ? {
              ...round,
              eliminationType: EliminationType.SINGLE,
            }
          : round,
      );
  };

  /**
   * Convert a group to DOUBLE elimination.
   *
   * If a loser round already exists, only the elimination type
   * needs to be updated.
   *
   * Otherwise a new loser round is created immediately after
   * the corresponding winner round.
   */
  const convertGroupToDoubleElimination = (
    groupName: string,
    rounds: TournamentRound[],
    loserBracketId: string,
  ): TournamentRound[] => {
    const groupRounds = rounds.filter((round) => round.name === groupName);

    if (groupRounds.length === 0) {
      return rounds;
    }

    const winnerRound =
      groupRounds.find((round) => round.side === "winner") ?? groupRounds[0];

    const nextRounds = rounds.map((round) =>
      round.name === groupName
        ? {
            ...round,
            eliminationType: EliminationType.DOUBLE,
          }
        : round,
    );

    const hasLoserRound = groupRounds.some((round) => round.side === "loser");

    if (hasLoserRound) {
      return nextRounds;
    }

    const loserRound: TournamentRound = {
      id: `${winnerRound.id}-loser`,
      name: groupName,
      eliminationType: EliminationType.DOUBLE,
      side: "loser",
      raceTo: winnerRound.raceTo,
      bracketId: loserBracketId,
    };

    const winnerRoundIndex = nextRounds.findIndex(
      (round) => round.id === winnerRound.id,
    );

    if (winnerRoundIndex === -1) {
      return nextRounds;
    }

    return [
      ...nextRounds.slice(0, winnerRoundIndex + 1),
      loserRound,
      ...nextRounds.slice(winnerRoundIndex + 1),
    ];
  };

  /**
   * Update elimination mode of a round group.
   *
   * This is the main business operation used by RoundCard.
   */
  const updateGroupEliminationMode = (
    groupName: string,
    eliminationType: EliminationType,
    rounds: TournamentRound[],
  ) => {
    const brackets =
      (form.getFieldValue("brackets") as Bracket[] | undefined) ?? [];

    if (brackets.length === 0) {
      return;
    }

    const loserBracket = brackets.find((bracket) => bracket.side === "loser");

    let nextRounds: TournamentRound[];

    if (eliminationType === EliminationType.SINGLE) {
      nextRounds = convertGroupsToSingleElimination(groupName, rounds);
    } else {
      if (!loserBracket) {
        return;
      }

      nextRounds = convertGroupToDoubleElimination(
        groupName,
        rounds,
        loserBracket.id,
      );
    }

    const nextBrackets = brackets.map((bracket) => ({
      ...bracket,
      rounds: nextRounds.filter((round) => round.bracketId === bracket.id),
    }));

    form.setFieldValue("brackets", nextBrackets);
  };

  return (
    <div className="min-w-[640px] overflow-x-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-orange-400" />

          <h2 className="text-sm font-semibold text-zinc-100">Vòng đấu</h2>
        </div>
      </div>

      <div className="flex justify-between">
        <CreateRoundsButton label="Tạo vòng đấu" />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-xs text-zinc-400">
              Tổng số người chơi
            </span>

            <Input
              size="large"
              className="!w-24"
              value={participants?.tournamentParticipants.length ?? 0}
              disabled
            />
          </div>

          <button className="whitespace-nowrap text-xs text-orange-400 transition-colors hover:text-orange-300">
            Xem danh sách người chơi
          </button>
        </div>
      </div>

      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.brackets !== currentValues.brackets
        }
      >
        {() => {
          const brackets =
            (form.getFieldValue("brackets") as Bracket[] | undefined) ?? [];

          const rounds = getRoundsFromBrackets(brackets);

          const groupMap = new Map<string, TournamentRound[]>();

          for (const round of rounds) {
            const group = groupMap.get(round.name);

            if (group) {
              group.push(round);
            } else {
              groupMap.set(round.name, [round]);
            }
          }

          const groups = Array.from(groupMap.entries()).map(
            ([name, items]) => ({
              name,
              eliminationType: items[0]?.eliminationType,
              items,
            }),
          );

          return (
            <div
              className={`flex flex-col gap-2 transition-opacity duration-200 ${
                isLoading ? "pointer-events-none select-none opacity-40" : ""
              }`}
            >
              {groups.map((group, index) => (
                <RoundCard
                  key={group.name}
                  name={group.name}
                  index={index}
                  items={group.items}
                  isDisableDouble={
                    index > 0 &&
                    groups[index - 1]?.eliminationType ===
                      EliminationType.SINGLE
                  }
                  onChangeSide={updateRound}
                  onChangeMode={(groupName, eliminationType) =>
                    updateGroupEliminationMode(
                      groupName,
                      eliminationType,
                      rounds,
                    )
                  }
                />
              ))}
            </div>
          );
        }}
      </Form.Item>
    </div>
  );
}
