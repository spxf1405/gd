import { TournamentFormat } from "@gd/proto/tournament/v1/tournament_pb";
import type { IFilterParams } from "ag-grid-community";
import { FormatMap } from "../../consts/map";

export const FormatFilter = defineComponent({
  name: "FormatFilter",
  props: {
    params: {
      type: Object as () => IFilterParams,
      required: true,
    },
  },
  setup(props) {
    const selected = ref<string[]>([]);

    function isFilterActive() {
      return selected.value.length > 0;
    }

    function doesFilterPass(node) {
      const field = props.params.colDef.field as string;
      const value = node.data[field];
      return selected.value.length > 0 ? selected.value.includes(value) : true;
    }

    function getModel() {
      return selected.value.length > 0 ? { values: [...selected.value] } : null;
    }

    function setModel(model) {
      selected.value = model?.values || [];
    }

    function getModelAsString(model: any) {
      if (!model || !model.values?.length) return "";
      return model.values.join(", ");
    }

    const toggleValue = (value: string) => {
      if (selected.value.includes(value)) {
        selected.value = selected.value.filter((v) => v !== value);
      } else {
        selected.value.push(value);
      }
      props.params.filterChangedCallback();
    };

    const options = [
      FormatMap[TournamentFormat.TOURNAMENT_TYPE_8_BALL],
      FormatMap[TournamentFormat.TOURNAMENT_TYPE_9_BALL],
      FormatMap[TournamentFormat.TOURNAMENT_TYPE_10_BALL],
    ];

    return {
      selected,
      isFilterActive,
      doesFilterPass,
      getModelAsString,
      getModel,
      setModel,
      toggleValue,
      options,
    };
  },
  render() {
    return (
      <div class="p-2 space-y-2">
        {this.options.map((opt) => (
          <label class="flex items-center space-x-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={this.selected.includes(opt)}
              onChange={() => this.toggleValue(opt)}
              class="accent-accent-blue"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    );
  },
});
