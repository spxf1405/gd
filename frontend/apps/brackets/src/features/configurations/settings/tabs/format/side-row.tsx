import { EliminationType } from "@gd/proto/round/v1/round_pb";
import { RaceToPicker } from "./race-to-picker";
import type { TournamentRound } from "./types/types";

export function SideRow({
  round,
  onChange,
}: {
  round: TournamentRound;
  onChange: (patch: TournamentRound) => void;
}) {
  if (
    round.eliminationType === EliminationType.SINGLE &&
    round.side === "loser"
  ) {
    return null;
  }

  const isLoser = round.side === "loser";

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 pl-6 pr-4 py-2.5
                  border-l-2 ${isLoser ? "border-rose-400/70" : "border-emerald-400/70"}`}
    >
      <span
        className={`text-xs font-medium whitespace-nowrap ${
          isLoser ? "text-rose-400" : "text-emerald-400"
        }`}
      >
        {isLoser ? "Loser bracket · Race to" : "Winner bracket · Race to"}
      </span>

      <RaceToPicker
        value={round.raceTo}
        onChange={(raceTo) => onChange({ ...round, raceTo })}
        accent={isLoser ? "rose" : "emerald"}
      />
    </div>
  );
}
