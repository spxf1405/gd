import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Edge, Node } from "@xyflow/react";
import { getPlayersInfo } from "@/features/flow/helper/player";
import { createWbFlow as createWBFlow } from "@/features/flow/helper/winner";
import { createLBFlow } from "@/features/flow/helper/loser";

export type WinnerBracketInfo = {
  players: string[];
  playersForCreateMatch: string[];
  playerCount: number;
  totalBracketSlots: number;
  totalRounds: number;
  flow?: {
    nodes: Node[];
    edges: Edge[];
  };
};

type TourInfo = {
  players: string[];
  playerCount: number;
  currentRound: string;
  switchToSingleEliminationRound: string;
  centerX: number;
  brackets: {
    winner: WinnerBracketInfo;
    loser: {
      totalRounds: number;
      flow?: {
        nodes: Node[];
        edges: Edge[];
      };
    };
  };
};

type TourState = {
  tourInfo: TourInfo;
  initTourInfo: (players: string[]) => void;
  updateCurrentRound: (round: string) => void;
  reset: () => void;
};

const initTourInfoState: Omit<
  TourState,
  "updateCurrentRound" | "initTourInfo" | "reset"
> = {
  tourInfo: {
    players: [],
    playerCount: 0,
    currentRound: "",
    switchToSingleEliminationRound: "Last 16",
    centerX: 0,
    brackets: {
      winner: {
        players: [],
        playersForCreateMatch: [],
        playerCount: 0,
        totalBracketSlots: 0,
        totalRounds: 0,
        flow: {
          nodes: [],
          edges: [],
        },
      },
      loser: { totalRounds: 0 },
    },
  },
};

export const useMatchesStore = create<TourState>()(
  immer((set) => ({
    ...initTourInfoState,

    initTourInfo: (rawPlayers: string[]) =>
      set((state) => {
        const bracketInfo = getPlayersInfo(rawPlayers);

        const {
          players,
          playerCount,
          wbPlayers,
          wbPlayersForCreateMatch,
          wbPlayerCount,
          wbTotalBracketSlots,
          wbTotalRounds,
          lbTotalRounds,
        } = bracketInfo;

        const {
          nodes: wbNodes,
          edges: wbEdges,
          centerX,
        } = createWBFlow({
          players: wbPlayers,
          playersForCreateMatch: wbPlayersForCreateMatch,
          playerCount: wbPlayerCount,
          totalBracketSlots: wbTotalBracketSlots,
          totalRounds: wbTotalRounds,
        });

        const { nodes: lbNodes, edges: lbEdges } = createLBFlow({
          wbPlayers,
          wbTotalBracketSlots,
          lbTotalRounds,
        });

        state.tourInfo.players = players;
        state.tourInfo.playerCount = playerCount;
        state.tourInfo.centerX = centerX;
        state.tourInfo.brackets = {
          winner: {
            players: wbPlayers,
            playersForCreateMatch: wbPlayersForCreateMatch,
            playerCount: wbPlayerCount,
            totalBracketSlots: wbTotalBracketSlots,
            totalRounds: wbTotalRounds,
            flow: {
              nodes: wbNodes,
              edges: wbEdges,
            },
          },
          loser: {
            totalRounds: lbTotalRounds,
            flow: {
              nodes: lbNodes,
              edges: lbEdges,
            },
          },
        };
      }),
    updateCurrentRound: (round: string) => {
      set((state) => {
        state.tourInfo.currentRound = round;
      });
    },
    reset: () =>
      set((state) => {
        state.tourInfo = initTourInfoState.tourInfo;
      }),
  })),
);
