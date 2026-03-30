import type { TournamentFormat } from "@gd/proto/tournament/v1/tournament_pb";
import { useTournamentMaps } from "../../consts/map";
import type { ICellRendererParams } from "ag-grid-community";

export const FormatCell = defineComponent({
  name: "FormatCell",
  
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<{ format?: number }>>,
      required: true,
    },
  },

  setup() {
    const { t } = useI18n();
    const { FormatMap } = useTournamentMaps();
    return { t, FormatMap };
  },

  render() {
    const format = this.params.data?.format;

    const label =
      typeof format === "number"
        ? (this.FormatMap[format as TournamentFormat] ??
          this.t("tournament.format.unknown"))
        : this.t("tournament.format.unknown");

    return <span>{label}</span>;
  },
});
