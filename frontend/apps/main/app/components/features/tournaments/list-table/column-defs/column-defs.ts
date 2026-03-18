import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import {
    type ColDef
} from "ag-grid-community";
import dayjs from "dayjs";
import { ActionCell, FormatCell, PlayersCell, PrizeCell, StatusCell, TypeCell } from "../renderers/cells/cells";
import { StatusFilter, TypeFilter } from "../renderers/filters/filters";
import StartDate from "../renderers/filters/start-date.vue";

export const TournamentColumnDefs: ColDef<Tournament>[] = [
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 20,
    pinned: "left",
    filter: false,
  },
  {
    field: "name",
    headerName: "Tên giải đấu",
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
    headerName: "Trạng thái",
    width: 150,
    cellRenderer: StatusCell,
    filter: StatusFilter,
    sortable: false,
  },
  {
    field: "type",
    headerName: "Loại hình",
    width: 130,
    sortable: false,
    filter: TypeFilter,
    cellRenderer: TypeCell,
  },
  {
    field: "format",
    headerName: "Thể thức",
    sortable: false,
    cellRenderer: FormatCell,
  },
  {
    field: "location",
    headerName: "Địa điểm",
    width: 400,
    sortable: false,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    minWidth: 195,
    filter: markRaw(StartDate),
    valueFormatter: (params) => {
      if (!params.value) return "";
      return dayjs(params.value).format("DD/MM/YYYY");
    },
  },
  {
    field: "startDate",
    headerName: "Ngày khởi tranh",
    minWidth: 195,
    valueFormatter: (params) => {
      if (!params.value) return "";
      return dayjs(params.value).format("DD/MM/YYYY");
    },
  },
  {
    field: "registeredPlayers",
    headerName: "Người tham gia",
    width: 150,
    cellRenderer: PlayersCell,
    filter: false,
    sortable: false,
  },
  {
    field: "totalPrize",
    headerName: "Tổng giải thưởng",
    cellRenderer: PrizeCell,
    filter: false,
  },
  {
    field: "endDate",
    headerName: "Ngày kết thúc",
    width: 130,
    filter: false,
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleDateString("vi-VN");
    },
  },
  {
    colId: "actions",
    headerName: "Thao tác",
    cellRenderer: ActionCell,
    filter: false,
    sortable: false,
    width: 270,
    resizable: false,
    suppressMovable: true,
    pinned: "right",
  },
];
