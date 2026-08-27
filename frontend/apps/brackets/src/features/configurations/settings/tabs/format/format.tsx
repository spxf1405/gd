import { ConfigProvider, Form } from "antd";

import type { Bracket } from "@gd/proto/bracket/v1/bracket_pb";
import { EliminationType } from "@gd/proto/round/v1/round_pb";
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";

import { COLORS } from "../../consts/color";
import { CreateRoundsButton } from "./create-rounds";
import { RoundCard } from "./round-card";
import type { TournamentRound } from "./types/types";

export function FormatTab() {
  const form = Form.useFormInstance<Tournament>();

  const getRoundsFromBrackets = (brackets: Bracket[]): TournamentRound[] => {
    return brackets.flatMap((bracket) =>
      bracket.rounds.map((round) => ({
        ...round,
        side: bracket.side,
      })),
    );
  };

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
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.bronze,
        },
      }}
    >
      <div className="flex justify-between mb-4">
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

            return (
              <CreateRoundsButton
                label={rounds.length ? "Đặt về mặc định" : "Tạo vòng đấu"}
              />
            );
          }}
        </Form.Item>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[13px]">
              Tổng số người tham gia:
            </span>
            <span className="text-base font-bold">{form.getFieldValue("participants")?.length ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[50vh]">
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
                className={`flex flex-col gap-2 transition-opacity duration-200`}
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
    </ConfigProvider>
  );
}
