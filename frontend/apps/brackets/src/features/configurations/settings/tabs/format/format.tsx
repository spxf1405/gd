import { ConfigProvider, Form } from "antd";
import { useTranslation } from "react-i18next";

import type { Bracket } from "@gd/proto/bracket/v1/bracket_pb";
import { EliminationType } from "@gd/proto/round/v1/round_pb";
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";

import type { TournamentParticipant } from "@gd/proto/participant/v1/participant_pb";
import { COLORS } from "../../consts/color";
import { CreateRoundsButton } from "./create-rounds";
import { RoundCard } from "./round-card";
import type { TournamentRound } from "./types/types";

export function FormatTab() {
  const form = Form.useFormInstance<Tournament>();
  const { t } = useTranslation();

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

  const getTotalRounds = (x: number): number => {
    if (x <= 1) return 0;
    return Math.ceil(Math.log2(x));
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.bronze,
        },
      }}
    >
      <Form.Item
        noStyle
        shouldUpdate={(prev, current) =>
          prev.brackets !== current.brackets ||
          prev.participants !== current.participants
        }
      >
        {() => {
          const brackets =
            (form.getFieldValue("brackets") as Bracket[] | undefined) ?? [];
          const participants =
            (form.getFieldValue("participants") as
              | TournamentParticipant[]
              | undefined) ?? [];

          const winnerRounds = brackets.find(
            (b) => b.side === "winner",
          )?.rounds;
          const expectedRoundsCount = getTotalRounds(participants.length);
          const actualRoundsCount = winnerRounds?.length ?? 0;

          // Hiển thị cảnh báo khi số vòng đấu thực tế khác số vòng tính toán từ số participant
          const isOutSync = expectedRoundsCount !== actualRoundsCount;

          console.log("expectedRoundsCount !== actualRoundsCount", expectedRoundsCount ,actualRoundsCount)

          if (!isOutSync) return null;

          return (
            <div className="mb-4 p-4 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-start justify-between gap-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-lg leading-none mt-0.5">
                  ⚠️
                </span>
                <div className="text-xs text-amber-200/80 leading-relaxed">
                  <p className="font-semibold text-sm text-amber-300 mb-1">
                    Cần đồng bộ lại các vòng đấu (Rounds)!
                  </p>
                  <p>
                    Danh sách người chơi đã được cập nhật. Bạn cần đồng bộ lại
                    cấu hình các vòng đấu theo số lượng người chơi mới để tránh
                    lỗi sơ đồ nhánh đấu.
                  </p>
                </div>
              </div>
              <CreateRoundsButton />
            </div>
          );
        }}
      </Form.Item>

      {/* <div className="flex justify-between mb-4">
        <CreateRoundsButton />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-[13px]">
              {t("settings.format.totalParticipants")}
            </span>
            <span className="text-base font-bold">
              {form.getFieldValue("participants")?.length ?? 0}
            </span>
          </div>
        </div>
      </div> */}

      <div className="overflow-y-auto max-h-[50vh]">
        <Form.Item name="brackets" hidden>
          <input type="hidden" />
        </Form.Item>
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

            console.log("brackets =================================", brackets)

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
              ([name, items]) => {
                const sortItems = items.sort((a) => {
                  return a.side === "winner" ? -1 : 1;
                });
                return {
                  name,
                  eliminationType: items[0]?.eliminationType,
                  items: sortItems,
                };
              },
            );

            console.log("groups", groups);

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
