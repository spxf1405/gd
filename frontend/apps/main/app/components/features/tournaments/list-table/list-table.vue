<script setup lang="tsx">
import { create } from "@bufbuild/protobuf";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import {
  AllCommunityModule,
  ModuleRegistry,
  colorSchemeDarkBlue,
  themeQuartz,
  type DomLayoutType,
  type FilterChangedEvent,
  type FilterModel,
  type GridReadyEvent,
  type RowClickedEvent,
  type SortChangedEvent
} from "ag-grid-community";
import { AgGridVue } from "ag-grid-vue3";
import { computed, ref, toRaw, watchEffect } from "vue";

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

import { useTournamentColumnDefs } from "./column-defs/column-defs";
import { mapFieldToSort, mapFieldToTournamentFilterBy } from "./utils/utils";

import CreateTournamentButton from "../create-tournament/create-tournament-button.vue";
import DeleteTournament from "../delete-tournament/delete-tournament.vue";
import "./index.css";

ModuleRegistry.registerModules([AllCommunityModule]);

definePageMeta({
  title: "Elite Gamer - Tournament List",
});

const toast = useToast();
const queryClient = useQueryClient();

const columnDefs = useTournamentColumnDefs();
const domLayout = ref<DomLayoutType>("normal");

  const { t } = useI18n()

const localeText = computed(() => ({
  equals: t('agGrid.equals'),
  notEqual: t('agGrid.notEqual'),
  contains: t('agGrid.contains'),
  notContains: t('agGrid.notContains'),
  startsWith: t('agGrid.startsWith'),
  endsWith: t('agGrid.endsWith'),
  blank: t('agGrid.blank'),
  notBlank: t('agGrid.notBlank'),
  filterOoo: t('agGrid.filterOoo'),
  applyFilter: t('agGrid.applyFilter'),
  clearFilter: t('agGrid.clearFilter'),
  andCondition: t('agGrid.andCondition'),
  orCondition: t('agGrid.orCondition'),
  pageSize: t('agGrid.pageSize'),
}))

const myTheme = themeQuartz.withPart(colorSchemeDarkBlue).withParams({
  headerBackgroundColor: "transparent",
  fontSize: 14,
});

const filter = ref<FilterModel>({});

const sort = ref({
  type: TournamentSortBy.CREATED_AT,
  direction: SortOrder.DESC,
});

const tournamentsQueryKey = computed(() => [
  "tournaments",
  filter.value,
  sort.value,
]);

function mapAgGridFilterModelToProtoFilters(
  filterModel: FilterModel,
): Filter[] {
  if (!filterModel) return [];

  return Object.entries(filterModel)
    .map(([field, model]) => {
      const filterBy = mapFieldToTournamentFilterBy(field);
      const operator = mapAgGridOperatorToFilterOperator(model.type);

      if (model.values instanceof Array) {
        if (filterBy === TournamentFilterBy.STATUS) {
          return create(FilterSchema, {
            value: {
              kind: {
                case: "int32List",
                value: { values: model.values },
              },
            },
            filterBy,
            filterOperator: FilterOperator.SET,
          });
        }

        return create(FilterSchema, {
          value: {
            kind: {
              case: "stringList",
              value: { values: model.values },
            },
          },
          filterBy,
          filterOperator: FilterOperator.SET,
        });
      }

      return create(FilterSchema, {
        value: {
          kind: {
            case: "stringValue",
            value: String(model.filter ?? ""),
          },
        },
        filterBy,
        filterOperator: operator,
      });
    })
    .filter(Boolean);
}

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

    toast.success("Tải dữ liệu thành công!");
    return res.tournaments;
  } catch (error) {
    toast.error(mapRpcErrorMessage(error));
  }
}

await queryClient.prefetchQuery({
  queryKey: tournamentsQueryKey,
  queryFn: getTournaments,
});

const { data: tournaments, isFetching } = useQuery({
  queryKey: tournamentsQueryKey,
  queryFn: getTournaments,
  staleTime: 0,
});

const handleSubmitCreateTournament = async (name: string) => {
  const id = await tournamentClient.createTournament({ name });
  if (id) {
    queryClient.invalidateQueries({ queryKey: ["tournaments"] });
  }
};

function onGridReady(params: GridReadyEvent<Tournament>) {
  params.api.autoSizeAllColumns();
  params.api.applyColumnState({
    state: [{ colId: "createdAt", sort: "desc" }],
    defaultState: { sort: null },
  });
}

function onRowClick(_event: RowClickedEvent<Tournament>) {}

function onFilterChange(event: FilterChangedEvent) {
  filter.value = event.api.getFilterModel();
}

function onSortChange(event: SortChangedEvent) {
  const sortInfo = event.api.getColumnState().find((e) => e.sort !== null);

  if (!sortInfo) {
    sort.value = {
      type: TournamentSortBy.CREATED_AT,
      direction: SortOrder.UNSPECIFIED,
    };
    return;
  }

  sort.value = {
    type: mapFieldToSort(sortInfo.colId),
    direction: sortInfo.sort === "asc" ? SortOrder.ASC : SortOrder.DESC,
  };
}

watchEffect(() => {
  console.log("tournaments", toRaw(tournaments.value));
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
        id="tournaments-table"
        class="w-full h-[calc(100dvh-273px)]"
        :grid-options="{
          editType: 'fullRow',
          suppressClickEdit: true //TODO: Bật lên khi hoàn thiện cell editor
        }"
        :rowData="tournaments"
        :columnDefs="columnDefs"
        :defaultColDef="{
          filter: true,
          floatingFilter: true,
          autoHeaderHeight: true,
          wrapHeaderText: true,
          cellClass: '!h-full !flex !items-center !p-2',
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
