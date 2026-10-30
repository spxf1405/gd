import { AntdThemeConfig } from "@/components/ui/antd-config";
import { QButton } from "@/components/ui/button";
import { TournamentClient } from "@/helper/service-client";
import { useTournamentStore } from "@/store/match";

import { create } from "@bufbuild/protobuf";
import {
  TournamentErrorCode,
  TournamentErrorSchema,
} from "@gd/proto/tournament/v1/tournament_error_pb";
import {
  TournamentStatus,
  type Tournament,
} from "@gd/proto/tournament/v1/tournament_pb";
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

export const useUpdateTournamentStatusMutation = ({
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

type StatusButtonProps = {
  loading: boolean;
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

import { Loader2 } from "lucide-react";
import { TOURNAMENT_ERROR_MESSAGES } from "../consts";

const StatusButton = ({
  loading,
  status,
  children,
  onClick,
}: StatusButtonProps) => {
  const config = STATUS_CONFIG[status];

  if (!config) return null;

  const Icon = config.icon;
  const isCancelled = status === TournamentStatus.UNSPECIFIED;

  return (
    <QButton
      size="large"
      disabled={isCancelled || loading}
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
        cursor: isCancelled || loading ? "not-allowed" : "pointer",
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
        {loading ? (
          <Loader2
            size={15}
            style={{
              color: config.color,
              animation: "spin 1s linear infinite",
            }}
          />
        ) : (
          <Icon
            size={15}
            style={{
              color: config.color,
            }}
          />
        )}
      </div>

      <span>{children}</span>
    </QButton>
  );
};

type TournamentStatusActionProps = {
  status: TournamentStatus;
  nextLabel: string;
};

const useTournamentInfo = ({ tournament }: { tournament?: Tournament }) => {
  if (!tournament) {
    return {
      matches: [],
      rounds: [],
      brackets: [],
    };
  }

  const { brackets } = tournament;

  const rounds =
    tournament.brackets?.flatMap((bracket) => bracket.rounds ?? []) ?? [];

  const matches =
    rounds?.flatMap((round) => {
      if (!round.matches) return [];

      return round.matches.map((match) => ({
        ...match,
        round: round.orderIndex,
        roundCount: rounds.length,
      }));
    }) ?? [];

  return { matches, rounds, brackets };
};

const TournamentStatusAction = ({
  status,
  nextLabel,
}: TournamentStatusActionProps) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  const { id } = useTournamentStore();
  const { data: tournament, isLoading } = useTournament(id);

  const onChangeStatusSuccess = () => {
    notification.success({
      message: <div className="font-bold">Thành công!</div>,
      description: "Cập nhật trạng thái thành công!",
      placement: "top",
      duration: 3,
      style: { width: "fit-content" },
      styles: {
        wrapper: {
          fontFamily: "IBM Plex Sans, Google Sans",
        },
      },
    });
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
      duration: 3,
      style: { width: "fit-content" },
      styles: {
        wrapper: {
          fontFamily: "IBM Plex Sans, Google Sans",
        },
      },
    });
  };

  const mutation = useUpdateTournamentStatusMutation({
    onError: onChangeStatusError,
    onSuccess: onChangeStatusSuccess,
  });

  const { matches } = useTournamentInfo({ tournament });

  const validate = () => {
    if (status === TournamentStatus.RUNNING) {
      if (!matches.length) {
        notification.error({
          message: (
            <div className="text-[15px] font-semibold">
              Chưa thể bắt đầu giải đấu
            </div>
          ),
          description: (
            <div className="space-y-2 text-[14px] leading-5">
              Chưa có trận đấu nào sẵn sàng. Vui lòng Ghép cặp thi đấu!
            </div>
          ),
          placement: "top",
          duration: 3,
          style: { width: "fit-content", minWidth: 400 },
          styles: {
            wrapper: {
              fontFamily: "IBM Plex Sans, Google Sans",
            },
          },
        });

        return;
      }

      const validMixMatches = matches.filter(
        (m) => (m.round === 0 || m.round === 1) && m.participants.length === 2,
      ).length;

      const validMatchesNeeded = Math.floor(
        (tournament?.participants?.length ?? 0) / 2,
      );

      if (validMixMatches !== validMatchesNeeded) {
        notification.error({
          message: (
            <div className="text-[15px] font-semibold">
              Chưa thể bắt đầu giải đấu
            </div>
          ),
          description: (
            <div className="space-y-2 text-[14px] leading-5">
              Số trận đấu chưa đúng so với số vận động viên tham gia.
              <br />
              Số trận đã tạo:{" "}
              <b>{validMixMatches}</b> -
              Số trận cần: <b>{validMatchesNeeded}</b> <br />
              Nếu bạn đã tạo các trận đấu trước đó hoặc thêm đăng kí mới, vui
              lòng ghép cặp thi đấu lại!
            </div>
          ),
          placement: "top",
          duration: 10,
          style: { width: "fit-content", minWidth: 400 },
          styles: {
            wrapper: {
              fontFamily: "IBM Plex Sans, Google Sans",
            },
          },
        });
        return;
      }
    }


    return true;
  };

  const onClick = () => {
    if (!tournament) return;

    const isValid = validate();

    if (isValid) {
      mutation.mutate({
        id: tournament.id,
        status: status,
      });
    }
  };

  return (
    <StatusButton
      loading={mutation.isPending || isLoading}
      status={status}
      onClick={onClick}
    >
      {nextLabel}
    </StatusButton>
  );
};

export const TournamentStatusControl = () => {
  const { id } = useTournamentStore();
  const { data: tournament } = useTournament(id);

  const content = useMemo(() => {
    if (!tournament)
      return (
        <TournamentStatusAction
          status={TournamentStatus.UNSPECIFIED}
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

  return (
    <AntdThemeConfig>
      <App>{content}</App>
    </AntdThemeConfig>
  );
};
