<template>
  <div>
    <PopoverRoot v-model:open="open" @update:open="onOpenChange">
      <!-- ── Trigger: slot or default ── -->
      <PopoverTrigger as-child>
        <slot name="trigger">
          <!-- Default trigger -->
          <div
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer bg-white/[0.05] border border-white/[0.09] transition-all duration-150 hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-lg hover:shadow-black/30"
          >
            <svg
              width="14"
              height="14"
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
            <span
              :class="[
                'text-[13px] tracking-[0.01em] transition-colors',
                modelValue ? 'text-white' : 'text-[#4a5568]',
              ]"
            >
              {{ label }}
            </span>
            <button
              v-if="modelValue"
              @click.stop="emit('update:modelValue', null)"
              class="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 bg-white/[0.10] text-[#9aa4b4] text-[10px] transition-all duration-150 hover:bg-white/[0.22] hover:text-white hover:scale-110"
            >
              ✕
            </button>
          </div>
        </slot>
      </PopoverTrigger>

      <PopoverContent
        :side-offset="8"
        align="start"
        class="cal-pop-in z-[999] w-[280px] rounded-[16px] p-4 bg-[#1a1d2e] border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04)] outline-none"
      >
        <!-- ── Header ── -->
        <div class="flex items-center justify-between mb-3">
          <template v-if="pickerMode === 'day'">
            <button
              @click="navigate(-1)"
              class="w-[28px] h-[28px] rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/[0.08] text-[#9aa4b4] transition-all duration-150 hover:bg-white/[0.10] hover:text-white hover:scale-105 active:scale-95"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M7.5 9L4.5 6l3-3"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <div class="flex gap-1">
              <button
                @click="pickerMode = 'month'"
                class="flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] font-semibold text-white border border-transparent transition-all duration-150 hover:bg-white/[0.07] hover:border-white/[0.10]"
              >
                {{ MONTHS[viewMonth] }}
                <span class="text-[10px] text-[#5a6475]">▾</span>
              </button>
              <button
                @click="pickerMode = 'year'"
                class="flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] font-semibold text-white border border-transparent transition-all duration-150 hover:bg-white/[0.07] hover:border-white/[0.10]"
              >
                {{ viewYear }} <span class="text-[10px] text-[#5a6475]">▾</span>
              </button>
            </div>
            <button
              @click="navigate(1)"
              class="w-[28px] h-[28px] rounded-lg flex items-center justify-center bg-white/[0.05] border border-white/[0.08] text-[#9aa4b4] transition-all duration-150 hover:bg-white/[0.10] hover:text-white hover:scale-105 active:scale-95"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M4.5 3L7.5 6l-3 3"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </template>
          <template v-else>
            <div class="flex items-center justify-between w-full">
              <button
                @click="pickerMode = 'day'"
                class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[12px] font-medium text-[#9aa4b4] border border-transparent transition-all duration-150 hover:bg-white/[0.07] hover:text-white hover:border-white/[0.10]"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M7.5 9L4.5 6l3-3"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Back
              </button>
              <span
                class="text-[11px] font-bold tracking-[0.12em] uppercase text-[#5a6475]"
              >
                {{ pickerMode === "month" ? "Month" : "Year" }}
              </span>
            </div>
          </template>
        </div>

        <!-- ── Day Grid ── -->
        <template v-if="pickerMode === 'day'">
          <div class="grid grid-cols-7 mb-1">
            <div
              v-for="wd in WEEKDAYS"
              :key="wd"
              class="text-center text-[10px] font-semibold tracking-[0.06em] text-[#5a6475] py-0.5"
            >
              {{ wd }}
            </div>
          </div>
          <div :key="animKey" :class="['grid grid-cols-7 gap-0.5', animClass]">
            <button
              v-for="(day, i) in visibleDays"
              :key="i"
              @click="selectDate(day)"
              :class="[
                'h-8 rounded-lg flex items-center justify-center text-[12px]',
                'border border-transparent transition-all duration-[120ms] outline-none active:scale-95',
                getDayClass(day),
              ]"
            >
              {{ day.d }}
            </button>
          </div>
        </template>

        <!-- ── Month Picker ── -->
        <div
          v-if="pickerMode === 'month'"
          class="cal-pop-in grid grid-cols-3 gap-1.5"
        >
          <button
            v-for="(m, i) in MONTHS"
            :key="m"
            @click="selectMonth(i)"
            :class="[
              'py-2 rounded-[10px] text-[13px] border transition-all duration-[120ms] hover:scale-105 active:scale-95',
              viewMonth === i
                ? 'bg-emerald-500 text-white border-transparent shadow-[0_2px_10px_rgba(16,185,129,0.4)]'
                : today.getMonth() === i && today.getFullYear() === viewYear
                  ? 'border-emerald-500/35 text-emerald-400 bg-transparent hover:bg-white/[0.07] hover:text-white'
                  : 'border-transparent text-[#9aa4b4] hover:bg-white/[0.07] hover:text-white',
            ]"
          >
            {{ m }}
          </button>
        </div>

        <!-- ── Year Picker ── -->
        <div
          v-if="pickerMode === 'year'"
          ref="yearListRef"
          class="cal-pop-in cal-scroll flex flex-col gap-0.5 max-h-[190px] overflow-y-auto pr-1"
          style="
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
          "
        >
          <button
            v-for="y in YEARS"
            :key="y"
            :data-active="viewYear === y"
            @click="selectYear(y)"
            :class="[
              'py-1.5 px-3 rounded-[10px] text-[13px] text-center border transition-all duration-[120ms] active:scale-[0.97]',
              viewYear === y
                ? 'bg-emerald-500 text-white border-transparent shadow-[0_2px_10px_rgba(16,185,129,0.35)] hover:bg-emerald-400'
                : today.getFullYear() === y
                  ? 'border-emerald-500/35 text-emerald-400 hover:bg-white/[0.07] hover:text-white'
                  : 'border-transparent text-[#9aa4b4] hover:bg-white/[0.07] hover:text-white',
            ]"
          >
            {{ y }}
          </button>
        </div>

        <!-- ── Footer ── -->
        <div
          class="flex justify-between mt-3 pt-2.5 border-t border-white/[0.06]"
        >
          <button
            @click="goToday"
            class="text-[11px] text-[#5a6475] px-2 py-1 rounded-md transition-all duration-150 hover:bg-white/[0.07] hover:text-white"
          >
            Today
          </button>
          <button
            @click="clearAndClose"
            class="text-[11px] text-[#5a6475] px-2 py-1 rounded-md transition-all duration-150 hover:bg-white/[0.07] hover:text-white"
          >
            Clear
          </button>
        </div>
      </PopoverContent>
    </PopoverRoot>
  </div>
</template>

<script setup>
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger
} from "radix-vue";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import './calendar-picker.css'

// ── Props & Emits ──────────────────────────────────────────────────────────
const props = defineProps({
  modelValue: { type: Date, default: null },
});
const emit = defineEmits(["update:modelValue", "select"]);

// ── Constants ──────────────────────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const YEARS = Array.from(
  { length: 20 },
  (_, i) => new Date().getFullYear() - 5 + i,
);
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];


// ── State ──────────────────────────────────────────────────────────────────
const today = new Date();
const open = ref(false);
const pickerMode = ref("day");
const animDir = ref(null);
const animKey = ref(0);
const yearListRef = ref(null);
const viewYear = ref(today.getFullYear());
const viewMonth = ref(today.getMonth());

// ── Computed ───────────────────────────────────────────────────────────────
const label = computed(() => {
  if (!props.modelValue) return "Chọn ngày";
  const d = props.modelValue;
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
});

const animClass = computed(() => {
  if (animDir.value === "right") return "slide-right";
  if (animDir.value === "left") return "slide-left";
  return "";
});

const visibleDays = computed(() => {
  const firstDow = new Date(viewYear.value, viewMonth.value, 1).getDay();
  const daysInMonth = new Date(
    viewYear.value,
    viewMonth.value + 1,
    0,
  ).getDate();
  const prevDays = new Date(viewYear.value, viewMonth.value, 0).getDate();
  const days = [];
  for (let i = firstDow - 1; i >= 0; i--) {
    const m = viewMonth.value === 0 ? 11 : viewMonth.value - 1;
    const y = viewMonth.value === 0 ? viewYear.value - 1 : viewYear.value;
    days.push({ y, m, d: prevDays - i, inMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ y: viewYear.value, m: viewMonth.value, d: i, inMonth: true });
  }
  let next = 1;
  while (days.length % 7 !== 0) {
    const m = viewMonth.value === 11 ? 0 : viewMonth.value + 1;
    const y = viewMonth.value === 11 ? viewYear.value + 1 : viewYear.value;
    days.push({ y, m, d: next++, inMonth: false });
  }
  return days;
});

// ── Methods ────────────────────────────────────────────────────────────────
function onOpenChange(v) {
  if (!v) pickerMode.value = "day";
}

function navigate(dir) {
  animDir.value = dir === 1 ? "right" : "left";
  animKey.value++;
  let m = viewMonth.value + dir,
    y = viewYear.value;
  if (m > 11) {
    m = 0;
    y++;
  }
  if (m < 0) {
    m = 11;
    y--;
  }
  viewMonth.value = m;
  viewYear.value = y;
}

function selectDate(day) {
  const date = new Date(day.y, day.m, day.d);
  emit("update:modelValue", date);
  emit("select", { date });
  setTimeout(() => {
    open.value = false;
  }, 120);
}

function selectMonth(i) {
  viewMonth.value = i;
  pickerMode.value = "day";
}
function selectYear(y) {
  viewYear.value = y;
  pickerMode.value = "day";
}
function goToday() {
  viewYear.value = today.getFullYear();
  viewMonth.value = today.getMonth();
}

function clearAndClose() {
  emit("update:modelValue", null);
  emit("select", { date: null });
}

function getDayClass(day) {
  const v = props.modelValue;
  const isSel =
    v &&
    v.getFullYear() === day.y &&
    v.getMonth() === day.m &&
    v.getDate() === day.d;
  const isToday =
    today.getFullYear() === day.y &&
    today.getMonth() === day.m &&
    today.getDate() === day.d;
  if (isSel)
    return "bg-emerald-500 text-white shadow-[0_2px_12px_rgba(16,185,129,0.45)] hover:bg-emerald-400 hover:scale-105 z-10";
  if (isToday)
    return "border-emerald-500/40 text-emerald-400 hover:bg-white/[0.07] hover:text-white hover:scale-110";
  if (!day.inMonth)
    return "text-white/[0.15] hover:bg-white/[0.04] hover:text-white/40";
  return "text-[#9aa4b4] hover:bg-white/[0.07] hover:text-white hover:scale-110";
}

function onKeydown(e) {
  if (!open.value) return;
  if (e.key === "ArrowRight") navigate(1);
  if (e.key === "ArrowLeft") navigate(-1);
}

watch(pickerMode, (mode) => {
  if (mode === "year") {
    nextTick(() => {
      yearListRef.value
        ?.querySelector('[data-active="true"]')
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }
});

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));
</script>
