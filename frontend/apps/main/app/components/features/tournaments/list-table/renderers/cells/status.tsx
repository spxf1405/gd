import type { ICellRendererParams } from "ag-grid-community";
import { StatusMap } from "../../consts/map";
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

  render() {
    const status = this.params.data?.status;

    const defaultStatus = {
      label: "Không xác định",
      color: "bg-gray-100 text-gray-500",
    };

    const statusInfo =
      typeof status === "number"
        ? (StatusMap[status] ?? defaultStatus)
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
