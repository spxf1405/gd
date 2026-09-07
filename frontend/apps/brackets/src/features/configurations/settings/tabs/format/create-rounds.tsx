import { QButton } from "@/components/ui/button";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { create } from "@bufbuild/protobuf";
import type { Bracket } from "@gd/proto/bracket/v1/bracket_pb";
import type { Participant } from "@gd/proto/participant/v1/participant_pb";
import { EliminationType, RoundSchema } from "@gd/proto/round/v1/round_pb";
import { type Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { message, Popconfirm } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";

export const CreateRoundsButton = ({ label }: { label: string }) => {
  const { t } = useTranslation();
  const form = useFormInstance<Tournament>();
  const [loading, setLoading] = useState(false);

  const getRoundName = (roundSize: number, isFirstRound: boolean): string => {
    if (roundSize === 8) return t("settings.format.rounds.quarterfinal");
    if (roundSize === 4) return t("settings.format.rounds.semifinal");
    if (roundSize === 2) return t("settings.format.rounds.final");
    if (isFirstRound) return t("settings.format.rounds.qualification");
    return t("settings.format.rounds.lastN", { size: roundSize });
  };

  const handleReplaceRounds = async () => {
    const { brackets, participants } = form.getFieldsValue(true) as {
      brackets: Bracket[];
      participants: Participant[];
    };

    const maxPlayer = participants?.length ?? 4;

    // if (maxPlayer < 2) {
    //   message.warning(t("settings.format.rounds.minParticipantsWarning"));
    //   return;
    // }

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

      form.setFieldValue("brackets", updatedBrackets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const brackets = form.getFieldValue("brackets") as Bracket[];

    const roundCount = brackets.map((e) => e.rounds).flat().length;

    console.log("roundCount", roundCount);

    if (!roundCount) {
      handleReplaceRounds();
    }
  }, [form]);

  return (
    <Popconfirm
      title={t("settings.format.rounds.popconfirmTitle")}
      description={
        <div className="w-72">
          {t("settings.format.rounds.popconfirmDescription")}
        </div>
      }
      onConfirm={handleReplaceRounds}
      placement="right"
      okText={
        <span className="flex items-center gap-1">
          <CheckOutlined /> {t("settings.format.rounds.yes")}
        </span>
      }
      cancelText={
        <span className="flex items-center gap-1">
          <CloseOutlined /> {t("settings.format.rounds.no")}
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
        {/* {label} */}
        Đồng bộ rounds
      </QButton>
    </Popconfirm>
  );
};
