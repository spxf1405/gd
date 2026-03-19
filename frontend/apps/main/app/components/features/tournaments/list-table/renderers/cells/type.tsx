import type { ICellRendererParams } from "ag-grid-community";
import { TypeMap } from "../../consts/map";
import type { TournamentType } from "@gd/proto/tournament/v1/tournament_pb";

export const TypeCell = defineComponent({
  name: "TypeCell",
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<{ type?: number }>>,
      required: true,
    },
  },

  render() {
    const type = this.params.data?.type;

    console.log("type", type)

    const label =
      typeof type === "number"
        ? (TypeMap[type as TournamentType] ?? "Không xác định")
        : "Không xác định";

    return <span>{label}</span>;
  },
});
