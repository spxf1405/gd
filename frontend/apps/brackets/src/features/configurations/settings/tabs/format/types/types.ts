import type { EliminationType } from "@gd/proto/round/v1/round_pb";

export interface TournamentRound {
  id: string;
  name: string;
  eliminationType: EliminationType.SINGLE | EliminationType.DOUBLE;
  side: string;
  raceTo: number;
  bracketId: string
}
