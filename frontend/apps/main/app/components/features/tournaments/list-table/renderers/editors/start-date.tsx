import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import type { ICellEditorParams } from "ag-grid-community";
import { defineComponent, ref } from "vue";
import CalendarPicker from "../../../calendar-picker/calendar-picker.vue";

export const StartDateEditor = defineComponent({
  props: {
    params: {
      type: Object as () => ICellEditorParams<Tournament>,
      required: true,
    },
  },

  setup(props) {
    const formatDate = (val: any) => {
      if (!val) return "";
      const d = new Date(val);
      return d.toISOString().slice(0, 10);
    };

    const value = ref<string | null>(
      props.params.value ? formatDate(props.params.value) : null,
    );

    const getValue = () => {
      return value.value ? new Date(value.value).toISOString() : null;
    };

    const onSelect = (val: string | null) => {
      value.value = val;
    };

    const clear = () => {
      value.value = null;
    };

    return {
      value,
      formatDate,
      getValue,
      onSelect,
      clear,
    };
  },

  render() {
    return (
      <CalendarPicker
        modelValue={this.value}
        onUpdate:modelValue={this.onSelect}
        v-slots={{
          trigger: () => (
            <div
              class="flex items-center gap-2 p-2 w-full h-full cursor-pointer rounded-[10px] 
  bg-white/[0.04] border border-white/[0.07] transition-all duration-150 
  hover:bg-white/[0.07] hover:border-white/[0.12]"
            >
              {/* icon */}
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                fill="none"
                class="text-emerald-400 flex-shrink-0"
              >
                <rect
                  x="1"
                  y="3"
                  width="14"
                  height="12"
                  rx="2.5"
                  stroke="currentColor"
                  stroke-width="1.4"
                />
                <path
                  d="M5 1v3M11 1v3M1 7h14"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
              </svg>

              {/* text */}
              <span
                class={[
                  "text-[13px] tracking-[0.01em] flex-1 transition-colors",
                  this.value ? "text-white" : "text-white/40",
                ]}
              >
                {this.value ? this.formatDate(this.value) : "Chọn ngày"}
              </span>

              {/* clear button */}
              {this.value && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    this.clear();
                  }}
                  class="w-[16px] h-[16px] rounded-full flex items-center justify-center 
      bg-white/[0.10] text-white/70 text-[9px] 
      transition-all duration-150 hover:bg-white/[0.22] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          ),
        }}
      />
    );
  },
});
