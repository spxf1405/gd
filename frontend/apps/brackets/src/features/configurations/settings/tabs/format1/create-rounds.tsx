import { RoundClient } from "@/helper/service-client";
import { useTournamentStore } from "@/store/match";
import { create } from "@bufbuild/protobuf";
import { RoundSchema, type Round } from "@gd/proto/round/v1/round_pb";
import { ReplaceRoundsRequestSchema } from "@gd/proto/round/v1/round_service_pb";
import { Button } from "antd";

export const CreateRoundsButton = () => {
  const { tournament } = useTournamentStore();

  const handleSaveRound = async (rounds: Round[]) => {
    const rq = create(ReplaceRoundsRequestSchema, {
      tournamentId: '123',
      rounds: rounds
    })
    const data = await RoundClient.replaceRounds(rq)

    console.log("data", data)
  }

  const onClick = () => {
    const maxPlayer = 64
    const totalRounds = Math.ceil(Math.log2(maxPlayer));
    console.log("totalRounds", totalRounds)

    const bracketIds = [
      tournament?.brackets.find((b) => b.side === "winner")?.id,
      tournament?.brackets.find((b) => b.side === "loser")?.id,
    ].filter(Boolean);

    const rounds = Array.from({ length: totalRounds + 1 }, (_, i) =>
      bracketIds.map((bracketId) =>
        create(RoundSchema, {
          matches: [],
          name: `Last ${2 ** (totalRounds - i)}`,
          bracketId,
          orderIndex: i,
          eliminationType: "DOUBLE",
          raceTo: 9,
        })
      )
    ).flat();

    console.log("rounds", rounds);
    handleSaveRound(rounds)
  };

  return <Button size="large" onClick={onClick}>Lấy danh sách vòng đấu</Button>;
};