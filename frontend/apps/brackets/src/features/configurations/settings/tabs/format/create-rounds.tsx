import { useParticipantsByTournamentID } from "@/features/configurations/players/hooks";
import { RoundClient } from "@/helper/service-client";
import { useTournamentStore } from "@/store/match";
import { create } from "@bufbuild/protobuf";
import { EliminationType, RoundSchema, type Round } from "@gd/proto/round/v1/round_pb";
import { ReplaceRoundsRequestSchema } from "@gd/proto/round/v1/round_service_pb";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import { RefreshCcw } from "lucide-react";

export const CreateRoundsButton = ({ label }: { label: string }) => {
  const { tournament } = useTournamentStore();
  const { data: tournamentParticipants } = useParticipantsByTournamentID({
    tournamentId: tournament?.id,
  });

  const queryClient = useQueryClient();

  const replaceRounds = async (rounds: Round[]) => {
    const bracketIDs = tournament?.brackets.map((e) => e.id);

    const rq = create(ReplaceRoundsRequestSchema, {
      bracketIds: bracketIDs,
      rounds,
    });
    await RoundClient.replaceRounds(rq);

    queryClient.invalidateQueries({ queryKey: ["tournament"] });
  };

  const { isPending, mutate: handleReplaceRounds } = useMutation({
    mutationFn: (rounds: Round[]) => replaceRounds(rounds),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const onClick = () => {
    const maxPlayer =
      tournamentParticipants?.tournamentParticipants.length ?? 0;
    const totalRounds = Math.ceil(Math.log2(maxPlayer));

    const bracketIds = [
      tournament?.brackets.find((b) => b.side === "winner")?.id,
      tournament?.brackets.find((b) => b.side === "loser")?.id,
    ].filter(Boolean);

    const rounds = Array.from({ length: totalRounds }, (_, i) => {
      const roundSize = 2 ** (totalRounds - i);
      const isKnockoutStage = roundSize <= 8;

      const getRoundName = (roundSize: number, i: number): string => {
        if (i === 0) return "Vòng loại";
        if (roundSize === 8) return "Quarterfinal";
        if (roundSize === 4) return "Semifinal";
        if (roundSize === 2) return "Final";
        return `Last ${roundSize}`;
      };

      const roundName = getRoundName(roundSize, i);

      return bracketIds.map((bracketId) =>
        create(RoundSchema, {
          matches: [],
          name: roundName,
          bracketId,
          orderIndex: i,
          eliminationType: isKnockoutStage ? EliminationType.SINGLE :  EliminationType.DOUBLE,
          raceTo: 11,
        }),
      );
    }).flat();

    handleReplaceRounds(rounds);
  };

  return (
    <Button
      size="large"
      className="my-4"
      onClick={onClick}
      disabled={isPending}
    >
      <RefreshCcw size={14} className={isPending ? "animate-spin" : ""} />{" "}
      {label}
    </Button>
  );
};
