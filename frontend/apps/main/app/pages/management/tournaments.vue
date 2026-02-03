<script setup lang="tsx">
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { TournamentSortBy } from "@gd/proto/tournament/v1/tournament_service_pb";
import { SortOrder } from "@gd/proto/tournament/v1/tournament_service_pb";
import { TournamentFilterBy } from "@gd/proto/tournament/v1/tournament_service_pb";
import { Icon } from "@iconify/vue";
import {
  AllCommunityModule,
  colorSchemeDarkBlue,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type DomLayoutType,
  type GridReadyEvent,
  type ICellRendererParams,
  type RowClickedEvent,
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

const tournaments = ref<Tournament1[]>([
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
  {
    id: "T002",
    name: "Giải 9-Ball Open Sài Gòn",
    type: "9-Ball",
    format: "Đơn",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    location: "Arena Billard, TP.HCM",
    tables: 16,
    totalPrize: 100000000,
    entryFee: 800000,
    maxPlayers: 128,
    registeredPlayers: 128,
    status: "Đang diễn ra",
    organizer: "Arena Billard Club",
  },
  {
    id: "T003",
    name: "Giải Carom 3 băng miền Bắc",
    type: "Carom 3-băng",
    format: "Đơn",
    startDate: "2026-01-10",
    endDate: "2026-01-15",
    location: "Trung tâm Billard Việt Nam",
    tables: 8,
    totalPrize: 30000000,
    entryFee: 300000,
    maxPlayers: 32,
    registeredPlayers: 32,
    status: "Đã kết thúc",
    organizer: "Liên đoàn Billard VN",
  },
  {
    id: "T004",
    name: "Giải 10-Ball Challenge Cup",
    type: "10-Ball",
    format: "Đơn",
    startDate: "2026-04-10",
    endDate: "2026-04-14",
    location: "Premium Billard, Đà Nẵng",
    tables: 10,
    totalPrize: 75000000,
    entryFee: 600000,
    maxPlayers: 64,
    registeredPlayers: 28,
    status: "Đang đăng ký",
    organizer: "Premium Billard Club",
  },
  {
    id: "T005",
    name: "Giải Đồng đội 8-Ball",
    type: "8-Ball",
    format: "Đồng đội",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    location: "Mega Billard Center, Hà Nội",
    tables: 20,
    totalPrize: 120000000,
    entryFee: 2000000,
    maxPlayers: 16,
    registeredPlayers: 12,
    status: "Đang đăng ký",
    organizer: "Mega Billard Center",
  },
  {
    id: "T006",
    name: "Giải Snooker Quốc gia",
    type: "Snooker",
    format: "Đơn",
    startDate: "2026-06-15",
    endDate: "2026-06-25",
    location: "Nhà thi đấu Quốc gia, Hà Nội",
    tables: 12,
    totalPrize: 200000000,
    entryFee: 1000000,
    maxPlayers: 32,
    registeredPlayers: 18,
    status: "Đang đăng ký",
    organizer: "Liên đoàn Billard VN",
  },
  {
    id: "T007",
    name: "Giải 9-Ball Cúp Mùa Xuân",
    type: "9-Ball",
    format: "Đơn",
    startDate: "2026-02-01",
    endDate: "2026-02-03",
    location: "Star Billard, Hải Phòng",
    tables: 8,
    totalPrize: 25000000,
    entryFee: 250000,
    maxPlayers: 32,
    registeredPlayers: 32,
    status: "Đã kết thúc",
    organizer: "Star Billard Club",
  },
  {
    id: "T008",
    name: "Giải 8-Ball Nữ Việt Nam",
    type: "8-Ball",
    format: "Đơn",
    startDate: "2026-03-20",
    endDate: "2026-03-23",
    location: "Lady Billard, TP.HCM",
    tables: 6,
    totalPrize: 40000000,
    entryFee: 400000,
    maxPlayers: 32,
    registeredPlayers: 24,
    status: "Đang diễn ra",
    organizer: "Lady Billard Club",
  },

  // ===== thêm data =====

  {
    id: "T009",
    name: "Giải 10-Ball Open Miền Trung",
    type: "10-Ball",
    format: "Đơn",
    startDate: "2026-07-05",
    endDate: "2026-07-09",
    location: "Central Billard, Huế",
    tables: 8,
    totalPrize: 45000000,
    entryFee: 450000,
    maxPlayers: 48,
    registeredPlayers: 30,
    status: "Đang đăng ký",
    organizer: "Central Billard Club",
  },
  {
    id: "T010",
    name: "Giải Carom 3-Băng TP.HCM Mở Rộng",
    type: "Carom 3-băng",
    format: "Đơn",
    startDate: "2026-08-01",
    endDate: "2026-08-06",
    location: "Saigon Carom Arena",
    tables: 10,
    totalPrize: 90000000,
    entryFee: 700000,
    maxPlayers: 64,
    registeredPlayers: 41,
    status: "Đang đăng ký",
    organizer: "Saigon Carom Club",
  },
  {
    id: "T011",
    name: "Giải 8-Ball Sinh Viên Toàn Quốc",
    type: "8-Ball",
    format: "Đơn",
    startDate: "2026-09-10",
    endDate: "2026-09-15",
    location: "ĐH Thể Dục Thể Thao Bắc Ninh",
    tables: 14,
    totalPrize: 20000000,
    entryFee: 200000,
    maxPlayers: 128,
    registeredPlayers: 86,
    status: "Đang đăng ký",
    organizer: "Hội Sinh Viên VN",
  },
  {
    id: "T012",
    name: "Giải 9-Ball Doanh Nghiệp Hà Nội",
    type: "9-Ball",
    format: "Đồng đội",
    startDate: "2026-10-02",
    endDate: "2026-10-06",
    location: "Business Billard Club, Hà Nội",
    tables: 12,
    totalPrize: 60000000,
    entryFee: 3000000,
    maxPlayers: 16,
    registeredPlayers: 10,
    status: "Đang đăng ký",
    organizer: "Business Billard Association",
  },
  {
    id: "T013",
    name: "Giải Snooker Trẻ Quốc Gia",
    type: "Snooker",
    format: "Đơn",
    startDate: "2026-11-01",
    endDate: "2026-11-07",
    location: "Học viện Billard VN",
    tables: 6,
    totalPrize: 35000000,
    entryFee: 300000,
    maxPlayers: 24,
    registeredPlayers: 19,
    status: "Đang đăng ký",
    organizer: "Liên đoàn Billard VN",
  },
  {
    id: "T014",
    name: "Giải 8-Ball Masters Invitational",
    type: "8-Ball",
    format: "Đơn",
    startDate: "2026-12-05",
    endDate: "2026-12-08",
    location: "Elite Billard Lounge, TP.HCM",
    tables: 6,
    totalPrize: 150000000,
    entryFee: 1500000,
    maxPlayers: 16,
    registeredPlayers: 16,
    status: "Đang diễn ra",
    organizer: "Elite Billard Group",
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
  if (tournaments.value.length > 10) {
    domLayout.value = "normal";
  }
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
  navigateTo(`tournament/${event.data?.id}`);
}

const tournaments1 = ref<Tournament[]>([]);

async function getTournaments() {
  try {
    // const res = await tournamentClient.getTournaments({
    //   request: {
    //     case: "empty",
    //     value: {},
    //   },
    // });

    const res = await tournamentClient.getTournaments({
      request: {
        case: "filter",
        value: {
          page: 1,
          limit: 10,
          filterBy: TournamentFilterBy.NAME,
          filter: "Ha Noi",
          sortBy: TournamentSortBy.NAME,
          sortOrder: SortOrder.ASC
        },
      },
    });

    
    console.log("res1", res)

    return res.tournaments;
  } catch (error) {
    console.log("res", error);
  }
}

const { data: tournamentData } = await useAsyncData(
  "tournaments",
  getTournaments,
);

watchEffect(() => {
  if (tournamentData.value) {
    tournaments1.value = tournamentData.value;
  }
});

const handleSubmitCreateTournament = async (name: string) => {
  const id = await tournamentClient.createTournament({ name });
  if (id) {
    console.log("id", id);
    toastRef.value = true;
  }
};

function onFilterChange(event) {
  // event contains the grid state
  console.log("Filter changed:", event);

  // If you want the current filter model:
  const filterModel = event.api.getFilterModel();
  console.log("Current filter model:", filterModel);
}

const toastRef = ref(false);

onMounted(() => {
  getTournaments();
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
        :rowData="tournaments1"
        :columnDefs="columnDefs"
        :defaultColDef="{ filter: true, floatingFilter: true }"
        :theme="myTheme"
        :col-resize-default="'shift'"
        :dom-layout="domLayout"
        :localeText="localeText"
        :pagination="true"
        :paginationPageSize="100"
        :row-selection="'multiple'"
        @grid-ready="onGridReady"
        @rowClicked="onRowClick"
        @filter-changed="onFilterChange"
      />
      <ToastProvider>
        <ToastRoot
          v-model:open="toastRef"
          class="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        >
          <ToastTitle
            class="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]"
          >
            Scheduled: Catch up
          </ToastTitle>
          <ToastDescription as-child> Test </ToastDescription>
          <ToastAction
            class="[grid-area:_action]"
            as-child
            alt-text="Goto schedule to undo"
          >
            <button
              class="inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] bg-green2 text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8"
            >
              Undo
            </button>
          </ToastAction>
        </ToastRoot>
        <ToastViewport
          class="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none"
        />
      </ToastProvider>
    </div>
  </NuxtLayout>
</template>
