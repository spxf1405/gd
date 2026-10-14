import { TournamentErrorCode } from "@gd/proto/tournament/v1/tournament_error_pb";

export const TOURNAMENT_ERROR_MESSAGES: Partial<Record<TournamentErrorCode, string>> =
  {
    [TournamentErrorCode.NAME_REQUIRED]: "Bạn chưa nhập tên giải đấu!",
    [TournamentErrorCode.VENUE_REQUIRED]: "Bạn cần cài đặt thông tin địa điểm thi đấu!",
    [TournamentErrorCode.ROUNDS_REQUIRED]:
      "Bạn chưa cài đặt các vòng của giải đấu!",
  };
