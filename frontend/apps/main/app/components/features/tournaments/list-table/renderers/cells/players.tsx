import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import type { ICellRendererParams } from "ag-grid-community";

export const PlayersCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament>>,
      required: true,
    },
  },
  render() {
    const registered = this.params.data?.registeredPlayers.length || 0;

    const max = this.params.data?.maxPlayers || 0;
    const percentage = (registered / max) * 100;

    return (
      <div class="flex flex-col gap-1 w-full">
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
