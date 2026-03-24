import React, { useEffect } from "react";
import {
  useForm,
  Controller,
  type Control,
  type UseFormWatch,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { Dialog, Tabs, Select, Tooltip, Separator, Switch } from "radix-ui";
import {
  X,
  Trophy,
  Info,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  Upload,
  Palette,
  Settings,
  ChevronDown,
  Check,
} from "lucide-react";
import { useTournamentStore } from "@/store/match";
import {
  TournamentFormat,
  TournamentType,
  type Tournament,
} from "@gd/proto/tournament/v1/tournament_pb";
import { CalendarPicker } from "@/components/ui/calendar";
import type { Message } from "@bufbuild/protobuf";
import classnames from "classnames";
import { PrizeDistributionTable } from "./tournament-settings/finance-distributiontable";

const COLORS = {
  surface: "#13151f",
  surfaceAlt: "#1a1d2e",
  border: "rgba(255,255,255,0.08)",
  borderSubtle: "rgba(255,255,255,0.06)",
  borderFaint: "rgba(255,255,255,0.05)",
  inputBg: "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.09)",
  overlayBg: "rgba(0,0,0,0.15)",
  overlayDark: "rgba(0,0,0,0.2)",
  textPrimary: "#ffffff",
  textSecondary: "#9aa4b4",
  textMuted: "#7a8494",
  textDim: "#5a6475",
  textPlaceholder: "#4a5568",
  green: "#10b981",
  greenDark: "#059669",
  greenMuted: "#7ab090",
  amber: "#f59e0b",
  indigo: "#6366f1",
  blue: "#3b82f6",
  red: "#ef4444",
  purple: "#8B5CF6",
  gold: "#fbbf24",
  silver: "#d4dae3",
  bronze: "#fb923c",
  iconGray: "#9aa4b4",
  closeBtnColor: "#8a95a8",
  cancelText: "#b0bac8",
};

const TAB_CONFIG = [
  {
    value: "basic",
    label: "Thông tin cơ bản",
    sub: "Basic Info",
    icon: Info,
    accent: COLORS.green,
  },
  {
    value: "schedule",
    label: "Lịch trình & Địa điểm",
    sub: "Schedule",
    icon: Calendar,
    accent: COLORS.amber,
  },
  {
    value: "finance",
    label: "Tài chính",
    sub: "Finance",
    icon: DollarSign,
    accent: COLORS.indigo,
  },
  {
    value: "players",
    label: "Người chơi",
    sub: "Players",
    icon: Users,
    accent: COLORS.blue,
  },
  {
    value: "media",
    label: "Hình ảnh & Theme",
    sub: "Media",
    icon: ImageIcon,
    accent: COLORS.red,
  },
];

const OPTIONS = {
  gameType: ["8-Ball", "9-Ball", "10-Ball"],
  format: ["Đơn nam", "Đơn nữ", "Đôi nam nữ", "Đồng đội", "Quốc gia"],
  maxPlayers: [16, 32, 64, 128],
  gender: ["Tất cả", "Nam", "Nữ"],
  skillLevel: [
    "Tất cả",
    "Mới bắt đầu",
    "Trung bình",
    "Nâng cao",
    "Chuyên nghiệp",
  ],
  prizeDist: [
    { value: "50-30-20", label: "50% - 30% - 20% (Top 3)" },
    { value: "40-25-20-15", label: "40% - 25% - 20% - 15% (Top 4)" },
    { value: "35-25-15-15-10", label: "35% - 25% - 15% - 15% - 10% (Top 5)" },
  ],
};

const PRIZE_DIST = {
  "50-30-20": [0.5, 0.3, 0.2],
  "40-25-20-15": [0.4, 0.25, 0.2, 0.15],
  "35-25-15-15-10": [0.35, 0.25, 0.15, 0.15, 0.1],
};
const PRIZE_RANK_NAMES = [
  "🥇 Vô địch",
  "🥈 Á quân",
  "🥉 Hạng Ba",
  "Hạng 4",
  "Top 8",
];
const PRIZE_RANK_COLORS = [
  COLORS.gold,
  COLORS.silver,
  COLORS.bronze,
  COLORS.cancelText,
  COLORS.cancelText,
];

const FORM_DEFAULTS = {
  name: "",
  type: "8-Ball",
  format: "Đơn nam",
  organizer: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  tables: 8,
  totalPrize: 0,
  entryFee: 0,
  prizeDistribution: "50-30-20",
  maxPlayers: 32,
  minAge: 16,
  gender: "Tất cả",
  skillLevel: "Tất cả",
  backgroundPreview: "",
  avatarPreview: "",
  themeColor: "#00D9FF",
};

const INPUT_BASE_CLS =
  "w-full px-3.5 py-2.5 text-[13px] text-white rounded-xl outline-none transition-all duration-150 focus:ring-2 focus:ring-white/10 placeholder-[#4a5568]";
const INPUT_STYLE = {
  background: COLORS.inputBg,
  border: `1px solid ${COLORS.inputBorder}`,
};

const LInput = ({ className = "", ...p }) => (
  <input
    className={`${INPUT_BASE_CLS} ${className}`}
    style={INPUT_STYLE}
    {...p}
  />
);

const LTextarea = ({ className = "", ...p }) => (
  <textarea
    className={`${INPUT_BASE_CLS} resize-none leading-relaxed ${className}`}
    style={INPUT_STYLE}
    {...p}
  />
);

const LSelect = ({
  value,
  onValueChange,
  children,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger
      className={`${INPUT_BASE_CLS} flex items-center justify-between gap-2 cursor-pointer ${className}`}
      style={INPUT_STYLE}
    >
      <Select.Value />
      <Select.Icon asChild>
        <ChevronDown
          size={14}
          style={{ color: COLORS.iconGray, flexShrink: 0 }}
        />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        position="popper"
        sideOffset={6}
        style={{
          background: COLORS.surfaceAlt,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          boxShadow:
            "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          overflow: "hidden",
          zIndex: 9999,
          minWidth: "var(--radix-select-trigger-width)",
          maxHeight: "var(--radix-select-content-available-height)",
        }}
      >
        <Select.ScrollUpButton className="flex items-center justify-center h-7 bg-white/[0.03] text-[#9aa4b4]">
          <ChevronDown size={12} className="rotate-180" />
        </Select.ScrollUpButton>

        <Select.Viewport className="p-1.5">{children}</Select.Viewport>

        <Select.ScrollDownButton className="flex items-center justify-center h-7 bg-white/[0.03] text-[#9aa4b4]">
          <ChevronDown size={12} />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const LSelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => (
  <Select.Item
    value={value}
    className="
      flex items-center justify-between gap-2 my-1
      px-3 py-2.5 rounded-[9px]
      text-[13px] text-[#b0bac8]
      cursor-pointer outline-none select-none
      transition-all duration-[120ms]
      hover:bg-white/[0.07] hover:text-white
      data-[state=checked]:bg-[rgba(16,185,129,0.1)] data-[state=checked]:text-[#10b981]
    "
  >
    <Select.ItemText>{children}</Select.ItemText>
    <Select.ItemIndicator>
      <Check size={13} style={{ color: COLORS.green, flexShrink: 0 }} />
    </Select.ItemIndicator>
  </Select.Item>
);

const LTooltip = ({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) => (
  <Tooltip.Provider delayDuration={400}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={6}
          className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white z-[99999]"
          style={{
            background: COLORS.surfaceAlt,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {content}
          <Tooltip.Arrow style={{ fill: COLORS.surfaceAlt }} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-[11px] font-semibold uppercase tracking-[0.09em]"
      style={{ color: COLORS.textSecondary }}
    >
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const SectionHeader = ({
  icon,
  title,
  accent = COLORS.green,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: string;
}) => (
  <div
    className="flex items-center gap-3 pb-3 mb-1"
    style={{ borderBottom: `1px solid ${COLORS.borderFaint}` }}
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: `${accent}18`,
        border: `1px solid ${accent}30`,
        color: accent,
      }}
    >
      {icon}
    </div>
    <h3
      className="text-[17px] font-bold text-white"
      style={{ letterSpacing: "-0.02em" }}
    >
      {title}
    </h3>
  </div>
);

const SidebarTab = ({ tab }) => {
  const Icon = tab.icon;
  return (
    <Tabs.Trigger
      value={tab.value}
      className="group relative w-full text-left outline-none cursor-pointer p-0 bg-transparent border-0"
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-0 transition-all duration-200 scale-y-50 group-data-[state=active]:opacity-100 group-data-[state=active]:scale-y-100"
        style={{
          background: `linear-gradient(180deg, ${tab.accent}, ${tab.accent}70)`,
          boxShadow: `2px 0 10px ${tab.accent}70`,
        }}
      />
      <div className="relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 overflow-hidden hover:bg-white/[0.04]">
        <div
          className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-200 group-data-[state=active]:opacity-100 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${tab.accent}16 0%, ${tab.accent}08 100%)`,
          }}
        />
        <div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none transition-opacity duration-200 group-data-[state=active]:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${tab.accent}35` }}
        />
        <div className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 bg-white/[0.05] group-hover:bg-white/[0.08] group-data-[state=active]:bg-transparent">
          <div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-data-[state=active]:opacity-100"
            style={{
              background: `linear-gradient(135deg, ${tab.accent}38, ${tab.accent}18)`,
              boxShadow: `0 0 18px ${tab.accent}50, inset 0 1px 0 ${tab.accent}30`,
            }}
          />
          <span className="relative z-10 group-data-[state=active]:hidden">
            <Icon size={20} color={COLORS.iconGray} />
          </span>
          <span className="relative z-10 hidden group-data-[state=active]:inline-flex">
            <Icon size={20} color={tab.accent} />
          </span>
        </div>
        <div className="min-w-0 flex-1 relative z-10">
          <p className="text-[14px] font-semibold leading-tight text-[#9aa3b0] transition-colors duration-200 group-hover:text-[#ccd3db] group-data-[state=active]:text-white">
            {tab.label}
          </p>
          <p className="text-[11px] leading-tight mt-0.5">
            <span className="text-[#7a8494] group-data-[state=active]:hidden">
              {tab.sub}
            </span>
            <span
              className="hidden group-data-[state=active]:inline"
              style={{ color: tab.accent }}
            >
              {tab.sub}
            </span>
          </p>
        </div>
        <div className="relative z-10 flex-shrink-0 w-5 flex items-center justify-center">
          <div
            className="w-2 h-2 rounded-full opacity-0 scale-50 transition-all duration-200 group-data-[state=active]:opacity-100 group-data-[state=active]:scale-100"
            style={{
              background: tab.accent,
              boxShadow: `0 0 10px ${tab.accent}, 0 0 4px ${tab.accent}`,
            }}
          />
        </div>
      </div>
    </Tabs.Trigger>
  );
};

const CurrencyHint = ({ value }) =>
  value > 0 ? (
    <p className="text-[11px] mt-1" style={{ color: COLORS.indigo }}>
      ≈ {value.toLocaleString("vi-VN")} đồng
    </p>
  ) : null;

const TournamentTypeList = [
  { val: TournamentType.SINGLE, label: "Đơn" },
  { val: TournamentType.TEAM, label: "Đồng đội" },
];

const TournamentFormatList = [
  { val: TournamentFormat.TOURNAMENT_TYPE_8_BALL, label: "8 Bi" },
  { val: TournamentFormat.TOURNAMENT_TYPE_9_BALL, label: "9 Bi" },
  { val: TournamentFormat.TOURNAMENT_TYPE_10_BALL, label: "10 Bi" },
];

const BasicTab = ({ control, register }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader
      icon={<Info size={18} />}
      title="Thông tin cơ bản"
      accent={COLORS.green}
    />
    <Field label="Tên giải đấu" required>
      <LInput
        {...register("name")}
        placeholder="VD: Giải Vô Địch 8-Ball Hà Nội 2026"
      />
    </Field>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2">
        <Field label="Nội dung" required>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <LSelect value={field.value} onValueChange={field.onChange}>
                {TournamentTypeList.map(({ val, label }) => (
                  <LSelectItem key={val} value={val}>
                    {label}
                  </LSelectItem>
                ))}
              </LSelect>
            )}
          />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="Thể thức" required>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <LSelect value={field.value} onValueChange={field.onChange}>
                {TournamentFormatList.map(({ val, label }) => (
                  <LSelectItem key={val} value={val}>
                    {label}
                  </LSelectItem>
                ))}
              </LSelect>
            )}
          />
        </Field>
      </div>
      <div className="col-span-8">
        <Field label="Mô tả thêm thể thức" required={false}>
          <LInput
            {...register("formatDescription")}
            placeholder="Eg. Xếp Cao - Thắng Phá - WPA Rules"
          />
        </Field>
      </div>
    </div>
    <Field label="Ban tổ chức" required>
      <LInput {...register("organizer")} placeholder="VD: CLB Billard Golden" />
    </Field>
    <Field label="Mô tả giải đấu">
      <LTextarea
        {...register("description")}
        rows={3}
        placeholder="Mô tả chi tiết về giải đấu..."
      />
    </Field>
  </div>
);

const ScheduleTab = ({ register }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader
      icon={<Calendar size={18} />}
      title="Lịch trình & Địa điểm"
      accent={COLORS.amber}
    />
    <div className="grid grid-cols-2 gap-4">
      <Field label="Ngày tạo" required>
        <CalendarPicker />
      </Field>
      <Field label="Ngày bắt đầu" required>
        <CalendarPicker />
      </Field>
    </div>
    <Field label="Địa điểm tổ chức" required>
      <div className="relative">
        <MapPin
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: COLORS.amber }}
        />
        <LInput
          {...register("location")}
          placeholder="VD: CLB Billard Golden, Hà Nội"
          className="!pl-9"
        />
      </div>
    </Field>
  </div>
);



const INDIGO = "#6366f1";

const FinanceTab = ({ control, register, watch, setValue }) => {
  const totalPrize = watch("totalPrize");
  const entryFee = watch("entryFee");
  const prizes = watch("prizes") ?? [];

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        icon={<DollarSign size={18} />}
        title="Tài chính"
        accent={INDIGO}
      />

      <Field label="Tổng giải thưởng (VNĐ)" required>
        <div className="relative">
          <DollarSign
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: INDIGO }}
          />
          <LInput
            type="number"
            {...register("totalPrize", { valueAsNumber: true })}
            placeholder="50000000"
            className="!pl-10 h-11 text-base"
          />
        </div>
        <CurrencyHint value={totalPrize} />
      </Field>

      <Field label="Lệ phí tham gia (VNĐ)">
        <LInput
          type="number"
          {...register("entryFee", { valueAsNumber: true })}
          placeholder="500000"
          className="h-11 text-base"
        />
        <CurrencyHint value={entryFee} />
      </Field>

      {(totalPrize > 0 || prizes.length > 0) && (
        <Controller
          name="prizes"
          control={control}
          render={({ field }) => (
            <PrizeDistributionTable
              totalPrize={totalPrize || 0}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      )}
    </div>
  );
};

export default FinanceTab;
interface SwitchProps extends React.ComponentPropsWithoutRef<
  typeof Switch.Root
> {
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    track: "w-8 h-[18px]",
    thumb: "size-[13px] data-[state=checked]:translate-x-[14px]",
  },
  md: {
    track: "w-[42px] h-6",
    thumb: "size-[18px] data-[state=checked]:translate-x-[18px]",
  },
  lg: {
    track: "w-[54px] h-[30px]",
    thumb: "size-[23px] data-[state=checked]:translate-x-[24px]",
  },
};

export const SwitchComp = ({
  size = "md",
  className,
  ...props
}: SwitchProps) => {
  const { track, thumb } = sizeConfig[size];

  return (
    <Switch.Root
      className={classnames(
        "inline-flex shrink-0 cursor-pointer items-center rounded-full",
        "border-none outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "data-[state=unchecked]:bg-gray-300",
        "data-[state=checked]:bg-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-40",
        track,
        className,
      )}
      {...props}
    >
      <Switch.Thumb
        className={classnames(
          "pointer-events-none block rounded-full bg-white shadow-sm",
          "transition-transform duration-200 ease-[cubic-bezier(0.34,1.2,0.64,1)]",
          "translate-x-[3px]",
          thumb,
        )}
      />
    </Switch.Root>
  );
};

// PlayersTab.tsx — Redesigned
// Aesthetic: Refined dark-card system with soft blue accents, structured grid layout
// Dependencies: same as original (react-hook-form, lucide-react)

const RANKING_CLASSES = [
  "CN",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "K",
];

const PlayersTab = ({
  control,
  register,
  watch,
}: {
  control: Control<Tournament, any, Tournament>;
  register: UseFormRegister<Tournament>;
  watch: UseFormWatch<Tournament>;
}) => {
  const hasRanking = watch("hasRanking");

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 pb-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500">
          <Users size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-none">
            Cài đặt người chơi
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Điều kiện tham gia giải đấu
          </p>
        </div>
      </div>

      {/* ── Grid: maxPlayers + gender ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="group rounded-xl p-3.5 hover:border-blue-300/50 transition-all duration-200">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Số người tối đa <span className="text-rose-400">*</span>
          </label>
          <Controller
            name="maxPlayers"
            control={control}
            render={({ field }) => (
              <LSelect
                value={String(field.value)}
                onValueChange={(v) => field.onChange(+v)}
              >
                {OPTIONS.maxPlayers.map((n) => (
                  <LSelectItem key={n} value={String(n)}>
                    {n} người
                  </LSelectItem>
                ))}
              </LSelect>
            )}
          />
        </div>

        <div className="group rounded-xl p-3.5 hover:border-blue-300/50 transition-all duration-200">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Giới tính
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <LSelect value={field.value} onValueChange={field.onChange}>
                {OPTIONS.gender.map((v) => (
                  <LSelectItem key={v} value={v}>
                    {v}
                  </LSelectItem>
                ))}
              </LSelect>
            )}
          />
        </div>
      </div>

      {/* ── Độ tuổi ── */}
      <div className="rounded-xl p-3.5 transition-all duration-200">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Độ tuổi tối thiểu
        </label>
        <div className="relative max-w-[160px]">
          <LInput
            type="number"
            {...register("minAge", { valueAsNumber: true })}
            min="0"
            className="pr-10"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            tuổi
          </span>
        </div>
      </div>

      {/* ── Phân hạng card ── */}
      <div
        className={`
          rounded-xl border transition-all duration-300 overflow-hidden
          ${
            hasRanking
              ? "border-blue-400/40 bg-blue-500/5"
              : "[border-color:rgba(255,255,255,0.2)]"
          }
        `}
      >
        {/* Top row */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className={`
                flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-300
                ${hasRanking ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}
              `}
            >
              <Trophy size={16} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  Chế độ phân hạng
                </span>
                <span
                  className={`
                    inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                    ${hasRanking ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}
                  `}
                >
                  {hasRanking ? "Bật" : "Tắt"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-[280px] leading-relaxed">
                {hasRanking
                  ? "Người chơi cần có hạng khi đăng ký tham gia giải."
                  : "Phù hợp giải phong trào, nội bộ không cần phân loại."}
              </p>
            </div>
          </div>

          <Controller
            name="hasRanking"
            control={control}
            render={({ field }) => (
              <SwitchComp
                checked={!!field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-blue-500"
              />
            )}
          />
        </div>

        {/* Expanded: hạng giới hạn */}
        {hasRanking && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="h-px bg-blue-200/60 mb-4" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap shrink-0">
                Hạng giới hạn
              </span>

              {/* Visual ranking strip */}
              <Controller
                name="rankingClass"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-1.5">
                    {RANKING_CLASSES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => field.onChange(v)}
                        className={`
                          w-8 h-8 rounded-lg text-xs font-bold transition-all duration-150
                          ${
                            field.value === v
                              ? "bg-blue-500 text-white shadow-md shadow-blue-200 scale-110"
                              : "bg-muted border border-border text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                          }
                        `}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// const MediaTab = ({
//   control,
//   register,
//   watch,
//   setValue,
// }: {
//   control: Control<Tournament, any, Tournament>;
//   register: UseFormRegister<Tournament>;
//   watch: UseFormWatch<Tournament>;
//   setValue: UseFormSetValue<Tournament>;
// }) => {
//   const themeColor = watch("themeColor");
//   const name = watch("name");
//   const backgroundPreview = watch("backgroundPreview");
//   const avatarPreview = watch("avatarPreview");

//   const handleFile = (field, file) => {
//     if (!file) return;
//     const r = new FileReader();
//     r.onloadend = () => setValue(`${field}Preview`, r.result);
//     r.readAsDataURL(file);
//   };

//   return (
//     <div className="flex flex-col gap-5">
//       <SectionHeader
//         icon={<ImageIcon size={18} />}
//         title="Hình ảnh & Theme"
//         accent={COLORS.red}
//       />
//       <Field label="Ảnh nền giải đấu">
//         <input
//           type="file"
//           accept="image/*"
//           id="bg-upload"
//           className="hidden"
//           onChange={(e) =>
//             handleFile("background", e.target.files?.[0] ?? null)
//           }
//         />
//         <label
//           htmlFor="bg-upload"
//           className="flex flex-col items-center justify-center gap-2 h-40 rounded-xl cursor-pointer overflow-hidden transition-all duration-200 hover:bg-white/[0.03]"
//           style={{ border: "2px dashed rgba(255,255,255,0.1)" }}
//         >
//           {backgroundPreview ? (
//             <img
//               src={backgroundPreview}
//               alt="bg"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <>
//               <Upload size={24} style={{ color: COLORS.textSecondary }} />
//               <p
//                 className="text-[12px] font-semibold"
//                 style={{ color: COLORS.textSecondary }}
//               >
//                 Click để tải ảnh nền
//               </p>
//               <span className="text-[10px]" style={{ color: COLORS.textDim }}>
//                 Khuyến nghị: 1920×1080px
//               </span>
//             </>
//           )}
//         </label>
//       </Field>
//       <Field label="Logo/Avatar giải đấu">
//         <input
//           type="file"
//           accept="image/*"
//           id="avatar-upload"
//           className="hidden"
//           onChange={(e) => handleFile("avatar", e.target.files?.[0] ?? null)}
//         />
//         <div className="flex items-center gap-4">
//           <label
//             htmlFor="avatar-upload"
//             className="flex flex-col items-center justify-center gap-1 w-28 h-28 flex-shrink-0 rounded-xl cursor-pointer overflow-hidden transition-all duration-150 hover:scale-105"
//             style={{ border: "2px dashed rgba(255,255,255,0.1)" }}
//           >
//             {avatarPreview ? (
//               <img
//                 src={avatarPreview}
//                 alt="logo"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <>
//                 <Upload size={20} style={{ color: COLORS.textSecondary }} />
//                 <span className="text-[10px]" style={{ color: COLORS.textDim }}>
//                   Click để tải logo
//                 </span>
//               </>
//             )}
//           </label>
//           <p
//             className="text-[11px] leading-relaxed"
//             style={{ color: COLORS.textSecondary }}
//           >
//             Hiển thị trên toàn bộ trang.
//             <br />
//             <span className="text-[10px]" style={{ color: COLORS.textDim }}>
//               PNG · 512×512 · Transparent
//             </span>
//           </p>
//         </div>
//       </Field>
//       <Field label="Màu chủ đạo">
//         <div className="flex gap-3 items-center">
//           <Controller
//             name="themeColor"
//             control={control}
//             render={({ field }) => (
//               <input
//                 type="color"
//                 value={field.value}
//                 onChange={field.onChange}
//                 className="w-10 h-10 rounded-lg cursor-pointer flex-shrink-0"
//                 style={{
//                   background: COLORS.surfaceAlt,
//                   border: `1px solid ${COLORS.border}`,
//                 }}
//               />
//             )}
//           />
//           <LInput
//             type="text"
//             {...register("themeColor")}
//             className="font-mono max-w-[130px]"
//           />
//         </div>
//       </Field>
//       <div
//         className="rounded-xl p-4"
//         style={{
//           background: "rgba(255,255,255,0.03)",
//           border: `1px solid ${COLORS.borderFaint}`,
//         }}
//       >
//         <p
//           className="text-[10px] font-bold tracking-[0.16em] uppercase mb-3 flex items-center gap-2"
//           style={{ color: COLORS.textSecondary }}
//         >
//           <Palette size={12} /> Xem trước theme
//         </p>
//         <div className="flex items-center gap-3">
//           <div
//             className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//             style={{
//               background: `linear-gradient(135deg, ${themeColor}, ${COLORS.purple})`,
//               boxShadow: `0 0 16px ${themeColor}44`,
//             }}
//           >
//             <Trophy size={18} color="white" />
//           </div>
//           <div>
//             <p
//               className="text-[14px] font-bold"
//               style={{
//                 background: `linear-gradient(to right, ${themeColor}, ${COLORS.green})`,
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}
//             >
//               {name || "Tên giải đấu"}
//             </p>
//             <p className="text-[10px]" style={{ color: COLORS.textDim }}>
//               Tournament Platform
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export const Setting = () => {
  const { tournament } = useTournamentStore();

  const { control, setValue, register, watch, reset, handleSubmit } = useForm<Tournament>(
    {
      defaultValues: {} as Tournament,
    },
  );

  useEffect(() => {
    if (tournament) {
      reset(tournament);
    }
  }, [tournament, reset]);

  const onSubmit = (data: Tournament) => {
    console.log("form data", data);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white cursor-pointer border-0 transition-all duration-200 hover:[border-color:rgba(255,255,255,0.2)]"
          style={{
            background: "linear-gradient(135deg, #1a1d27, #22263a)",
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <Settings size={14} style={{ color: COLORS.green }} />
          Cài đặt giải đấu
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-200" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col outline-none
            data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-1
            data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
          style={{
            width: "72vw",
            height: "82vh",
            borderRadius: 20,
            overflow: "hidden",
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="absolute top-0 left-[20%] right-[20%] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",
            }}
          />

          <div
            className="flex-shrink-0 flex items-center justify-between px-6 py-4"
            style={{
              borderBottom: `1px solid ${COLORS.borderSubtle}`,
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <div className="flex items-center gap-3.5">
              <div className="flex items-center gap-1.5">
                {[COLORS.red, COLORS.amber, COLORS.green].map((c) => (
                  <div
                    key={c}
                    className="w-3 h-3 rounded-full"
                    style={{ background: c }}
                  />
                ))}
              </div>

              <Separator.Root
                orientation="vertical"
                className="w-px h-5"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />

              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.green}4d, ${COLORS.indigo}33)`,
                    border: `1px solid ${COLORS.green}4d`,
                  }}
                >
                  <Trophy size={17} style={{ color: COLORS.green }} />
                </div>
                <div>
                  <Dialog.Title
                    className="text-[14px] font-bold text-white"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    Cài đặt giải đấu
                  </Dialog.Title>
                  <Dialog.Description
                    className="text-[10px] mt-0.5"
                    style={{
                      color: COLORS.textSecondary,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Tùy chỉnh thông tin và cài đặt cho giải đấu của bạn
                  </Dialog.Description>
                </div>
              </div>
            </div>

            <Dialog.Close asChild>
              <LTooltip content="Đóng">
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-0 transition-all duration-150 hover:bg-[rgba(239,68,68,0.15)] hover:text-[#ef4444]"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: COLORS.closeBtnColor,
                  }}
                >
                  <X size={13} />
                </button>
              </LTooltip>
            </Dialog.Close>
          </div>

          <Tabs.Root
            defaultValue="basic"
            className="flex flex-1 overflow-hidden"
          >
            <div
              className="flex-shrink-0 flex flex-col overflow-y-auto"
              style={{
                width: 330,
                borderRight: `1px solid ${COLORS.borderSubtle}`,
                background: COLORS.overlayBg,
                padding: "24px 16px",
              }}
            >
              <p
                className="text-[9px] font-bold tracking-[0.2em] uppercase pl-1 mb-2.5"
                style={{ color: COLORS.closeBtnColor }}
              >
                Navigation
              </p>
              <Tabs.List className="flex flex-col gap-1.5">
                {TAB_CONFIG.map((tab) => (
                  <SidebarTab key={tab.value} tab={tab} />
                ))}
              </Tabs.List>
              <div className="mt-auto pt-4">
                <Separator.Root
                  className="h-px mb-3.5"
                  style={{ background: COLORS.borderFaint }}
                />
                <div
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{
                    background: `${COLORS.green}0f`,
                    border: `1px solid ${COLORS.green}1f`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: COLORS.green,
                      boxShadow: `0 0 8px ${COLORS.green}`,
                    }}
                  />
                  <div>
                    <p
                      className="text-[10px] font-semibold"
                      style={{ color: COLORS.green }}
                    >
                      All Systems Online
                    </p>
                    <p
                      className="text-[9px] mt-px"
                      style={{ color: COLORS.greenMuted }}
                    >
                      99.9% uptime · 30d
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="sys-scroll flex-1 overflow-y-auto"
              style={{ background: COLORS.surface }}
            >
              <Tabs.Content
                value="basic"
                className="outline-none p-10 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <BasicTab control={control} register={register} />
              </Tabs.Content>
              <Tabs.Content
                value="schedule"
                className="outline-none p-10 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <ScheduleTab register={register} />
              </Tabs.Content>
              <Tabs.Content
                value="finance"
                className="outline-none p-10 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <FinanceTab
                  control={control}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                />
              </Tabs.Content>
              <Tabs.Content
                value="players"
                className="outline-none p-10 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <PlayersTab
                  control={control}
                  register={register}
                  watch={watch}
                />
              </Tabs.Content>
              {/* <Tabs.Content
                value="media"
                className="outline-none p-10 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <MediaTab
                  control={control}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                />
              </Tabs.Content> */}
            </div>
          </Tabs.Root>

          <div
            className="flex-shrink-0 flex items-center justify-between px-6 py-3.5"
            style={{
              borderTop: `1px solid ${COLORS.borderSubtle}`,
              background: COLORS.overlayDark,
            }}
          >
            <p
              className="text-[10px] tracking-[0.06em]"
              style={{ color: COLORS.closeBtnColor }}
            >
              LAST SAVED · 14:32:07
            </p>
            <div className="flex gap-2.5">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 rounded-lg text-[12px] font-medium cursor-pointer border-0 transition-all duration-150 hover:bg-white/[0.09]"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: COLORS.cancelText,
                    border: `1px solid ${COLORS.borderFaint}`,
                  }}
                >
                  Huỷ bỏ
                </button>
              </Dialog.Close>

              <LTooltip content="Lưu tất cả thay đổi">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white cursor-pointer border-0 transition-all duration-150"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.greenDark})`,
                    boxShadow: `0 0 20px ${COLORS.green}40, 0 4px 12px rgba(0,0,0,0.3)`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 28px ${COLORS.green}66, 0 4px 12px rgba(0,0,0,0.3)`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 20px ${COLORS.green}40, 0 4px 12px rgba(0,0,0,0.3)`)
                  }
                >
                  Lưu thay đổi
                </button>
              </LTooltip>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
