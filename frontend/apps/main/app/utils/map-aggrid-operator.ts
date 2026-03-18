import { FilterOperator } from "@gd/proto/tournament/v1/tournament_service_pb";

export function mapAgGridOperatorToFilterOperator(type: string): FilterOperator {
  switch (type) {
    case "equals":
      return FilterOperator.EQ;

    case "notEqual":
      return FilterOperator.NEQ;

    case "contains":
      return FilterOperator.CONTAINS;

    case "notContains":
      return FilterOperator.NOT_CONTAINS;

    case "startsWith":
      return FilterOperator.STARTS_WITH;

    case "endsWith":
      return FilterOperator.ENDS_WITH;

    case "greaterThan":
      return FilterOperator.GT;

    case "greaterThanOrEqual":
      return FilterOperator.GTE;

    case "lessThan":
      return FilterOperator.LT;

    case "lessThanOrEqual":
      return FilterOperator.LTE;

    case "inRange":
      return FilterOperator.BETWEEN;

    case "blank":
      return FilterOperator.IS_NULL;

    case "notBlank":
      return FilterOperator.IS_NOT_NULL;

    case "set":
      return FilterOperator.SET;

    default:
      return FilterOperator.FILTER_MATCH_TYPE_UNSPECIFIED;
  }
}
