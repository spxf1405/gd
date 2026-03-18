import type { TournamentFormat } from "@gd/proto/tournament/v1/tournament_pb";
import { FormatMap } from "../../consts/map";
import type { ICellRendererParams } from "ag-grid-community";

export const FormatCell = defineComponent({
  name: "FormatCell",
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<{ format?: number }>>,
      required: true,
    },
  },

  render() {
    const format = this.params.data?.format;

    const label =
      typeof format === "number"
        ? (FormatMap[format as TournamentFormat] ?? "Không xác định")
        : "Không xác định";

    return <span>{label}</span>;
  },
});
