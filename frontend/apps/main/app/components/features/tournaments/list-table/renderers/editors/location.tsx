import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import type { ICellEditorParams } from "ag-grid-community";
import { defineComponent, ref, onMounted } from "vue";

export const LocationEditor = defineComponent({
  props: {
    params: {
      type: Object as () => ICellEditorParams<Tournament>,
      required: true,
    },
  },

  setup(props) {
    const value = ref<string>(props.params.value ?? "");
    const inputRef = ref<HTMLInputElement | null>(null);

    const getValue = () => value.value;

    const clear = () => {
      value.value = "";
      inputRef.value?.focus();
    };

    onMounted(() => {
      setTimeout(() => {
        inputRef.value?.focus();
        inputRef.value?.select();
      }, 0);
    });

    return { value, inputRef, getValue, clear };
  },

  render() {
    return (
      <div
        class="flex items-center gap-2 p-2 w-full h-full rounded-[10px]
        bg-white/[0.04] border border-white/[0.07]
        focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20
        transition-all duration-150"
      >
        {/* icon */}
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          class="text-emerald-400 flex-shrink-0"
        >
          <path
            d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5Z"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linejoin="round"
          />
          <circle cx="8" cy="6" r="1.5" stroke="currentColor" stroke-width="1.4" />
        </svg>

        {/* input */}
        <input
          ref={this.inputRef}
          type="text"
          value={this.value}
          onInput={(e) => (this.value = (e.target as HTMLInputElement).value)}
          onKeydown={(e) => {
            if (e.key === "Enter") this.params.stopEditing();
            if (e.key === "Escape") {
              this.value = this.params.value ?? "";
              this.params.stopEditing();
            }
          }}
          placeholder="Nhập địa điểm..."
          class="flex-1 bg-transparent outline-none border-none text-[13px] tracking-[0.01em]
          text-white placeholder:text-white/40 min-w-0"
        />

        {/* clear button */}
        {this.value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              this.clear();
            }}
            class="w-[16px] h-[16px] rounded-full flex items-center justify-center flex-shrink-0
            bg-white/[0.10] text-white/70 text-[9px]
            transition-all duration-150 hover:bg-white/[0.22] hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
    );
  },
});