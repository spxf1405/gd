import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { type ColDef } from "ag-grid-community";
import dayjs from "dayjs";
import {
  ActionCell,
  FormatCell,
  PlayersCell,
  PrizeCell,
  StatusCell,
  TypeCell,
  FormatFilter,
  StatusFilter,
  TypeFilter,
  TypeEditor,
  FormatEditor,
  StartDateEditor,
  LocationEditor,
  StartDateFilter,
} from "../renderers/renderers";
import { StatusEditor } from "../renderers/editors/status";
import { useI18n } from "vue-i18n";

export const useTournamentColumnDefs = (): ColDef<Tournament>[] => {
  const { t } = useI18n();

  return [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 20,
      pinned: "left",
      filter: false,
    },
    {
      field: "name",
      headerName: t("tournament.columns.name"),
      width: 400,
      pinned: "left",
      sortable: false,
      autoHeight: true,
      filterParams: {
        maxNumConditions: 1,
        suppressAndOrCondition: true,
      },
    },
    {
      field: "status",
      headerName: t("tournament.columns.status"),
      editable: true,
      sortable: false,
      cellRenderer: StatusCell,
      filter: StatusFilter,
      cellEditor: StatusEditor,
    },
    {
      field: "type",
      headerName: t("tournament.columns.type"),
      width: 130,
      sortable: false,
      editable: true,
      filter: TypeFilter,
      cellRenderer: TypeCell,
      cellEditor: TypeEditor,
      valueSetter: (params) => {
        params.data.type = params.newValue;
        return true;
      },
    },
    {
      field: "format",
      headerName: t("tournament.columns.format"),
      sortable: false,
      editable: true,
      cellEditor: FormatEditor,
      cellRenderer: FormatCell,
      filter: FormatFilter,
    },
    {
      field: "location",
      headerName: t("tournament.columns.location"),
      width: 400,
      sortable: false,
      editable: true,
      cellEditor: LocationEditor,
    },
    {
      field: "createdAt",
      headerName: t("tournament.columns.createdAt"),
      minWidth: 195,
      filter: StartDateFilter,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return dayjs(params.value).format("DD/MM/YYYY");
      },
    },
    {
      field: "startDate",
      headerName: t("tournament.columns.startDate"),
      minWidth: 195,
      editable: true,
      cellEditor: StartDateEditor,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return dayjs(params.value).format("DD/MM/YYYY");
      },
    },
    {
      field: "registeredPlayers",
      headerName: t("tournament.columns.registeredPlayers"),
      width: 150,
      cellRenderer: PlayersCell,
      filter: false,
      sortable: false,
    },
    {
      field: "totalPrize",
      headerName: t("tournament.columns.totalPrize"),
      cellRenderer: PrizeCell,
      filter: false,
    },
    {
      field: "endDate",
      headerName: t("tournament.columns.endDate"),
      width: 130,
      filter: false,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return new Date(params.value).toLocaleDateString("vi-VN");
      },
    },
    {
      colId: "actions",
      headerName: t("tournament.columns.actions"),
      cellRenderer: ActionCell,
      filter: false,
      sortable: false,
      resizable: false,
      suppressMovable: true,
      pinned: "right",
    },
  ];
};
