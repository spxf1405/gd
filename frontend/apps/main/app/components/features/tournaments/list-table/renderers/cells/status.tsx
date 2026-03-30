import type { ICellRendererParams } from "ag-grid-community";
import { useTournamentMaps } from "../../consts/map";
import type { TournamentStatus } from "@gd/proto/tournament/v1/tournament_pb";

export const StatusCell = defineComponent({
  name: "StatusCell",
  props: {
    params: {
      type: Object as PropType<
        ICellRendererParams<{ status?: TournamentStatus }>
      >,
      required: true,
    },
  },

  setup() {
    const { t } = useI18n();
    const { StatusMap } = useTournamentMaps();
    return { t, StatusMap };
  },

  render() {
    const status = this.params.data?.status;

    const defaultStatus = {
      label: this.t("tournament.status.unspecified"),
      color: "bg-gray-100 text-gray-500",
    };

    const statusInfo =
      typeof status === "number"
        ? (this.StatusMap[status] ?? defaultStatus)
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
