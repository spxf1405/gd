import { FilterOperator } from "@gd/proto/tournament/v1/tournament_service_pb";

export function toFilterOperator(operator?: string): FilterOperator {
  console.log("operator", operator);
  switch (operator) {
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

    case "blank":
      return FilterOperator.IS_NULL;

    case "notBlank":
      return FilterOperator.IS_NOT_NULL;

    default:
      return FilterOperator.FILTER_MATCH_TYPE_UNSPECIFIED;
  }
}
