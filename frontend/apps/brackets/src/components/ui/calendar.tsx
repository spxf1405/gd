import dayjs, { Dayjs } from "dayjs";
import { Popover } from "radix-ui";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

const ANIM_STYLE = `
  @keyframes calPopIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0);    }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0);     }
  }
  .cal-pop-in   { animation: calPopIn     0.22s cubic-bezier(0.34,1.56,0.64,1); }
  .slide-right  { animation: slideInRight 0.2s ease; }
  .slide-left   { animation: slideInLeft  0.2s ease; }
  .cal-scroll::-webkit-scrollbar       { width: 3px; }
  .cal-scroll::-webkit-scrollbar-track { background: transparent; }
  .cal-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
`;

type PickerMode = "day" | "month" | "year";
type AnimDir = "right" | "left" | null;

const YEARS = Array.from({ length: 20 }, (_, i) => dayjs().year() - 5 + i);

interface CalendarPickerProps {
  iconClassName?: string;
}

export function CalendarPicker({ iconClassName }: CalendarPickerProps) {
  const { t } = useTranslation();

  const MONTHS: string[] = t("calendar.months", { returnObjects: true }) as string[];
  const WEEKDAYS: string[] = t("calendar.weekdays", { returnObjects: true }) as string[];

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Dayjs>(dayjs());
  const [selected, setSelected] = useState<Dayjs | null>(null);
  const [pickerMode, setMode] = useState<PickerMode>("day");
  const [animDir, setAnimDir] = useState<AnimDir>(null);
  const [animKey, setAnimKey] = useState(0);
  const yearListRef = useRef<HTMLDivElement>(null);

  const startOfMonth = current.startOf("month").startOf("week");
  const endOfMonth = current.endOf("month").endOf("week");
  const days: Dayjs[] = [];
  let d = startOfMonth;
  while (d.isBefore(endOfMonth)) {
    days.push(d);
    d = d.add(1, "day");
  }

  const selectDate = (day: Dayjs) => {
    setSelected(day);
    setTimeout(() => setOpen(false), 120);
  };

  const navigate = (dir: 1 | -1) => {
    setAnimDir(dir === 1 ? "right" : "left");
    setAnimKey((k) => k + 1);
    setCurrent((c) => c.add(dir, "month"));
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (pickerMode === "year" && yearListRef.current) {
      yearListRef.current
        .querySelector("[data-active='true']")
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [pickerMode]);

  const label = selected
    ? selected.format("DD MMM YYYY")
    : t("calendar.selectDate");

  return (
    <>
      <style>{ANIM_STYLE}</style>

      <Popover.Root
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setMode("day");
        }}
      >
        <Popover.Trigger asChild>
          <div
            className="
              inline-flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer
              bg-white/[0.05] border border-white/[0.09]
              transition-all duration-150
              hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-lg hover:shadow-black/30
            "
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className={twMerge("text-emerald-400", iconClassName)}
            >
              <rect
                x="1"
                y="3"
                width="14"
                height="12"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M5 1v3M11 1v3M1 7h14"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>

            <span
              className={`text-[13px] tracking-[0.01em] transition-colors ${
                selected ? "text-white" : "text-[#4a5568]"
              }`}
            >
              {label}
            </span>

            {selected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(null);
                }}
                className="
                  w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0
                  bg-white/[0.10] text-[#9aa4b4] text-[10px]
                  transition-all duration-150
                  hover:bg-white/[0.22] hover:text-white hover:scale-110
                "
              >
                ✕
              </button>
            )}
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={10}
            align="start"
            className="
              cal-pop-in z-[999] w-[300px] rounded-[18px] p-5
              bg-[#1a1d2e] border border-white/[0.08]
              shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04)]
              outline-none
            "
          >
            <div className="flex items-center justify-between mb-4">
              {pickerMode === "day" ? (
                <>
                  <button
                    onClick={() => navigate(-1)}
                    className="
                      w-[30px] h-[30px] rounded-lg flex items-center justify-center
                      bg-white/[0.05] border border-white/[0.08] text-[#9aa4b4]
                      transition-all duration-150
                      hover:bg-white/[0.10] hover:text-white hover:scale-105
                      active:scale-95
                    "
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M7.5 9L4.5 6l3-3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div className="flex gap-1">
                    {(
                      [
                        { label: current.format("MMMM"), mode: "month" as PickerMode },
                        { label: String(current.year()), mode: "year" as PickerMode },
                      ] as const
                    ).map(({ label: btnLabel, mode }) => (
                      <button
                        key={mode}
                        onClick={() => setMode(mode)}
                        className="
                          flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                          text-[13px] font-semibold text-white border border-transparent
                          transition-all duration-150
                          hover:bg-white/[0.07] hover:border-white/[0.10]
                        "
                      >
                        {btnLabel}
                        <span className="text-[10px] text-[#5a6475]">▾</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(1)}
                    className="
                      w-[30px] h-[30px] rounded-lg flex items-center justify-center
                      bg-white/[0.05] border border-white/[0.08] text-[#9aa4b4]
                      transition-all duration-150
                      hover:bg-white/[0.10] hover:text-white hover:scale-105
                      active:scale-95
                    "
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M4.5 3L7.5 6l-3 3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => setMode("day")}
                    className="
                      flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      text-[12px] font-medium text-[#9aa4b4] border border-transparent
                      transition-all duration-150
                      hover:bg-white/[0.07] hover:text-white hover:border-white/[0.10]
                    "
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M7.5 9L4.5 6l3-3"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("calendar.back")}
                  </button>
                  <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#5a6475]">
                    {pickerMode === "month"
                      ? t("calendar.pickerMode.month")
                      : t("calendar.pickerMode.year")}
                  </span>
                </div>
              )}
            </div>

            {pickerMode === "day" && (
              <>
                <div className="grid grid-cols-7 mb-1.5">
                  {WEEKDAYS.map((wd) => (
                    <div
                      key={wd}
                      className="text-center text-[10px] font-semibold tracking-[0.06em] text-[#5a6475] py-0.5"
                    >
                      {wd}
                    </div>
                  ))}
                </div>

                <div
                  key={animKey}
                  className={`grid grid-cols-7 gap-0.5 ${
                    animDir === "right"
                      ? "slide-right"
                      : animDir === "left"
                        ? "slide-left"
                        : ""
                  }`}
                >
                  {days.map((day, i) => {
                    const inMonth = day.month() === current.month();
                    const isToday = day.isSame(dayjs(), "day");
                    const isSel = selected != null && day.isSame(selected, "day");

                    return (
                      <button
                        key={i}
                        onClick={() => selectDate(day)}
                        className={[
                          "h-9 rounded-lg flex items-center justify-center text-[13px]",
                          "border border-transparent transition-all duration-[120ms] outline-none",
                          isSel
                            ? "bg-emerald-500 text-white border-transparent shadow-[0_2px_12px_rgba(16,185,129,0.45)] hover:bg-emerald-400 hover:scale-105 z-10"
                            : isToday
                              ? "border-emerald-500/40 text-emerald-400 hover:bg-white/[0.07] hover:text-white hover:scale-110 z-[2]"
                              : !inMonth
                                ? "text-white/[0.15] hover:bg-white/[0.04] hover:text-white/40"
                                : "text-[#9aa4b4] hover:bg-white/[0.07] hover:text-white hover:scale-110 z-[2]",
                          "active:scale-95",
                        ].join(" ")}
                      >
                        {day.date()}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {pickerMode === "month" && (
              <div className="cal-pop-in grid grid-cols-3 gap-1.5">
                {MONTHS.map((m, i) => {
                  const isActive = current.month() === i;
                  const isCurrent =
                    dayjs().month() === i && dayjs().year() === current.year();
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        setCurrent(current.month(i));
                        setMode("day");
                      }}
                      className={[
                        "py-2.5 rounded-[10px] text-[13px] border transition-all duration-[120ms]",
                        "hover:scale-105 active:scale-95",
                        isActive
                          ? "bg-emerald-500 text-white border-transparent shadow-[0_2px_10px_rgba(16,185,129,0.4)]"
                          : isCurrent
                            ? "border-emerald-500/35 text-emerald-400 bg-transparent hover:bg-white/[0.07] hover:text-white"
                            : "border-transparent text-[#9aa4b4] hover:bg-white/[0.07] hover:text-white",
                      ].join(" ")}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            )}

            {pickerMode === "year" && (
              <div
                ref={yearListRef}
                className="
                  cal-pop-in cal-scroll
                  flex flex-col gap-0.5 max-h-[200px] overflow-y-auto
                  scrollbar-thin pr-1
                "
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.12) transparent",
                }}
              >
                {YEARS.map((y) => {
                  const isActive = current.year() === y;
                  const isCurrent = dayjs().year() === y;
                  return (
                    <button
                      key={y}
                      data-active={isActive}
                      onClick={() => {
                        setCurrent(current.year(y));
                        setMode("day");
                      }}
                      className={[
                        "py-2 px-3 rounded-[10px] text-[13px] text-center border",
                        "transition-all duration-[120ms] active:scale-[0.97]",
                        isActive
                          ? "bg-emerald-500 text-white border-transparent shadow-[0_2px_10px_rgba(16,185,129,0.35)] hover:bg-emerald-400"
                          : isCurrent
                            ? "border-emerald-500/35 text-emerald-400 hover:bg-white/[0.07] hover:text-white"
                            : "border-transparent text-[#9aa4b4] hover:bg-white/[0.07] hover:text-white",
                      ].join(" ")}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between mt-3.5 pt-3 border-t border-white/[0.06]">
              <button
                onClick={() => setCurrent(dayjs())}
                className="
                  text-[11px] text-[#5a6475] px-2 py-1 rounded-md
                  transition-all duration-150
                  hover:bg-white/[0.07] hover:text-white
                "
              >
                {t("calendar.today")}
              </button>
              <button
                onClick={() => setSelected(null)}
                className="
                  text-[11px] text-[#5a6475] px-2 py-1 rounded-md
                  transition-all duration-150
                  hover:bg-white/[0.07] hover:text-white
                "
              >
                {t("calendar.clear")}
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}