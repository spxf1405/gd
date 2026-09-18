import { AntdThemeConfig } from "@/components/ui/antd-config";
import { QButton } from "@/components/ui/button";
import { useTournamentStore } from "@/store/match";
import { TournamentClient } from "@/helper/service-client";
import { COLORS } from "../settings/consts/color";

import { create } from "@bufbuild/protobuf";
import { ChangeTournamentStatusRequestSchema } from "@gd/proto/tournament/v1/tournament_service_pb";
import { TournamentStatus } from "@gd/proto/tournament/v1/tournament_pb";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SquarePen } from "lucide-react";

type UpdateTournamentStatusParams = {
  status: TournamentStatus;
  id: string;
};

const useUpdateTournamentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ status, id }: UpdateTournamentStatusParams) => {
      console.log("foo", status, id);

      
      const request = create(ChangeTournamentStatusRequestSchema, {
        status,
        id,
      });

      await TournamentClient.changeTournamentStatus(request);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tournament"] });
    },
    onError: () => {
      console.log("error");
    },
  });
};

type StatusButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const StatusButton = ({ children, onClick }: StatusButtonProps) => {
  return (
    <AntdThemeConfig>
      <QButton
        icon={<SquarePen size={16} style={{ color: COLORS.green }} />}
        size="large"
        style={{
          height: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 13,
          color: "#ffffff",
          border: `1px solid ${COLORS.border}`,
          background: "linear-gradient(135deg, #1a1d27, #22263a)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
        onClick={onClick}
      >
        {children}
      </QButton>
    </AntdThemeConfig>
  );
};

type TournamentStatusActionProps = {
  status: TournamentStatus;
  label: string;
};

const TournamentStatusAction = ({
  status,
  label,
}: TournamentStatusActionProps) => {
  const { tournament } = useTournamentStore();
  const mutation = useUpdateTournamentStatus();

  const onClick = () => {
    if (!tournament) return;

    mutation.mutate({
      status,
      id: tournament.id,
    });
  };

  return <StatusButton onClick={onClick}>{label}</StatusButton>;
};

export const TournamentStatusControl = () => {
  const { tournament } = useTournamentStore();

  const content = (() => {
    switch (tournament?.status) {
      case TournamentStatus.UNSPECIFIED:
        return (
          <TournamentStatusAction
            status={TournamentStatus.REGISTERING}
            label="Mở đăng ký"
          />
        );

      case TournamentStatus.REGISTERING:
        return (
          <TournamentStatusAction
            status={TournamentStatus.REGISTRATION_CLOSED}
            label="Bắt đầu giải đấu"
          />
        );

      default:
        return null;
    }
  })();

  return content;
};
