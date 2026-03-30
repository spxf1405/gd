import {
  TournamentFormat,
  TournamentType,
  TournamentStatus,
} from "@gd/proto/tournament/v1/tournament_pb";

export const useTournamentMaps = () => {
  const { t } = useI18n();

  const StatusMap: Partial<
    Record<TournamentStatus, { label: string; color: string }>
  > = {
    [TournamentStatus.UNSPECIFIED]: {
      label: t("tournament.status.unspecified"),
      color: "bg-gray-100 text-gray-700",
    },
    [TournamentStatus.REGISTERING]: {
      label: t("tournament.status.registering"),
      color: "bg-blue-100 text-blue-700",
    },
    [TournamentStatus.REGISTRATION_CLOSED]: {
      label: t("tournament.status.registrationClosed"),
      color: "bg-amber-100 text-amber-700",
    },
    [TournamentStatus.STARTED]: {
      label: t("tournament.status.started"),
      color: "bg-purple-100 text-purple-700",
    },
    [TournamentStatus.RUNNING]: {
      label: t("tournament.status.running"),
      color: "bg-green-100 text-green-700",
    },
    [TournamentStatus.FINISHED]: {
      label: t("tournament.status.finished"),
      color: "bg-slate-200 text-slate-700",
    },
    [TournamentStatus.CANCELLED]: {
      label: t("tournament.status.cancelled"),
      color: "bg-red-100 text-red-700",
    },
  };

  const TypeMap: Partial<Record<TournamentType, string>> = {
    [TournamentType.SINGLE]: t("tournament.type.single"),
    [TournamentType.TEAM]: t("tournament.type.team"),
  };

  const FormatMap: Partial<Record<TournamentFormat, string>> = {
    [TournamentFormat.TOURNAMENT_TYPE_8_BALL]: t("tournament.format.8ball"),
    [TournamentFormat.TOURNAMENT_TYPE_9_BALL]: t("tournament.format.9ball"),
    [TournamentFormat.TOURNAMENT_TYPE_10_BALL]: t("tournament.format.10ball"),
  };

  return { StatusMap, TypeMap, FormatMap };
};
