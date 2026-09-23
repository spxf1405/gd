import { AntdThemeConfig } from "@/components/ui/antd-config";
import { QButton } from "@/components/ui/button";
import { TournamentClient } from "@/helper/service-client";
import { useTournamentStore } from "@/store/match";

import { create } from "@bufbuild/protobuf";
import {
  TournamentErrorCode,
  TournamentErrorSchema,
} from "@gd/proto/tournament/v1/tournament_error_pb";
import { TournamentStatus } from "@gd/proto/tournament/v1/tournament_pb";
import { ChangeTournamentStatusRequestSchema } from "@gd/proto/tournament/v1/tournament_service_pb";

import { useTournament } from "@/hook/tournament";
import { ConnectError } from "@connectrpc/connect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { useMemo } from "react";

import {
  Ban,
  CirclePlay,
  DoorOpen,
  Loader,
  LockKeyhole,
  Play,
  Trophy,
} from "lucide-react";

// TODO: Khi bắt đầu giải đấu và hủy, cần có modal để thông báo cho người dùng

type UpdateTournamentStatusParams = {
  status: TournamentStatus;
  id: string;
};

const useUpdateTournamentStatus = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (err: unknown) => void;
}) => {
  return useMutation({
    mutationFn: async ({ status, id }: UpdateTournamentStatusParams) => {
      const request = create(ChangeTournamentStatusRequestSchema, {
        status,
        id,
      });

      return await TournamentClient.changeTournamentStatus(request);
    },
    onSuccess,
    onError,
  });
};

const TOURNAMENT_ERROR_MESSAGES: Partial<Record<TournamentErrorCode, string>> =
  {
    [TournamentErrorCode.NAME_REQUIRED]: "Bạn chưa nhập tên giải đấu!",
    [TournamentErrorCode.VENUE_REQUIRED]: "Bạn chưa chọn địa điểm thi đấu!",
    [TournamentErrorCode.ROUNDS_REQUIRED]:
      "Bạn chưa cài đặt các vòng của giải đấu!",
  };

type StatusButtonProps = {
  status: TournamentStatus;
  children: React.ReactNode;
  onClick: () => void;
};

const STATUS_CONFIG = {
  [TournamentStatus.UNSPECIFIED]: {
    icon: DoorOpen,
    color: "#94A3B8",
    border: "rgba(148, 163, 184, 0.25)",
    background:
      "linear-gradient(135deg, rgba(148, 163, 184, 0.12), rgba(148, 163, 184, 0.04))",
  },
  [TournamentStatus.REGISTERING]: {
    icon: DoorOpen,
    color: "#22C55E",
    border: "rgba(34, 197, 94, 0.25)",
    background:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.04))",
  },
  [TournamentStatus.REGISTRATION_CLOSED]: {
    icon: LockKeyhole,
    color: "#EA580C",
    border: "rgba(234, 88, 12, 0.25)",
    background:
      "linear-gradient(135deg, rgba(234, 88, 12, 0.12), rgba(234, 88, 12, 0.04))",
  },
  [TournamentStatus.STARTED]: {
    icon: Play,
    color: "#0EA5E9",
    border: "rgba(14, 165, 233, 0.25)",
    background:
      "linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(14, 165, 233, 0.04))",
  },
  [TournamentStatus.RUNNING]: {
    icon: CirclePlay,
    color: "#8B5CF6",
    border: "rgba(139, 92, 246, 0.25)",
    background:
      "linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(139, 92, 246, 0.04))",
  },
  [TournamentStatus.FINISHED]: {
    icon: Trophy,
    color: "#EAB308",
    border: "rgba(234, 179, 8, 0.25)",
    background:
      "linear-gradient(135deg, rgba(234, 179, 8, 0.12), rgba(234, 179, 8, 0.04))",
  },
  [TournamentStatus.CANCELLED]: {
    icon: Ban,
    color: "#EF4444",
    border: "rgba(239, 68, 68, 0.25)",
    background:
      "linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.04))",
  },
};

const StatusButton = ({ status, children, onClick }: StatusButtonProps) => {
  const config = STATUS_CONFIG[status];

  if (!config) return null;

  const Icon = config.icon;
  const isCancelled = status === TournamentStatus.UNSPECIFIED;

  return (
    <QButton
      size="large"
      disabled={isCancelled}
      onClick={onClick}
      style={{
        height: "44px",
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        padding: "0 18px 0 12px",
        borderRadius: "10px",
        fontWeight: 600,
        fontSize: "13px",
        letterSpacing: "0.03em",

        color: isCancelled ? "#A0A6B5" : "#FFFFFF",

        background: isCancelled ? "#1F232E" : "#242936",
        border: `1px solid ${
          isCancelled
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(255, 255, 255, 0.12)"
        }`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
        cursor: isCancelled ? "not-allowed" : "pointer",
        opacity: isCancelled ? 0.85 : 1,
        transition: "all 0.2s ease-in-out",
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.2)",
          border: `1px solid ${
            isCancelled ? "rgba(255, 255, 255, 0.1)" : `${config.color}40`
          }`,
          flexShrink: 0,
        }}
      >
        <Icon
          size={15}
          style={{
            color: config.color,
          }}
        />
      </div>

      <span>{children}</span>
    </QButton>
  );
};

type TournamentStatusActionProps = {
  status: TournamentStatus;
  nextLabel: string;
  isLoadingButton?: boolean;
};

const TournamentStatusAction = ({
  status,
  nextLabel,
  isLoadingButton,
}: TournamentStatusActionProps) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  const { id } = useTournamentStore();
  const tournament = useTournament(id);

  const onChangeStatusSuccess = () => {
    void queryClient.invalidateQueries({ queryKey: ["tournament"] });
  };

  const onChangeStatusError = (error: unknown) => {
    const connectError = ConnectError.from(error);
    const detail = connectError.findDetails(TournamentErrorSchema)[0];

    const description = detail
      ? (TOURNAMENT_ERROR_MESSAGES[detail.code] ?? connectError.rawMessage)
      : connectError.rawMessage;

    notification.error({
      message: <div className="font-bold">Thất bại!</div>,
      description,
      placement: "top",
      duration: 3000,
      style: { width: "fit-content" },
      styles: {
        wrapper: {
          fontFamily: "IBM Plex Sans, Google Sans",
        },
      },
    });
  };

  const mutation = useUpdateTournamentStatus({
    onError: onChangeStatusError,
    onSuccess: onChangeStatusSuccess,
  });

  const onClick = () => {
    if (!tournament) return;

    mutation.mutate({
      status: status,
      id: tournament.id,
    });
  };

  if (isLoadingButton) {
    return (
      <QButton
        size="large"
        disabled={true}
        onClick={onClick}
        style={{
          height: "44px",
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          padding: "0 18px 0 12px",
          borderRadius: "10px",
          fontWeight: 600,
          fontSize: "13px",
          letterSpacing: "0.03em",

          color: "#A0A6B5",

          background: "#1F232E",
          border: `1px solid rgba(255, 255, 255, 0.08)`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
          cursor: "not-allowed",
          opacity: 0.85,
          transition: "all 0.2s ease-in-out",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.2)",
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            flexShrink: 0,
          }}
          className="animate-spin"
        >
          <Loader
            size={15}
            style={{
              color: "#fff",
            }}
          />
        </div>

        <span>Loading</span>
      </QButton>
    );
  }

  return (
    <StatusButton status={status} onClick={onClick}>
      {nextLabel}
    </StatusButton>
  );
};

export const TournamentStatusControl = () => {
  const { id } = useTournamentStore();
  const tournament = useTournament(id);

  const content = useMemo(() => {
    if (!tournament)
      return (
        <TournamentStatusAction
          status={TournamentStatus.UNSPECIFIED}
          isLoadingButton={true}
          nextLabel=""
        />
      );

    switch (tournament.status) {
      case TournamentStatus.UNSPECIFIED:
        return (
          <TournamentStatusAction
            status={TournamentStatus.REGISTERING}
            nextLabel="Mở đăng ký"
          />
        );

      case TournamentStatus.REGISTERING:
        return (
          <TournamentStatusAction
            status={TournamentStatus.REGISTRATION_CLOSED}
            nextLabel="Kết thúc đăng ký"
          />
        );

      case TournamentStatus.REGISTRATION_CLOSED:
        return (
          <div className="flex gap-2">
            <TournamentStatusAction
              status={TournamentStatus.RUNNING}
              nextLabel="Bắt đầu giải đấu"
            />
            <TournamentStatusAction
              status={TournamentStatus.REGISTERING}
              nextLabel="Mở lại đăng ký"
            />
          </div>
        );

      case TournamentStatus.RUNNING:
        return (
          <TournamentStatusAction
            status={TournamentStatus.CANCELLED}
            nextLabel="Hủy giải đấu"
          />
        );
      case TournamentStatus.CANCELLED:
        return (
          <TournamentStatusAction
            status={TournamentStatus.UNSPECIFIED}
            nextLabel="Giải đấu đã bị hủy"
          />
        );

      default:
        return <></>;
    }
  }, [tournament?.status]);

  return <AntdThemeConfig>{content}</AntdThemeConfig>;
};
