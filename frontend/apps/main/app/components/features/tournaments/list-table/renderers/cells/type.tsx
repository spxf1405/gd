import type { ICellRendererParams } from "ag-grid-community";
import { useTournamentMaps } from "../../consts/map";
import type { TournamentType } from "@gd/proto/tournament/v1/tournament_pb";

export const TypeCell = defineComponent({
  name: "TypeCell",
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<{ type?: number }>>,
      required: true,
    },
  },

  setup() {
    const { t } = useI18n();
    const { TypeMap } = useTournamentMaps();
    return { t, TypeMap };
  },

  render() {
    const type = this.params.data?.type;

    const label =
      typeof type === "number"
        ? (this.TypeMap[type as TournamentType] ??
          this.t("tournament.format.unknown"))
        : this.t("tournament.format.unknown");

    return <span>{label}</span>;
  },
});
