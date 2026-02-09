<script setup lang="tsx">
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import {
  SortOrder,
  TournamentFilterBy,
  TournamentSortBy,
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
  type FilterModel,
  type GridReadyEvent,
  type ICellRendererParams,
  type RowClickedEvent
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

const StatusCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament1>>,
      required: true,
    },
  },
  render() {
    const status = this.params.data?.status;
    const colorMap = {
      "Đang đăng ký": "bg-blue-100 text-blue-800",
      "Đang diễn ra": "bg-green-100 text-green-800",
      "Đã kết thúc": "bg-gray-100 text-gray-800",
    };

    return (
      <span
        class={`px-2 py-1 rounded-full text-xs font-semibold ${colorMap[status || "Đã kết thúc"]}`}
      >
        {status}
      </span>
    );
  },
});

const PrizeCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament1>>,
      required: true,
    },
  },
  render() {
    const prize = this.params.data?.totalPrize;
    return (
      <span class="font-semibold text-green-600">
        {prize?.toLocaleString("vi-VN")} đ
      </span>
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
    const registered = this.params.data?.registeredPlayers || 0;
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
    flex: 4,
    minWidth: 400,
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
  },
  {
    field: "format",
    headerName: "Thể thức",
    width: 100,
    sortable: false,
  },
  {
    field: "location",
    headerName: "Địa điểm",
    flex: 1,
    minWidth: 200,
    sortable: false,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    filter: false,
    width: 130,
    valueFormatter: (params) => {
      if (!params.value) return "";
      return new Date(params.value).toLocaleDateString("vi-VN");
    },
  },
  {
    field: "startDate",
    headerName: "Ngày khởi tranh",
    width: 130,
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
    width: 140,
    cellRenderer: StatusCell,
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
    width: 280,
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
  params.api.autoSizeColumns(["actions"]);
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

const toast = useToast();

const filter = ref<FilterModel>({});

async function getTournaments() {
  console.log("filter.value.name?.filterType", filter.value.name?.filterType);

  try {
    const res = await tournamentClient.getTournaments({
      request: {
        case: "filter",
        value: {
          page: 1,
          limit: 10,
          filterBy: TournamentFilterBy.NAME,
          filter: filter.value.name?.filter ?? "",
          filterOperator: toFilterOperator(filter.value.name?.type),
          sortBy: TournamentSortBy.CREATED_AT,
          sortOrder: SortOrder.ASC,
        },
      },
    });

    console.log("res", res);

    toast.success("Tải dữ liệu thành công!");
    return res.tournaments;
  } catch (error) {
    toast.error(mapRpcErrorMessage(error));
  }
}

const tournamentsQueryKey = computed(() => {
  console.log("filterModel", filter.value.name);
  return [
    "tournaments",
    filter.value.name?.filter ?? "",
    filter.value.name?.type ?? "",
  ];
});

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

function onFilterChange(event) {
  const filterModel = event.api.getFilterModel();
  filter.value = filterModel;
}

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
      />
    </div>
  </NuxtLayout>
</template>
