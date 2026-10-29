import type { WinnerParticipantBracketInfo } from "@/store/match";
import { type Edge } from "@xyflow/react";
import {
  FINAL_OF_FINAL_NODE_HEIGHT,
  MATCH_HEIGHT,
  NODE_HEIGHT,
  NODE_VERTICAL_SPACING,
  ROUND_WIDTH,
  Y_REDUCE_FACTOR,
} from "../consts";

import {
  MatchParticipantSchema,
  TournamentParticipantSchema,
  type MatchParticipant,
  type TournamentParticipant,
} from "@gd/proto/participant/v1/participant_pb";
import {
  isTournamentParticipantBye,
  isRealParticipantMatch,
  isMatchParticipantBye,
} from "./player";
import type { Round } from "@gd/proto/round/v1/round_pb";
import { create } from "@bufbuild/protobuf";

export type BracketMatch = {
  id: string;
  roundIndex: number;
  round: Round;
  matchIndex: number;
  side: "left" | "right";
  participants: [MatchParticipant, MatchParticipant];
  winner: MatchParticipant | null;
  isSkipped: boolean;
  isAutoWin: boolean;
  displayOrder: number | null;
  totalRounds: number;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
};

export const getNextMatch = (
  matches: BracketMatch[],
  roundIndex: number,
  matchIndex: number,
) => {
  const next = matches.find(
    (match) =>
      match.roundIndex === roundIndex + 1 &&
      match.matchIndex === Math.floor(matchIndex / 2),
  );

  return next;
};

export const createMatch = (data: {
  roundIndex: number;
  matchIndex: number;
  matchesInRound: number;
  wbTotalRounds: number;
  wbPlayers: TournamentParticipant[];
  round: Round;
}): BracketMatch => {
  const {
    roundIndex,
    matchIndex,
    matchesInRound,
    wbTotalRounds,
    wbPlayers: wbParticipants,
    round,
  } = data;

  const half = matchesInRound / 2;
  //TODO: This will mutate the original, so separate
  const tournamentParticipant1 = wbParticipants.shift();
  const tournamentParticipant2 = wbParticipants.shift();

  const isAutoWin =
    roundIndex === 1 && isTournamentParticipantBye(tournamentParticipant2);

  const matchParticipant1 = create(MatchParticipantSchema, {
    id: tournamentParticipant1?.id,
    nationality: tournamentParticipant1?.nationality,
    displayName: tournamentParticipant1?.displayName,
    playerId: tournamentParticipant1?.playerId,
    slot: 0,
  });

  const matchParticipant2 = create(MatchParticipantSchema, {
    id: tournamentParticipant2?.id,
    nationality: tournamentParticipant2?.nationality,
    displayName: tournamentParticipant2?.displayName,
    playerId: tournamentParticipant2?.playerId,
    slot: 1,
  });

  return {
    id: `WB-R${roundIndex}-M${matchIndex}`,
    roundIndex: roundIndex,
    round: round,
    matchIndex,
    side: matchIndex < half ? "left" : "right",
    participants: [matchParticipant1, matchParticipant2],
    winner: null,
    isSkipped: false,
    isAutoWin,
    displayOrder: null,
    totalRounds: wbTotalRounds,
    position: { x: 0, y: 0 },
    data: {
      label: "",
    },
  };
};

export function createWbFlowParticipant(
  winnerBracketInfo: WinnerParticipantBracketInfo,
) {
  const {
    participantsForCreateMatch,
    participantCount,
    totalBracketSlots,
    roundCount,
    rounds,
  } = winnerBracketInfo;

  const matches: BracketMatch[] = [];
  const edges: Edge[] = [];

  for (let index = 1; index <= rounds.length; index++) {
    const matchesInRound =
      index === 1
        ? participantCount - totalBracketSlots / 2
        : totalBracketSlots / 2 ** index;

    for (let match = 0; match < matchesInRound; match++) {
      matches.push(
        createMatch({
          roundIndex: rounds[index - 1].orderIndex + 1,
          matchIndex: match,
          matchesInRound,
          wbTotalRounds: roundCount,
          wbPlayers: participantsForCreateMatch,
          round: rounds[index - 1],
        }),
      );
    }
  }

  for (let r = 1; r <= roundCount; r++) {
    const roundMatches = matches.filter((n) => n.roundIndex === r);

    for (const matchNode of roundMatches) {
      if (matchNode.participants.length !== 2) continue;

      const [player1, player2] = matchNode.participants;

      // 2 BYE → skip
      // if (isParticipantBye(player1) && isParticipantBye(player2)) {
      //   matchNode.isSkipped = true;
      //   continue;
      // }

      // 1 BYE → auto win
      if (matchNode.isAutoWin) {
        // if (isParticipantBye(player1) || isParticipantBye(player2)) {
        const winner = isMatchParticipantBye(player1) ? player2 : player1;

        matchNode.winner = winner;
        const next = getNextMatch(
          matches,
          matchNode.roundIndex,
          matchNode.matchIndex,
        );

        if (next) {
          const slot = matchNode.matchIndex % 2;

          winner.slot = slot;
          next.participants[slot] = winner;


          edges.push({
            id: `${matchNode.id}->${next.id}`,
            source: `${matchNode.id}-1`,
            target: `${next.id}-${slot + 1}`,
            type: "bracket",
          });
          edges.push({
            id: `${matchNode.id}->${next.id}2`,
            source: `${matchNode.id}-2`,
            target: `${next.id}-${slot + 1}`,
            type: "bracket",
          });
        }
        continue;
      }

      const next = getNextMatch(
        matches,
        matchNode.roundIndex,
        matchNode.matchIndex,
      );
      const slot = matchNode.matchIndex % 2;

      if (!next?.id) {
        continue;
      }

      if (next.roundIndex === roundCount) {
        edges.push({
          id: `${matchNode.id}->${next.id}1`,
          source: `${matchNode.id}-1`,
          target: `${next.id}-${slot + 1}`,
          type: "final",
          data: {
            fromLeft: matchNode.side === "left",
          },
        });
        continue;
      }

      edges.push({
        id: `${matchNode.id}->${next.id}1`,
        source: `${matchNode.id}-1`,
        target: `${next.id}-${slot + 1}`,
        type: "bracket",
      });
      edges.push({
        id: `${matchNode.id}->${next.id}2`,
        source: `${matchNode.id}-2`,
        target: `${next.id}-${slot + 1}`,
        type: "bracket",
      });
    }
  }

  let realMatchCounter = 1;
  // ---------- compute displayOrder ----------

  const sortedMatches = [...matches].sort((a, b) => {
    if (a.roundIndex !== b.roundIndex) return a.roundIndex - b.roundIndex;
    return a.matchIndex - b.matchIndex;
  });

  for (const node of sortedMatches) {
    if (node.isSkipped) continue;
    if (node.isAutoWin) continue;

    if (node.roundIndex === 1) {
      if (isRealParticipantMatch(node.participants)) {
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
  const CENTER_X = (roundCount - 1) * ROUND_WIDTH;

  // ---------- Round 1: Y từ trên xuống ----------
  const round1Matches = matches.filter((n) => n.roundIndex === 1);

  round1Matches.forEach((node, index) => {
    node.position.y =
      index < round1Matches.length / 2
        ? index * MATCH_HEIGHT
        : (index - round1Matches.length / 2) * MATCH_HEIGHT;
  });

  // ---------- Round 2+: Y = trung điểm, có GOM ----------
  for (let round = 2; round <= roundCount; round++) {
    const currentRoundMatches = matches.filter(
      (match) => match.roundIndex === round,
    );
    const scale = Y_REDUCE_FACTOR ** (round - 1);

    currentRoundMatches.forEach((node) => {
      const prevRound = round - 1;
      const match1 = node.matchIndex * 2;
      const match2 = node.matchIndex * 2 + 1;

      const prevMatch1 = matches.find(
        (n) => n.roundIndex === prevRound && n.matchIndex === match1,
      );
      const prevMatch2 = matches.find(
        (n) => n.roundIndex === prevRound && n.matchIndex === match2,
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
    const depthFromFinal = roundCount - node.roundIndex;

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
          label: match.participants[0],
        },
        id: `${match.id}-1`,
        type: match.roundIndex === roundCount ? "final" : "custom",
        position: {
          x: match.position.x,
          y: match.position.y + FINAL_OF_FINAL_NODE_HEIGHT,
        },
      },
      {
        data: {
          match,
          label: match.participants[1],
        },
        id: `${match.id}-2`,
        type: match.roundIndex === roundCount ? "final" : "custom",
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

  return { matches, nodes: nodes.flat(), edges, centerX: CENTER_X };
}
