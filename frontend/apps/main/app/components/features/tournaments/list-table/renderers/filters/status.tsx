import type { TournamentStatus } from "@gd/proto/tournament/v1/tournament_pb";
import type { IFilterParams } from "ag-grid-community";
import { StatusMap } from "../../consts/map";

export const StatusFilter = defineComponent({
  name: "StatusFilter",

  props: {
    params: {
      type: Object as PropType<IFilterParams>,
      required: true,
    },
  },

  setup(props) {
    const selected = ref<number[]>([]);

    const options = Object.entries(StatusMap).map(([key, value]) => ({
      value: Number(key),
      ...value,
    }));

    function isFilterActive() {
      return selected.value.length > 0;
    }

    function doesFilterPass(node: any) {
      const field = props.params.colDef.field as string;
      const value = node.data?.[field];

      if (!selected.value.length) return true;

      return selected.value.includes(value);
    }

    function getModel() {
      return selected.value.length ? { values: [...selected.value] } : null;
    }

    function setModel(model: any) {
      selected.value = model?.values ?? [];
    }

    function getModelAsString(model: any) {
      if (!model || !model.values?.length) return "";

      return model.values
        .map((val: TournamentStatus) => StatusMap[val]?.label || val)
        .join(", ");
    }

    function toggleValue(value: number) {
      if (selected.value.includes(value)) {
        selected.value = selected.value.filter((v) => v !== value);
      } else {
        selected.value.push(value);
      }

      props.params.filterChangedCallback();
    }

    return {
      selected,
      options,
      toggleValue,
      isFilterActive,
      doesFilterPass,
      getModel,
      setModel,
      getModelAsString,
    };
  },

  render() {
    return (
      <div class="p-3 space-y-2 min-w-[220px]">
        {this.options.map((opt) => (
          <label key={opt.value} class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={this.selected.includes(opt.value)}
              onChange={() => this.toggleValue(opt.value)}
              class="accent-blue-500"
            />

            <div
              class={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${opt.color}`}
            >
              <span class="w-2 h-2 rounded-full bg-current opacity-70"></span>
              <span>{opt.label}</span>
            </div>
          </label>
        ))}
      </div>
    );
  },
});
