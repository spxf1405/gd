
import dayjs from "dayjs";
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";
import { defineComponent, ref, watch } from "vue";
import CalendarPicker from "../../../calendar-picker/calendar-picker.vue";

const FILTER_OPTIONS = [
  { value: "equals", label: "Bằng" },
  { value: "notEquals", label: "Không Bằng" },
  { value: "inRange", label: "Trong Khoảng" },
];

export const StartDateFilter = defineComponent({
  name: "StartDateFilter",

  props: {
    params: { type: Object, default: null },
  },

  setup(props) {
    const filterType = ref("equals");
    const dateFrom = ref<Date | null>(null);
    const dateTo = ref<Date | null>(null);

    watch(filterType, (val) => {
      if (val !== "inRange") dateTo.value = null;
    });

    function formatDate(d: Date | null) {
      if (!d) return "";
      return dayjs(d).format("DD MMM YYYY");
    }

    // ── AG Grid hooks ──────────────────────────────────────────────────────
    function isFilterActive() {
      return !!dateFrom.value || !!dateTo.value;
    }

    function doesFilterPass({ data }: any) {
      if (!dateFrom.value) return true;

      const val = data[props.params?.colDef?.field];
      if (!val) return false;

      const date = dayjs(val);

      if (filterType.value === "equals")
        return date.isSame(dayjs(dateFrom.value), "day");

      if (filterType.value === "notEquals")
        return !date.isSame(dayjs(dateFrom.value), "day");

      if (filterType.value === "inRange") {
        const from = dateFrom.value ? dayjs(dateFrom.value) : null;
        const to = dateTo.value ? dayjs(dateTo.value) : null;
        if (from && date.isBefore(from, "day")) return false;
        if (to && date.isAfter(to, "day")) return false;
        return true;
      }

      return true;
    }

    function getModel() {
      if (!isFilterActive()) return null;
      return {
        type: filterType.value,
        dateFrom: dateFrom.value,
        dateTo: filterType.value === "inRange" ? dateTo.value : null,
      };
    }

    function setModel(model: any) {
      if (!model) {
        dateFrom.value = null;
        dateTo.value = null;
        filterType.value = "equals";
        return;
      }
      filterType.value = model.type || "equals";
      dateFrom.value = model.dateFrom ? new Date(model.dateFrom) : null;
      dateTo.value =
        model.type === "inRange" && model.dateTo
          ? new Date(model.dateTo)
          : null;
    }

    function onApply() {
      props.params?.filterChangedCallback?.();
      props.params?.api?.hidePopupMenu?.();
    }

    function onClear() {
      setModel(null);
      props.params?.filterChangedCallback?.();
    }

    function onCancel() {
      props.params?.api?.hidePopupMenu?.();
    }

    return {
      filterType,
      dateFrom,
      dateTo,
      formatDate,
      onApply,
      onClear,
      onCancel,
      // AG Grid calls these directly on instance
      isFilterActive,
      doesFilterPass,
      getModel,
      setModel,
    };
  },

  render() {
    // ── Reusable date trigger ──────────────────────────────────────────────
    const DateTrigger = (value: Date | null, onClear: () => void) => (
      <div class="flex items-center gap-2 px-3 py-2 w-full cursor-pointer rounded-[10px] bg-white/[0.04] border border-white/[0.07] transition-all duration-150 hover:bg-white/[0.07] hover:border-white/[0.12]">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" class="text-emerald-400 flex-shrink-0">
          <rect x="1" y="3" width="14" height="12" rx="2.5" stroke="currentColor" stroke-width="1.4" />
          <path d="M5 1v3M11 1v3M1 7h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
        <span class={["text-[13px] tracking-[0.01em] flex-1 transition-colors", value ? "text-white" : "text-white/40"]}>
          {this.formatDate(value) || "Chọn ngày"}
        </span>
        {value && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            class="w-[16px] h-[16px] rounded-full flex items-center justify-center bg-white/[0.10] text-white/70 text-[9px] transition-all duration-150 hover:bg-white/[0.22] hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
    );

    return (
      <div class="flex flex-col gap-0 w-[280px] bg-[#1a1d2e] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04)]">

        {/* ── Filter type select ── */}
        <div class="p-4">
          <SelectRoot
            modelValue={this.filterType}
            onUpdate:modelValue={(v: string) => (this.filterType = v)}
          >
            <SelectTrigger class="w-full flex items-center justify-between px-3 py-2 rounded-[10px] bg-white/[0.05] border border-white/[0.08] text-[13px] text-white transition-all duration-150 outline-none cursor-pointer hover:bg-white/[0.08] hover:border-white/[0.14] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20">
              <SelectValue />
              <SelectIcon class="text-white/30 ml-2">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </SelectIcon>
            </SelectTrigger>

            <SelectPortal>
              <SelectContent
                position="popper"
                sideOffset={6}
                class="z-[9999] ag-custom-component-popup w-[--radix-select-trigger-width] rounded-[12px] overflow-hidden bg-[#1a1d2e] border border-white/[0.10] shadow-[0_16px_40px_rgba(0,0,0,0.6)] animate-[calPopIn_0.18s_cubic-bezier(0.34,1.56,0.64,1)]"
              >
                <SelectViewport class="p-1.5">
                  {FILTER_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      class="flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] cursor-pointer outline-none text-white/70 transition-all duration-100 data-[highlighted]:bg-white/[0.07] data-[highlighted]:text-white data-[state=checked]:text-emerald-400"
                    >
                      <SelectItemIndicator>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </SelectItemIndicator>
                      <SelectItemText>{opt.label}</SelectItemText>
                    </SelectItem>
                  ))}
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </div>

        <div class="mx-3 border-t border-white/[0.06]" />

        {/* ── Date pickers ── */}
        <div class="px-3 py-3 flex flex-col gap-2">
          {this.filterType !== "inRange" ? (
            // Single date
            <CalendarPicker
              modelValue={this.dateFrom}
              
              onUpdate:modelValue={(v: Date | null) => (this.dateFrom = v)}
              v-slots={{ trigger: () => DateTrigger(this.dateFrom, () => (this.dateFrom = null)) }}
            />
          ) : (
            // Range
            <>
              {/* Từ ngày */}
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/30 px-1">Từ ngày</span>
                <CalendarPicker
                  modelValue={this.dateFrom}
                  onUpdate:modelValue={(v: Date | null) => (this.dateFrom = v)}
                  v-slots={{ trigger: () => DateTrigger(this.dateFrom, () => (this.dateFrom = null)) }}
                />
              </div>

              {/* Divider */}
              <div class="flex items-center gap-2 px-1">
                <div class="flex-1 border-t border-white/[0.06]" />
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="text-white/30">
                  <path d="M7 2v10M7 12l-3-3M7 12l3-3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex-1 border-t border-white/[0.06]" />
              </div>

              {/* Đến ngày */}
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-semibold tracking-[0.08em] uppercase text-white/30 px-1">Đến ngày</span>
                <CalendarPicker
                  modelValue={this.dateTo}
                  onUpdate:modelValue={(v: Date | null) => (this.dateTo = v)}
                  v-slots={{ trigger: () => DateTrigger(this.dateTo, () => (this.dateTo = null)) }}
                />
              </div>
            </>
          )}
        </div>

        <div class="mx-3 border-t border-white/[0.06]" />

        {/* ── Footer actions ── */}
        <div class="flex items-center gap-2 px-3 py-3">
          <button
            onClick={this.onApply}
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[12px] font-semibold bg-emerald-500 text-white border border-transparent shadow-[0_2px_12px_rgba(16,185,129,0.35)] transition-all duration-150 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Apply
          </button>

          <button
            onClick={this.onClear}
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[12px] font-semibold bg-white/[0.05] text-white/70 border border-white/[0.08] transition-all duration-150 hover:bg-white/[0.09] hover:text-white hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            Clear
          </button>

          <button
            onClick={this.onCancel}
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[12px] font-semibold bg-white/[0.05] text-white/70 border border-white/[0.08] transition-all duration-150 hover:bg-white/[0.09] hover:text-white hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 9L4.5 6l3-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    );
  },
});