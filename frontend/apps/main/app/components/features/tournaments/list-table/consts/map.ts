import {
  TournamentFormat,
  TournamentType,
} from "@gd/proto/tournament/v1/tournament_pb";
import { TournamentStatus } from "@gd/proto/tournament/v1/tournament_pb";

export const StatusMap: Partial<
  Record<TournamentStatus, { label: string; color: string }>
> = {
  [TournamentStatus.UNSPECIFIED]: {
    label: "Chưa mở đăng ký",
    color: "bg-gray-100 text-gray-700",
  },
  [TournamentStatus.REGISTERING]: {
    label: "Đang đăng ký",
    color: "bg-blue-100 text-blue-700",
  },
  [TournamentStatus.REGISTRATION_CLOSED]: {
    label: "Ngừng đăng ký",
    color: "bg-amber-100 text-amber-700",
  },
  [TournamentStatus.STARTED]: {
    label: "Đã bắt đầu",
    color: "bg-purple-100 text-purple-700",
  },
  [TournamentStatus.RUNNING]: {
    label: "Đang diễn ra",
    color: "bg-green-100 text-green-700",
  },
  [TournamentStatus.FINISHED]: {
    label: "Đã kết thúc",
    color: "bg-slate-200 text-slate-700",
  },
  [TournamentStatus.CANCELLED]: {
    label: "Đã huỷ",
    color: "bg-red-100 text-red-700",
  },
};

export const TypeMap: Partial<Record<TournamentType, string>> = {
  [TournamentType.SINGLE]: "Đơn",
  [TournamentType.TEAM]: "Đôi",
};

export const FormatMap: Partial<Record<TournamentFormat, string>> = {
  [TournamentFormat.TOURNAMENT_TYPE_8_BALL]: "8 Bóng",
  [TournamentFormat.TOURNAMENT_TYPE_9_BALL]: "9 Bóng",
  [TournamentFormat.TOURNAMENT_TYPE_10_BALL]: "10 Bóng",
};
