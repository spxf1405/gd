import type { WinnerBracketInfo } from "@/store/match";
import { type Edge } from "@xyflow/react";
import {
  FINAL_OF_FINAL_NODE_HEIGHT,
  MATCH_HEIGHT,
  NODE_HEIGHT,
  NODE_VERTICAL_SPACING,
  ROUND_WIDTH,
  Y_REDUCE_FACTOR,
} from "../consts";
import type { BracketMatch } from "../types";
import { getNextMatch, isBye, isRealMatch } from "./player";

export const createMatch = (data: {
  round: number;
  matchIndex: number;
  matchesInRound: number;
  wbTotalRounds: number;
  wbPlayers: string[];
}): BracketMatch => {
  const { round, matchIndex, matchesInRound, wbTotalRounds, wbPlayers } = data;

  const half = matchesInRound / 2;
  // This will mutate the original, so separate
  const player1 = wbPlayers.shift() ?? "";
  const player2 = wbPlayers.shift() ?? "";

  return {
    id: `WB-R${round}-M${matchIndex}`,
    round,
    matchIndex,
    side: matchIndex < half ? "left" : "right",
    players: [player1, player2],
    winner: null,
    isSkipped: false,
    isAutoWin: false,
    displayOrder: null,
    totalRounds: wbTotalRounds,
    position: { x: 0, y: 0 },
    data: {
      label: "",
    },
  };
};

export function createWbFlow(winnerBracketInfo: WinnerBracketInfo) {
  const { playersForCreateMatch, playerCount, totalBracketSlots, totalRounds } =
    winnerBracketInfo;

  const matches: BracketMatch[] = [];
  const edges: Edge[] = [];

  // ---------- build all matches ----------
  for (let round = 1; round <= totalRounds; round++) {
    const matchesInRound =
      round === 1
        ? playerCount - totalBracketSlots / 2
        : totalBracketSlots / 2 ** round;
    for (let match = 0; match < matchesInRound; match++) {
      matches.push(
        createMatch({
          round,
          matchIndex: match,
          matchesInRound,
          wbTotalRounds: totalRounds,
          wbPlayers: playersForCreateMatch,
        })
      );
    }
  }

  for (let r = 1; r <= totalRounds; r++) {
    const roundMatches = matches.filter((n) => n.round === r);

    for (const node of roundMatches) {
      if (node.players.length !== 2) continue;

      const [player1, player2] = node.players;

      // 2 BYE → skip
      if (isBye(player1) && isBye(player2)) {
        node.isSkipped = true;
        continue;
      }

      // 1 BYE → auto win
      if (isBye(player1) || isBye(player2)) {
        const winner = isBye(player1) ? player2 : player1;
        node.isAutoWin = true;
        node.winner = winner;

        const next = getNextMatch(matches, node.round, node.matchIndex);

        if (next) {
          const slot = node.matchIndex % 2;
          next.players[slot] = winner;

          edges.push({
            id: `${node.id}->${next.id}`,
            source: `${node.id}-1`,
            target: `${next.id}-${slot + 1}`,
            type: "bracket",
          });
          edges.push({
            id: `${node.id}->${next.id}2`,
            source: `${node.id}-2`,
            target: `${next.id}-${slot + 1}`,
            type: "bracket",
          });
        }
        continue;
      }

      const next = getNextMatch(matches, node.round, node.matchIndex);
      const slot = node.matchIndex % 2;

      if (!next?.id) {
        continue;
      }

      if (next.round === totalRounds) {
        edges.push({
          id: `${node.id}->${next.id}1`,
          source: `${node.id}-1`,
          target: `${next.id}-${slot + 1}`,
          type: "final",
          data: {
            fromLeft: node.side === "left",
          },
        });
        continue;
      }

      edges.push({
        id: `${node.id}->${next.id}1`,
        source: `${node.id}-1`,
        target: `${next.id}-${slot + 1}`,
        type: "bracket",
      });
      edges.push({
        id: `${node.id}->${next.id}2`,
        source: `${node.id}-2`,
        target: `${next.id}-${slot + 1}`,
        type: "bracket",
      });
    }
  }

  let realMatchCounter = 1;
  // ---------- compute displayOrder ----------

  const sortedMatches = [...matches].sort((a, b) => {
    if (a.round !== b.round) return a.round - b.round;
    return a.matchIndex - b.matchIndex;
  });

  for (const node of sortedMatches) {
    if (node.isSkipped) continue;
    if (node.isAutoWin) continue;

    if (node.round === 1) {
      if (isRealMatch(node.players)) {
        node.displayOrder = realMatchCounter++;
      }
    } else {
      node.displayOrder = realMatchCounter++;
    }
  }

  // ======================================================
  // ================== POSITION SECTION ==================
  // ======================================================

  // ---------- CENTER AXIS ----------
  const CENTER_X = (totalRounds - 1) * ROUND_WIDTH;

  // ---------- Round 1: Y từ trên xuống ----------
  const round1Matches = matches.filter((n) => n.round === 1);

  round1Matches.forEach((node, index) => {
    node.position.y =
      index < round1Matches.length / 2
        ? index * MATCH_HEIGHT
        : (index - round1Matches.length / 2) * MATCH_HEIGHT;
  });

  // ---------- Round 2+: Y = trung điểm, có GOM ----------
  for (let round = 2; round <= totalRounds; round++) {
    const currentRoundMatches = matches.filter(
      (match) => match.round === round
    );
    const scale = Y_REDUCE_FACTOR ** (round - 1);

    currentRoundMatches.forEach((node) => {
      const prevRound = round - 1;
      const match1 = node.matchIndex * 2;
      const match2 = node.matchIndex * 2 + 1;

      const prevMatch1 = matches.find(
        (n) => n.round === prevRound && n.matchIndex === match1
      );
      const prevMatch2 = matches.find(
        (n) => n.round === prevRound && n.matchIndex === match2
      );

      let baseY;
      if (prevMatch1 && prevMatch2) {
        baseY = (prevMatch1.position.y + prevMatch2.position.y) / 2;
      } else if (prevMatch1) {
        baseY = prevMatch1.position.y;
      } else if (prevMatch2) {
        baseY = prevMatch2.position.y;
      } else {
        baseY = node.matchIndex * MATCH_HEIGHT;
      }

      node.position.y = baseY * scale;
    });
  }

  // ---------- X: đối xứng quanh trục giữa ----------

  matches.forEach((node) => {
    const depthFromFinal = totalRounds - node.round;

    node.position.x =
      node.side === "left"
        ? CENTER_X - (depthFromFinal + 1) * ROUND_WIDTH
        : CENTER_X + (depthFromFinal - 1) * ROUND_WIDTH;
  });

  const nodes = matches.map((match) => {
    return [
      {
        data: {
          match,
          label: match.players[0],
        },
        id: `${match.id}-1`,
        type: match.round === totalRounds ? "final" : "custom",
        position: {
          x: match.position.x,
          y: match.position.y + FINAL_OF_FINAL_NODE_HEIGHT,
        },
      },
      {
        data: {
          match,
          label: match.players[1],
        },
        id: `${match.id}-2`,
        type: match.round === totalRounds ? "final" : "custom",
        position: {
          x: match.position.x,
          y:
            match.position.y +
            NODE_HEIGHT +
            NODE_VERTICAL_SPACING +
            FINAL_OF_FINAL_NODE_HEIGHT,
        },
      },
    ];
  });

  return { nodes: nodes.flat(), edges , centerX: CENTER_X};
}
