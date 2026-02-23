<script setup lang="tsx">
import { create } from "@bufbuild/protobuf";
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import {
  FilterOperator,
  FilterSchema,
  GetTournamentsRequestSchema,
  SortOrder,
  TournamentFilterBy,
  TournamentSortBy,
  type Filter,
} from "@gd/proto/tournament/v1/tournament_service_pb";
import { Icon } from "@iconify/vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  AllCommunityModule,
  colorSchemeDarkBlue,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type DomLayoutType,
  type FilterChangedEvent,
  type FilterModel,
  type GridReadyEvent,
  type ICellRendererParams,
  type IFilterParams,
  type RowClickedEvent,
  type SortChangedEvent,
} from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue3";

import { ref } from "vue";
import CreateTournamentButton from "~/components/features/tournaments/create-tournament-button.vue";
import DeleteTournament from "~/components/features/tournaments/delete-tournament.vue";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Tournament1 {
  id: string;
  name: string;
  type: string;
  format: string;
  startDate: string;
  endDate: string;
  location: string;
  tables: number;
  totalPrize: number;
  entryFee: number;
  maxPlayers: number;
  registeredPlayers: number;
  status: "Đang đăng ký" | "Đang diễn ra" | "Đã kết thúc";
  organizer: string;
}

const tournaments1 = ref<Tournament1[]>([
  {
    id: "T001",
    name: "Giải Vô Địch 8-Ball Hà Nội 2026",
    type: "8-Ball",
    format: "Đơn",
    startDate: "2026-02-15",
    endDate: "2026-02-20",
    location: "CLB Billard Golden, Hà Nội",
    tables: 12,
    totalPrize: 50000000,
    entryFee: 500000,
    maxPlayers: 64,
    registeredPlayers: 45,
    status: "Đang đăng ký",
    organizer: "CLB Billard Golden",
  },
]);


const PrizeCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament1>>,
      required: true,
    },
  },
  render() {
    const rawPrize = this.params.data?.totalPrize?.toString() || "";
    if (!rawPrize) return <div class="text-slate-300 text-end px-2">---</div>;

    const isUSD = rawPrize.trim().endsWith("$");
    const numericValue = parseFloat(rawPrize.replace(/[^-0-9.]/g, ""));

    // Format số với dấu phẩy ngăn cách hàng nghìn
    const formattedNumber = new Intl.NumberFormat("en-US").format(numericValue);

    return (
      <div class="flex items-baseline justify-end w-full px-2 gap-1 select-all">
        {isUSD && (
          <span class="text-xs font-black text-white-950 opacity-60">$</span>
        )}

        <span class="text-base font-black text-white-950 tracking-tighter">
          {formattedNumber}
        </span>

        {!isUSD && (
          <span class="text-[10px] font-black text-white-950 opacity-60 uppercase tracking-widest">
            VND
          </span>
        )}
      </div>
    );
  },
});

const statusMap: Record<number, { label: string; color: string }> = {
  0: {
    label: "Chưa mở đăng ký",
    color: "bg-gray-100 text-gray-700",
  },
  1: {
    label: "Đang đăng ký",
    color: "bg-blue-100 text-blue-700",
  },
  2: {
    label: "Ngừng đăng ký",
    color: "bg-amber-100 text-amber-700",
  },
  3: {
    label: "Đã bắt đầu",
    color: "bg-purple-100 text-purple-700",
  },
  4: {
    label: "Đang diễn ra",
    color: "bg-green-100 text-green-700",
  },
  5: {
    label: "Đã kết thúc",
    color: "bg-slate-200 text-slate-700",
  },
  6: {
    label: "Đã huỷ",
    color: "bg-red-100 text-red-700",
  },
};

const defaultStatus = {
  label: "Không xác định",
  color: "bg-gray-100 text-gray-500",
};

const StatusSetFilter = defineComponent({
  name: "StatusSetFilter",

  props: {
    params: {
      type: Object as PropType<IFilterParams>,
      required: true,
    },
  },

  setup(props) {
    const selected = ref<number[]>([]);

    const options = Object.entries(statusMap).map(([key, value]) => ({
      value: Number(key),
      ...value,
    }));

    function isFilterActive() {
      return selected.value.length > 0;
    }

    function doesFilterPass(node: any) {
      const field = props.params.colDef.field as string;
      const value = node.data?.[field];

      if (!selected.value.length) return true;

      return selected.value.includes(value);
    }

    function getModel() {
      return selected.value.length
        ? { values: [...selected.value] }
        : null;
    }

    function setModel(model: any) {
      selected.value = model?.values ?? [];
    }

    function toggleValue(value: number) {
      if (selected.value.includes(value)) {
        selected.value = selected.value.filter((v) => v !== value);
      } else {
        selected.value.push(value);
      }

      props.params.filterChangedCallback();
    }

    return {
      selected,
      options,
      toggleValue,
      isFilterActive,
      doesFilterPass,
      getModel,
      setModel,
    };
  },

  render() {
    return (
      <div class="p-3 space-y-2 min-w-[220px]">
        {this.options.map((opt) => (
          <label
            key={opt.value}
            class="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={this.selected.includes(opt.value)}
              onChange={() => this.toggleValue(opt.value)}
              class="accent-blue-500"
            />

            <div
              class={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${opt.color}`}
            >
              <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
              <span>{opt.label}</span>
            </div>
          </label>
        ))}
      </div>
    );
  },
});

const StatusCell = defineComponent({
  name: "StatusCell",
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<{ status?: number }>>,
      required: true,
    },
  },

  render() {
    const status = this.params.data?.status;

    const statusInfo =
      typeof status === "number"
        ? statusMap[status] ?? defaultStatus
        : defaultStatus;

    return (
      <div
        class={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusInfo.color}`}
      >
        <span class="w-2 h-2 rounded-full bg-current opacity-70" />
        <span>{statusInfo.label}</span>
      </div>
    );
  },
});

const TestFilter = defineComponent({
  name: "CustomSetFilter",
  props: {
    params: {
      type: Object as () => IFilterParams,
      required: true,
    },
  },
  setup(props) {
    const selected = ref<string[]>([]);

    function isFilterActive() {
      return selected.value.length > 0;
    }

    function doesFilterPass(node) {
      const field = props.params.colDef.field as string;
      const value = node.data[field];
      return selected.value.length > 0 ? selected.value.includes(value) : true;
    }

    function getModel() {
      return selected.value.length > 0 ? { values: [...selected.value] } : null;
    }

    function setModel(model) {
      selected.value = model?.values || [];
    }

    const toggleValue = (value: string) => {
      if (selected.value.includes(value)) {
        selected.value = selected.value.filter((v) => v !== value);
      } else {
        selected.value.push(value);
      }
      props.params.filterChangedCallback();
    };

    const options = ["Đơn", "Đôi", "Đôi nam nữ", "Đồng Đội"];

    return {
      selected,
      isFilterActive,
      doesFilterPass,
      getModel,
      setModel,
      toggleValue,
      options,
    };
  },
  render() {
    return (
      <div class="p-2 space-y-2">
        {this.options.map((opt) => (
          <label class="flex items-center space-x-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={this.selected.includes(opt)}
              onChange={() => this.toggleValue(opt)}
              class="accent-accent-blue"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  },
});

const PlayersCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament1>>,
      required: true,
    },
  },
  render() {
    const registered = this.params.data?.registeredPlayers.length || 0;

    const max = this.params.data?.maxPlayers || 0;
    const percentage = (registered / max) * 100;

    return (
      <div class="flex flex-col gap-1">
        <span class="text-sm">
          {registered}/{max}
        </span>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full"
            style={`width: ${percentage}%`}
          ></div>
        </div>
      </div>
    );
  },
});

const ActionCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament1>>,
      required: true,
    },
  },
  setup(props) {
    const data = props.params.data;
    if (!data) return null;

    const viewDetails = () => {
      // Navigate to tournament details
      navigateTo(`/tournaments/${data.id}`);
    };

    const edit = () => {
      alert(`Chỉnh sửa giải đấu: ${data.name}`);
    };

    const remove = () => {
      if (confirm(`Bạn có chắc muốn xóa giải đấu "${data.name}"?`)) {
        alert(`Đã xóa giải đấu: ${data.name}`);
      }
    };

    return { viewDetails, edit, remove };
  },
  render() {
    return (
      <div class="flex gap-2 py-2">
        <button
          class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center gap-1"
          onClick={this.viewDetails}
        >
          <Icon icon="mdi:eye" />
          Xem
        </button>
        <button
          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center gap-1"
          onClick={this.edit}
        >
          <Icon icon="mdi:pencil" />
          Sửa
        </button>
        <button
          class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center gap-1"
          onClick={this.remove}
        >
          <Icon icon="mdi:delete" />
          Xóa
        </button>
      </div>
    );
  },
});

const columnDefs = ref<ColDef<Tournament>[]>([
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
    filterParams: {
      maxNumConditions: 1,
      suppressAndOrCondition: true,
    },
  },
  {
    field: "type",
    headerName: "Loại hình",
    width: 130,
    sortable: false,
    filter: TestFilter,
  },
  {
    field: "format",
    headerName: "Thể thức",
    sortable: false,
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
    filterParams: {
      buttons: ["apply", "reset", "clear"],
      closeOnApply: true,
    },
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleDateString("vi-VN");
    },
  },
  {
    field: "startDate",
    headerName: "Ngày khởi tranh",
    minWidth: 195,
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleDateString("vi-VN");
    },
  },
  {
    field: "registeredPlayers",
    headerName: "Người tham gia",
    width: 150,
    cellRenderer: PlayersCell,
    autoHeight: true,
    filter: false,
    sortable: false,
  },

  {
    field: "totalPrize",
    headerName: "Tổng giải thưởng",
    width: 150,
    cellRenderer: PrizeCell,
    filter: false,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 150,
    cellRenderer: StatusCell,
    filter: StatusSetFilter,
    sortable: false,
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
    autoHeight: true,
    pinned: "right",
  },
]);

const myTheme = themeQuartz.withPart(colorSchemeDarkBlue).withParams({
  headerBackgroundColor: "transparent",
  fontSize: 14,
});

definePageMeta({
  title: "Elite Gamer - Tournament List",
});

const domLayout = ref<DomLayoutType>("normal");

const onGridReady = (params: GridReadyEvent<Tournament1>) => {
  // if (params.api.getDisplayedRowCount() > 0) {e
  // params.columnApi.autoSizeAllColumns();
  // }
  params.api.autoSizeAllColumns();
  params.api.applyColumnState({
    state: [{ colId: "createdAt", sort: "desc" }],
    defaultState: { sort: null },
  });
};

const localeText = {
  equals: "Bằng",
  notEqual: "Không bằng",
  contains: "Chứa",
  notContains: "Không chứa",
  startsWith: "Bắt đầu với",
  endsWith: "Kết thúc với",
  blank: "Trống",
  notBlank: "Không trống",
  filterOoo: "Lọc...",
  applyFilter: "Áp dụng",
  clearFilter: "Xóa lọc",
  andCondition: "Và",
  orCondition: "Hoặc",
  pageSize: "Số bản ghi một trang",
};

function onRowClick(event: RowClickedEvent<Tournament1>) {
  // navigateTo(`tournament/${event.data?.id}`);
}

function mapFieldToSort(field: string): TournamentSortBy {
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

function mapFieldToTournamentFilterBy(field: string): TournamentFilterBy {
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

function mapAgGridOperatorToFilterOperator(type: string): FilterOperator {
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

    default:
      return FilterOperator.FILTER_MATCH_TYPE_UNSPECIFIED;
  }
}

function mapAgGridFilterModelToProtoFilters(
  filterModel: FilterModel,
): Filter[] {
  if (!filterModel) return [];

  return Object.entries(filterModel)
    .map(([field, model]) => {
      const filterBy = mapFieldToTournamentFilterBy(field);
      const operator = mapAgGridOperatorToFilterOperator(model.type);

      return create(FilterSchema, {
        filter: String(model.filter ?? ""),
        filterBy,
        filterOperator: operator,
      });
    })
    .filter(Boolean);
}

const toast = useToast();


const filter = ref<FilterModel>({});

const sort = ref({
  type: TournamentSortBy.CREATED_AT,
  direction: SortOrder.DESC,
});

async function getTournaments() {
  const req = create(GetTournamentsRequestSchema, {
    page: 1,
    limit: 10,
    filters: mapAgGridFilterModelToProtoFilters(filter.value),
    sortBy: sort.value.type,
    sortOrder: sort.value.direction,
  });

  try {
    const res = await tournamentClient.getTournaments({
      request: {
        case: "query",
        value: req,
      },
    });

    console.log("res", res);

    toast.success("Tải dữ liệu thành công!");
    return res.tournaments;
  } catch (error) {
    toast.error(mapRpcErrorMessage(error));
  }
}

const tournamentsQueryKey = computed(() => [
  "tournaments",
  filter.value,
  sort.value,
]);


const queryClient = useQueryClient();

await queryClient.prefetchQuery({
  queryKey: tournamentsQueryKey,
  queryFn: getTournaments,
});

const { data: tournaments, isFetching } = useQuery({
  queryKey: tournamentsQueryKey,
  queryFn: getTournaments,
});

const handleSubmitCreateTournament = async (name: string) => {
  const id = await tournamentClient.createTournament({ name });
  if (id) {
    queryClient.invalidateQueries({ queryKey: ["tournaments"] });
  }
};

function onFilterChange(event: FilterChangedEvent) {
  const filterModel = event.api.getFilterModel();
  console.log("filterModel", filterModel?.type?.values ?? []);
  filter.value = filterModel;
}

function onSortChange(event: SortChangedEvent) {
  const sortInfo = event.api.getColumnState().find((e) => e.sort !== null);
  console.log("sortInfo", sortInfo);

  if (!sortInfo) {
    sort.value = {
      type: TournamentSortBy.CREATED_AT,
      direction: SortOrder.DESC,
    };
    return;
  }

  sort.value = {
    type: mapFieldToSort(sortInfo.colId),
    direction: sortInfo.sort === "asc" ? SortOrder.ASC : SortOrder.DESC,
  };
}

watchEffect(() => {
  console.log("tournaments", tournaments.value);
  console.log("filter1", toRaw(filter.value));
});
</script>

<template>
  <NuxtLayout name="admin">
    <div class="p-6">
      <div class="pb-4 flex justify-between w-full">
        <div class="flex gap-2">
          <DeleteTournament />
          <CreateTournamentButton @submit="handleSubmitCreateTournament" />
        </div>
      </div>

      <AgGridVue
        class="w-full h-[calc(100dvh-273px)]"
        :rowData="tournaments"
        :columnDefs="columnDefs"
        :defaultColDef="{
          filter: true,
          floatingFilter: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          filterParams: {
            maxNumConditions: 1,
            suppressAndOrCondition: true,
            debounceMs: 500,
          },
        }"
        :theme="myTheme"
        :col-resize-default="'shift'"
        :dom-layout="domLayout"
        :localeText="localeText"
        :pagination="true"
        :paginationPageSize="100"
        :row-selection="'multiple'"
        :loading="isFetching"
        @grid-ready="onGridReady"
        @rowClicked="onRowClick"
        @filter-changed="onFilterChange"
        @sort-changed="onSortChange"
      />
    </div>
  </NuxtLayout>
</template>
