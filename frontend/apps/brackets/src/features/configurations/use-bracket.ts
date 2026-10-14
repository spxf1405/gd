import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { useMemo } from "react";
import {
  FINAL_OF_FINAL_NODE_HEIGHT,
  NODE_HEIGHT,
  NODE_VERTICAL_SPACING,
} from "../flow/consts";

export const useFlow = ({ tournament }: { tournament?: Tournament }) => {
  const nodes = useMemo(() => {
    if (!tournament) {
      return [];
    }

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

    console.log("winner1.ts => matches =======", matches);

    if (!matches || matches.length === 0) return [];

    return matches.flatMap((match) => {
      const isFinal = match.round === match.roundCount;

      const nodeType = isFinal ? "final" : "custom";
      const baseX = match.position?.x ?? 0;
      const baseY = match.position?.y ?? 0;

      let slot0, slot1;

      slot0 = match.participants.find((p) => p?.slot === 0);
      slot1 = match.participants.find((p) => p?.slot === 1);

      return [
        {
          id: `${match.id}-1`,
          type: nodeType,
          data: {
            match,
            label: slot0,
          },
          position: {
            x: baseX,
            y: baseY + FINAL_OF_FINAL_NODE_HEIGHT,
          },
        },
        {
          id: `${match.id}-2`,
          type: nodeType,
          data: {
            match,
            label: slot1,
          },
          position: {
            x: baseX,
            y:
              baseY +
              NODE_HEIGHT +
              NODE_VERTICAL_SPACING +
              FINAL_OF_FINAL_NODE_HEIGHT,
          },
        },
      ];
    });
  }, [tournament]);

  console.log("nodes =================", nodes);

  return { nodes };
};
