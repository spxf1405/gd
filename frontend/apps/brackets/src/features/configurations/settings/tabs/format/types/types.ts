import type { EliminationType } from "@gd/proto/round/v1/round_pb";

export type BracketSide = "winner" | "loser";

export interface TournamentRound {
  id: string;
  name: string;
  eliminationType: EliminationType.SINGLE | EliminationType.DOUBLE;
  side: BracketSide;
  raceTo: number;
  bracketId: string
}
