import { useTournamentStore } from "@/store/match";
import { create } from "@bufbuild/protobuf";
import { RoundSchema } from "@gd/proto/round/v1/round_pb";
import { Button } from "antd";

export const CreateRoundsButton = () => {
  const { tournament } = useTournamentStore();

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
  };

  return <Button size="large" onClick={onClick}>Lấy danh sách vòng đấu</Button>;
};