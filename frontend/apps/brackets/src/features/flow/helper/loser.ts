import {
  FINAL_OF_FINAL_NODE_HEIGHT,
  MATCH_HEIGHT,
  NODE_HEIGHT,
  NODE_VERTICAL_SPACING,
  ROUND_WIDTH,
  Y_REDUCE_FACTOR,
} from "../consts";

function calPlayersInLoserRound(players: number, round: number) {
  return players / Math.pow(2, Math.ceil(round / 2));
}

const createMatch = ({
  round,
  matchIndex,
  matchesInRound,
  position,
}: {
  round: number;
  matchIndex: number;
  matchesInRound: number;
  position: any;
}) => {
  const half = matchesInRound / 2;
  const player1 = "";
  const player2 = "";

  const loser = getWBSourceMatches(round, matchIndex);

  return {
    id: `LB-R${round}-M${matchIndex}`,
    round,
    matchIndex,
    side: matchIndex < half ? "left" : "right",
    players: [player1, player2],
    winner: null,
    isSkipped: false,
    isAutoWin: false,
    displayOrder: null,
    position,
    data: {
      previousLoseMatch: "",
      label: round,
    },
  };
};

function getWBSourceMatches(lbRound: number, lbMatchIndex: number) {
  if (lbRound % 2 === 0) {
    return null;
  }

  const wbRound = Math.ceil(lbRound / 2);
  const wbMatchIndex1 = lbMatchIndex * 2;
  const wbMatchIndex2 = lbMatchIndex * 2 + 1;

  return {
    round: wbRound,
    matchIndex1: wbMatchIndex1,
    matchIndex2: wbMatchIndex2,
  };
}

export const createLBFlow = ({
  wbPlayers,
  lbTotalRounds,
  wbTotalBracketSlots,
}: {
  wbPlayers: string[];
  lbTotalRounds: number;
  wbTotalBracketSlots: number;
}) => {
  const matches = [];

  const TO_WB_GAP = (wbTotalBracketSlots / 4) * MATCH_HEIGHT + 100;

  for (let round = 1; round <= lbTotalRounds; round++) {
    const playersInRound = calPlayersInLoserRound(wbPlayers.length, round);

    const matchesInRound = playersInRound / 2;

    for (let match = 0; match < matchesInRound; match++) {
      const position = {
        x: round * ROUND_WIDTH - (ROUND_WIDTH * 2),
        y: (match + 1) * MATCH_HEIGHT,
      };
      if (round === 1 || round === 2) {
        matches.push(
          createMatch({
            round,
            matchIndex: match,
            matchesInRound,
            position,
          })
        );
        continue;
      }
      matches.push(
        createMatch({
          round,
          matchIndex: match,
          matchesInRound,
          position: position ?? { x: 0, y: 0 },
        })
      );
    }
  }

  for (let round = 3; round <= lbTotalRounds; round++) {
    const currentRoundMatches = matches.filter((n) => n.round === round);
    const scale = Y_REDUCE_FACTOR ** (round - 1);

    currentRoundMatches.forEach((match) => {
      const prevRound = round - 2;
      const m1 = match.matchIndex * 2;
      const m2 = match.matchIndex * 2 + 1;

      const prev1 = matches.find(
        (n) => n.round === prevRound && n.matchIndex === m1
      );
      const prev2 = matches.find(
        (n) => n.round === prevRound && n.matchIndex === m2
      );

      let baseY;
      if (prev1 && prev2) {
        baseY = (prev1.position.y + prev2.position.y) / 2;
      } else if (prev1) {
        baseY = prev1.position.y;
      } else if (prev2) {
        baseY = prev2.position.y;
      } else {
        baseY = match.matchIndex * NODE_VERTICAL_SPACING;
      }

      match.position.y = baseY * scale;
    });
  }

  const nodes = matches.map((match) => {
    return [
      {
        data: {
          match,
          label: match.players[0],
        },
        id: `${match.id}-1`,
        type: "custom",
        position: {
          x: match.position.x,
          y: match.position.y + TO_WB_GAP + FINAL_OF_FINAL_NODE_HEIGHT,
        },
      },
      {
        data: {
          match,
          label: match.players[1],
        },
        id: `${match.id}-2`,
        type: "custom",
        position: {
          x: match.position.x,
          y: match.position.y + NODE_HEIGHT + NODE_VERTICAL_SPACING + TO_WB_GAP + FINAL_OF_FINAL_NODE_HEIGHT,
        },
      },
    ];
  });

  return { nodes: nodes.flat(), edges: [] };
};
