import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { TournamentStatus } from "@gd/proto/tournament/v1/tournament_pb";
import type { ICellEditorParams } from "ag-grid-community";
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
import { defineComponent, ref } from "vue";
import { StatusMap } from "../../consts/map";

// ── Transition rules ───────────────────────────────────────────────────────
const StatusTransitions: Partial<Record<TournamentStatus, TournamentStatus[]>> =
  {
    [TournamentStatus.UNSPECIFIED]: [
      TournamentStatus.REGISTERING,
      TournamentStatus.CANCELLED,
    ],
    [TournamentStatus.REGISTERING]: [
      TournamentStatus.REGISTRATION_CLOSED,
      TournamentStatus.STARTED,
      TournamentStatus.CANCELLED,
    ],
    [TournamentStatus.REGISTRATION_CLOSED]: [
      TournamentStatus.REGISTERING,
      TournamentStatus.STARTED,
      TournamentStatus.CANCELLED,
    ],
    [TournamentStatus.STARTED]: [
      TournamentStatus.RUNNING,
      TournamentStatus.CANCELLED,
    ],
    [TournamentStatus.RUNNING]: [
      TournamentStatus.FINISHED,
      TournamentStatus.CANCELLED,
    ],
    // FINISHED & CANCELLED — không thể chuyển tiếp
    [TournamentStatus.FINISHED]: [],
    [TournamentStatus.CANCELLED]: [],
  };

export const StatusEditor = defineComponent({
  props: {
    params: {
      type: Object as () => ICellEditorParams<Tournament>,
      required: true,
    },
  },

  setup(props) {
    const currentStatus = (props.params.value ??
      TournamentStatus.UNSPECIFIED) as TournamentStatus;
    const value = ref(String(currentStatus));
    const open = ref(false);

    // Chỉ lấy các status được phép chuyển từ status hiện tại
    const allowedStatuses = StatusTransitions[currentStatus] ?? [];
    const options = allowedStatuses.map((s) => ({
      value: String(s),
      label: StatusMap[s]?.label ?? String(s),
    }));

    const getValue = () => Number(value.value);

    const onChange = (val: string) => {
      value.value = val;
    };

    return { value, open, options, getValue, onChange };
  },

  render() {
    const currentStatus = Number(this.params.value) as TournamentStatus;
    const currentInfo = StatusMap[currentStatus];

    // Nếu không có options (FINISHED / CANCELLED), không cho edit
    if (this.options.length === 0) {
      return (
        <div class="w-full h-full flex items-center px-3">
          <span
            class={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${currentInfo?.color ?? ""}`}
          >
            <span class="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {currentInfo?.label ?? "—"}
          </span>
        </div>
      );
    }

    return (
      <SelectRoot
        modelValue={this.value}
        open={this.open}
        onUpdate:modelValue={this.onChange}
        onUpdate:open={(v: boolean) => (this.open = v)}
      >
        <SelectTrigger
          class="w-full h-full flex items-center justify-between p-4 rounded-[8px] 
          bg-white/[0.05] border border-white/[0.08] text-[13px] text-white 
          transition-all duration-150 outline-none cursor-pointer
          hover:bg-white/[0.08] hover:border-white/[0.14]
          focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
        >
          {currentInfo ? (
            currentInfo.label
          ) : (
            <span class="text-white/40">Chọn trạng thái...</span>
          )}
          <SelectIcon class="text-white/30 ml-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 4l4 4 4-4"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </SelectIcon>
        </SelectTrigger>

        {/* Dropdown */}
        <SelectPortal>
          <SelectContent
            position="popper"
            sideOffset={6}
            class="z-[9999] w-[--radix-select-trigger-width] rounded-[12px] overflow-hidden
            bg-[#1a1d2e] border border-white/[0.10]
            shadow-[0_16px_40px_rgba(0,0,0,0.6)]
            animate-[calPopIn_0.18s_cubic-bezier(0.34,1.56,0.64,1)]"
          >
            <SelectViewport class="p-1.5">
              {this.options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  class="flex items-center gap-2.5 px-3 py-2 rounded-[8px]
                  text-[13px] cursor-pointer outline-none text-white/70
                  transition-all duration-100
                  data-[highlighted]:bg-white/[0.07] data-[highlighted]:text-white
                  data-[state=checked]:text-emerald-400"
                >
                  <SelectItemIndicator>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </SelectItemIndicator>
                  <SelectItemText>{opt.label}</SelectItemText>
                </SelectItem>
              ))}
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    );
  },
});
