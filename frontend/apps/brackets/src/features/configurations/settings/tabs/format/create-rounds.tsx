import { RoundClient } from "@/helper/service-client";
import { useTournamentStore } from "@/store/match";
import { create } from "@bufbuild/protobuf";
import { RoundSchema, type Round } from "@gd/proto/round/v1/round_pb";
import { ReplaceRoundsRequestSchema } from "@gd/proto/round/v1/round_service_pb";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";

export const CreateRoundsButton = () => {
  const { tournament } = useTournamentStore();

  const queryClient = useQueryClient();

  const handleSaveRound = async (rounds: Round[]) => {
    const bracketIDs = tournament?.brackets.map((e) => e.id);

    const rq = create(ReplaceRoundsRequestSchema, {
      bracketIds: bracketIDs,
      rounds,
    });
    const data = await RoundClient.replaceRounds(rq);

    queryClient.invalidateQueries({ queryKey: ["tournament"] });

    console.log("data", data);
  };

  const onClick = () => {
    const maxPlayer = 64;
    const totalRounds = Math.ceil(Math.log2(maxPlayer));
    console.log("totalRounds", totalRounds);

    const bracketIds = [
      tournament?.brackets.find((b) => b.side === "winner")?.id,
      tournament?.brackets.find((b) => b.side === "loser")?.id,
    ].filter(Boolean);

    const rounds = Array.from({ length: totalRounds }, (_, i) => {
      const roundSize = 2 ** (totalRounds - i);
      const isKnockoutStage = roundSize <= 8;

      const roundName =
        roundSize === 8
          ? "Quarterfinal"
          : roundSize === 4
            ? "Semifinal"
            : roundSize === 2
              ? "Final"
              : `Last ${roundSize}`;

      return bracketIds.map((bracketId) =>
        create(RoundSchema, {
          matches: [],
          name: roundName,
          bracketId,
          orderIndex: i,
          eliminationType: isKnockoutStage ? "SINGLE" : "DOUBLE",
          raceTo: 9,
        }),
      );
    }).flat();

    console.log("rounds", rounds)

    handleSaveRound(rounds);
  };

  return (
    <Button className="mb-4" size="large" onClick={onClick}>
      Lấy danh sách vòng đấu
    </Button>
  );
};
