import { QButton } from "@/components/ui/button";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { create } from "@bufbuild/protobuf";
import type { Bracket } from "@gd/proto/bracket/v1/bracket_pb";
import type { Participant } from "@gd/proto/participant/v1/participant_pb";
import { EliminationType, RoundSchema } from "@gd/proto/round/v1/round_pb";
import {
  type Tournament
} from "@gd/proto/tournament/v1/tournament_pb";
import { message, Popconfirm } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { v4 } from "uuid";

const getRoundName = (roundSize: number, isFirstRound: boolean): string => {
  if (roundSize === 8) return "Quarterfinal";
  if (roundSize === 4) return "Semi final";
  if (roundSize === 2) return "Final";
  if (isFirstRound) return "Vòng loại";
  return `Last ${roundSize}`;
};

export const CreateRoundsButton = ({ label }: { label: string }) => {
  const form = useFormInstance<Tournament>();
  const [loading, setLoading] = useState(false);

  const handleReplaceRounds = async () => {
    const { brackets, participants } = form.getFieldsValue(true) as {
      brackets: Bracket[];
      participants: Participant[];
    };

    const maxPlayer = participants?.length ?? 0;

    if (maxPlayer < 2) {
      message.warning("Cần ít nhất 2 participants để tạo rounds");
      return;
    }

    setLoading(true);
    try {
      const totalRounds = Math.ceil(Math.log2(maxPlayer));

      const updatedBrackets: Bracket[] = brackets.map((bracket) => {
        return { ...bracket, rounds: [] };
      });

      for (let i = 0; i < totalRounds; i++) {
        const roundSize = 2 ** (totalRounds - i);
        const isKnockoutStage = roundSize <= 8;
        const roundName = getRoundName(roundSize, i === 0);

        for (const bracket of updatedBrackets) {
          const round = create(RoundSchema, {
            id: v4(),
            matches: [],
            name: roundName,
            bracketId: bracket.id,
            orderIndex: i,
            eliminationType: isKnockoutStage
              ? EliminationType.SINGLE
              : EliminationType.DOUBLE,
            raceTo: 11,
          });

          bracket.rounds.push(round);
        }
      }

      console.log("updatedBrackets", updatedBrackets);

      form.setFieldValue("brackets", updatedBrackets);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popconfirm
      title="Warning"
      description={
        <div className="w-72">
          Reset cài đặt vòng đấu về mặc định cũng sẽ xóa hết tất cả thông tin
          các trận đấu đã tạo!
        </div>
      }
      onConfirm={handleReplaceRounds}
      placement="right"
      okText={
        <span className="flex items-center gap-1">
          <CheckOutlined /> Yes
        </span>
      }
      cancelText={
        <span className="flex items-center gap-1">
          <CloseOutlined /> No
        </span>
      }
      okButtonProps={{
        size: "medium",
        loading,
      }}
      cancelButtonProps={{
        size: "middle",
        disabled: loading,
      }}
    >
      <QButton size="large" disabled={loading}>
        <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
        {label}
      </QButton>
    </Popconfirm>
  );
};
