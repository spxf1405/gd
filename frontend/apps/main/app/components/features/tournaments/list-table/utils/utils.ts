import {
  TournamentFilterBy,
  TournamentSortBy,
} from "@gd/proto/tournament/v1/tournament_service_pb";

export function mapFieldToTournamentFilterBy(
  field: string,
): TournamentFilterBy {
  switch (field) {
    case "name":
      return TournamentFilterBy.NAME;

    case "type":
      return TournamentFilterBy.TYPE;

    case "format":
      return TournamentFilterBy.FORMAT;

    case "location":
      return TournamentFilterBy.LOCATION;

    case "startDate":
      return TournamentFilterBy.START_DATE;

    case "status":
      return TournamentFilterBy.STATUS;

    default:
      return TournamentFilterBy.UNSPECIFIED;
  }
}

export function mapFieldToSort(field: string): TournamentSortBy {
  switch (field) {
    case "name":
      return TournamentSortBy.NAME;

    case "createdAt":
      return TournamentSortBy.CREATED_AT;

    case "startDate":
      return TournamentSortBy.START_DATE;

    case "status":
      return TournamentSortBy.END_DATE;

    case "total_prize":
      return TournamentSortBy.TOTAL_PRIZE;

    default:
      return TournamentSortBy.UNSPECIFIED;
  }
}
