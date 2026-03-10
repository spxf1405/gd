import { useEffect, useState } from "react";
import { Dialog, Tabs, Select, Tooltip, Separator } from "radix-ui";
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

// ─── Design tokens ────────────────────────────────────────────────────────────
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

// ─── Tab config ───────────────────────────────────────────────────────────────
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

// ─── Form option lists ────────────────────────────────────────────────────────
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

// ─── Prize distribution ───────────────────────────────────────────────────────
const PRIZE_DIST = {
  "50-30-20": [0.5, 0.3, 0.2],
  "40-25-20-15": [0.4, 0.25, 0.2, 0.15],
  "35-25-15-15-10": [0.35, 0.25, 0.15, 0.15, 0.1],
};
const PRIZE_RANK_NAMES = ["🥇 Nhất", "🥈 Nhì", "🥉 Ba", "④ Tư", "⑤ Năm"];
const PRIZE_RANK_COLORS = [
  COLORS.gold,
  COLORS.silver,
  COLORS.bronze,
  COLORS.cancelText,
  COLORS.cancelText,
];

// ─── Form defaults ────────────────────────────────────────────────────────────
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

// ─── Shared CSS ───────────────────────────────────────────────────────────────
const INPUT_BASE_CLS =
  "w-full px-3.5 py-2.5 text-[13px] text-white rounded-xl outline-none transition-all duration-150 focus:ring-2 focus:ring-white/10 placeholder-[#4a5568]";
const INPUT_STYLE = {
  background: COLORS.inputBg,
  border: `1px solid ${COLORS.inputBorder}`,
};

// ─── Base atoms ───────────────────────────────────────────────────────────────
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

// ─── Radix Select ─────────────────────────────────────────────────────────────
const LSelect = ({ value, onValueChange, children, className = "" }) => (
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

const LSelectItem = ({ value, children }) => (
  <Select.Item
    value={value}
    className="
      flex items-center justify-between gap-2
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

// ─── Radix Tooltip ────────────────────────────────────────────────────────────
const LTooltip = ({ content, children }) => (
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

// ─── Field & SectionHeader ────────────────────────────────────────────────────
const Field = ({ label, required, children }) => (
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

const SectionHeader = ({ icon, title, accent = COLORS.green }) => (
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

// ─── Sidebar tab ──────────────────────────────────────────────────────────────
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

// ─── Currency hint ────────────────────────────────────────────────────────────
const CurrencyHint = ({ value }) =>
  value > 0 ? (
    <p className="text-[11px] mt-1" style={{ color: COLORS.indigo }}>
      ≈ {value.toLocaleString("vi-VN")} đồng
    </p>
  ) : null;

// ─── Tab 1 ────────────────────────────────────────────────────────────────────
const BasicTab = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader
      icon={<Info size={18} />}
      title="Thông tin cơ bản"
      accent={COLORS.green}
    />
    <Field label="Tên giải đấu" required>
      <LInput
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="VD: Giải Vô Địch 8-Ball Hà Nội 2026"
      />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Thể thức" required>
        <LSelect value={form.type} onValueChange={(v) => set("type", v)}>
          {OPTIONS.gameType.map((v) => (
            <LSelectItem key={v} value={v}>
              {v}
            </LSelectItem>
          ))}
        </LSelect>
      </Field>
      <Field label="Nội dung" required>
        <LSelect value={form.format} onValueChange={(v) => set("format", v)}>
          {OPTIONS.format.map((v) => (
            <LSelectItem key={v} value={v}>
              {v}
            </LSelectItem>
          ))}
        </LSelect>
      </Field>
    </div>
    <Field label="Ban tổ chức" required>
      <LInput
        value={form.organizer}
        onChange={(e) => set("organizer", e.target.value)}
        placeholder="VD: CLB Billard Golden"
      />
    </Field>
    <Field label="Mô tả giải đấu">
      <LTextarea
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
        rows={3}
        placeholder="Mô tả chi tiết về giải đấu..."
      />
    </Field>
  </div>
);

// ─── Tab 2 ────────────────────────────────────────────────────────────────────
const ScheduleTab = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader
      icon={<Calendar size={18} />}
      title="Lịch trình & Địa điểm"
      accent={COLORS.amber}
    />
    <div className="grid grid-cols-2 gap-4">
      <Field label="Ngày bắt đầu" required>
        <LInput
          type="date"
          value={form.startDate}
          onChange={(e) => set("startDate", e.target.value)}
        />
      </Field>
      <Field label="Ngày kết thúc" required>
        <LInput
          type="date"
          value={form.endDate}
          onChange={(e) => set("endDate", e.target.value)}
        />
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
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="VD: CLB Billard Golden, Hà Nội"
          className="!pl-9"
        />
      </div>
    </Field>
    <Field label="Số bàn billard" required>
      <LInput
        type="number"
        value={form.tables}
        onChange={(e) => set("tables", +e.target.value)}
        min="1"
        className="max-w-[160px]"
      />
    </Field>
  </div>
);

// ─── Tab 3 ────────────────────────────────────────────────────────────────────
const FinanceTab = ({ form, set }) => {
  const pcts = PRIZE_DIST[form.prizeDistribution] ?? PRIZE_DIST["50-30-20"];
  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        icon={<DollarSign size={18} />}
        title="Tài chính"
        accent={COLORS.indigo}
      />
      <Field label="Tổng giải thưởng (VNĐ)" required>
        <div className="relative">
          <DollarSign
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: COLORS.green }}
          />
          <LInput
            type="number"
            value={form.totalPrize}
            onChange={(e) => set("totalPrize", +e.target.value)}
            placeholder="50000000"
            className="!pl-9"
          />
        </div>
        <CurrencyHint value={form.totalPrize} />
      </Field>
      <Field label="Lệ phí tham gia (VNĐ)">
        <LInput
          type="number"
          value={form.entryFee}
          onChange={(e) => set("entryFee", +e.target.value)}
          placeholder="500000"
        />
        <CurrencyHint value={form.entryFee} />
      </Field>
      <Field label="Phân phối giải thưởng">
        <LSelect
          value={form.prizeDistribution}
          onValueChange={(v) => set("prizeDistribution", v)}
        >
          {OPTIONS.prizeDist.map(({ value, label }) => (
            <LSelectItem key={value} value={value}>
              {label}
            </LSelectItem>
          ))}
        </LSelect>
      </Field>
      {form.totalPrize > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            border: `1px solid ${COLORS.indigo}33`,
            background: `${COLORS.indigo}0a`,
          }}
        >
          <div
            className="px-5 py-2.5"
            style={{
              borderBottom: `1px solid ${COLORS.indigo}1f`,
              background: `${COLORS.indigo}14`,
            }}
          >
            <span
              className="text-[10px] font-bold tracking-[0.18em] uppercase"
              style={{ color: COLORS.indigo }}
            >
              Dự kiến giải thưởng
            </span>
          </div>
          {pcts.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-5 py-3 hover:bg-white/[0.03] transition-colors"
              style={{
                borderBottom:
                  i < pcts.length - 1
                    ? `1px solid ${COLORS.borderFaint}`
                    : "none",
              }}
            >
              <span
                className="text-[13px]"
                style={{ color: COLORS.cancelText }}
              >
                {PRIZE_RANK_NAMES[i]}
              </span>
              <span
                className="text-[13px] font-bold"
                style={{ color: PRIZE_RANK_COLORS[i] }}
              >
                {(form.totalPrize * p).toLocaleString("vi-VN")} đ
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Tab 4 ────────────────────────────────────────────────────────────────────
const PlayersTab = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader
      icon={<Users size={18} />}
      title="Cài đặt người chơi"
      accent={COLORS.blue}
    />
    <Field label="Số lượng người chơi tối đa" required>
      <LSelect
        value={String(form.maxPlayers)}
        onValueChange={(v) => set("maxPlayers", +v)}
        className="max-w-[220px]"
      >
        {OPTIONS.maxPlayers.map((n) => (
          <LSelectItem key={n} value={String(n)}>
            {n} người
          </LSelectItem>
        ))}
      </LSelect>
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Độ tuổi tối thiểu">
        <LInput
          type="number"
          value={form.minAge}
          onChange={(e) => set("minAge", +e.target.value)}
          min="0"
        />
      </Field>
      <Field label="Giới tính">
        <LSelect value={form.gender} onValueChange={(v) => set("gender", v)}>
          {OPTIONS.gender.map((v) => (
            <LSelectItem key={v} value={v}>
              {v}
            </LSelectItem>
          ))}
        </LSelect>
      </Field>
    </div>
    <Field label="Trình độ">
      <LSelect
        value={form.skillLevel}
        onValueChange={(v) => set("skillLevel", v)}
      >
        {OPTIONS.skillLevel.map((v) => (
          <LSelectItem key={v} value={v}>
            {v}
          </LSelectItem>
        ))}
      </LSelect>
    </Field>
  </div>
);

// ─── Tab 5 ────────────────────────────────────────────────────────────────────
const MediaTab = ({ form, set, handleFile }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader
      icon={<ImageIcon size={18} />}
      title="Hình ảnh & Theme"
      accent={COLORS.red}
    />
    <Field label="Ảnh nền giải đấu">
      <input
        type="file"
        accept="image/*"
        id="bg-upload"
        className="hidden"
        onChange={(e) => handleFile("background", e.target.files?.[0] ?? null)}
      />
      <label
        htmlFor="bg-upload"
        className="flex flex-col items-center justify-center gap-2 h-40 rounded-xl cursor-pointer overflow-hidden transition-all duration-200 hover:bg-white/[0.03]"
        style={{ border: "2px dashed rgba(255,255,255,0.1)" }}
      >
        {form.backgroundPreview ? (
          <img
            src={form.backgroundPreview}
            alt="bg"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <Upload size={24} style={{ color: COLORS.textSecondary }} />
            <p
              className="text-[12px] font-semibold"
              style={{ color: COLORS.textSecondary }}
            >
              Click để tải ảnh nền
            </p>
            <span className="text-[10px]" style={{ color: COLORS.textDim }}>
              Khuyến nghị: 1920×1080px
            </span>
          </>
        )}
      </label>
    </Field>
    <Field label="Logo/Avatar giải đấu">
      <input
        type="file"
        accept="image/*"
        id="avatar-upload"
        className="hidden"
        onChange={(e) => handleFile("avatar", e.target.files?.[0] ?? null)}
      />
      <div className="flex items-center gap-4">
        <label
          htmlFor="avatar-upload"
          className="flex flex-col items-center justify-center gap-1 w-28 h-28 flex-shrink-0 rounded-xl cursor-pointer overflow-hidden transition-all duration-150 hover:scale-105"
          style={{ border: "2px dashed rgba(255,255,255,0.1)" }}
        >
          {form.avatarPreview ? (
            <img
              src={form.avatarPreview}
              alt="logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <Upload size={20} style={{ color: COLORS.textSecondary }} />
              <span className="text-[10px]" style={{ color: COLORS.textDim }}>
                Click để tải logo
              </span>
            </>
          )}
        </label>
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: COLORS.textSecondary }}
        >
          Hiển thị trên toàn bộ trang.
          <br />
          <span className="text-[10px]" style={{ color: COLORS.textDim }}>
            PNG · 512×512 · Transparent
          </span>
        </p>
      </div>
    </Field>
    <Field label="Màu chủ đạo">
      <div className="flex gap-3 items-center">
        <input
          type="color"
          value={form.themeColor}
          onChange={(e) => set("themeColor", e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer flex-shrink-0"
          style={{
            background: COLORS.surfaceAlt,
            border: `1px solid ${COLORS.border}`,
          }}
        />
        <LInput
          type="text"
          value={form.themeColor}
          onChange={(e) => set("themeColor", e.target.value)}
          className="font-mono max-w-[130px]"
        />
      </div>
    </Field>
    <div
      className="rounded-xl p-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${COLORS.borderFaint}`,
      }}
    >
      <p
        className="text-[10px] font-bold tracking-[0.16em] uppercase mb-3 flex items-center gap-2"
        style={{ color: COLORS.textSecondary }}
      >
        <Palette size={12} /> Xem trước theme
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${form.themeColor}, ${COLORS.purple})`,
            boxShadow: `0 0 16px ${form.themeColor}44`,
          }}
        >
          <Trophy size={18} color="white" />
        </div>
        <div>
          <p
            className="text-[14px] font-bold"
            style={{
              background: `linear-gradient(to right, ${form.themeColor}, ${COLORS.green})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {form.name || "Tên giải đấu"}
          </p>
          <p className="text-[10px]" style={{ color: COLORS.textDim }}>
            Tournament Platform
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export const Setting = () => {
  const { tournament } = useTournamentStore();
  console.log("tournament", tournament)
  const [form, setForm] = useState(FORM_DEFAULTS);

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...tournament }));
  }, [tournament]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleFile = (field, file) => {
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () =>
      setForm((p) => ({ ...p, [`${field}Preview`]: r.result }));
    r.readAsDataURL(file);
  };

  const PANELS = {
    basic: <BasicTab form={form} set={set} />,
    schedule: <ScheduleTab form={form} set={set} />,
    finance: <FinanceTab form={form} set={set} />,
    players: <PlayersTab form={form} set={set} />,
    media: <MediaTab form={form} set={set} handleFile={handleFile} />,
  };

  return (
    <Dialog.Root>
      {/* ── Trigger ── */}
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
          {/* shine */}
          <div
            className="absolute top-0 left-[20%] right-[20%] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",
            }}
          />

          {/* ── Header ── */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-6 py-4"
            style={{
              borderBottom: `1px solid ${COLORS.borderSubtle}`,
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <div className="flex items-center gap-3.5">
              {/* traffic lights */}
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

          {/* ── Body ── */}
          <Tabs.Root
            defaultValue="basic"
            className="flex flex-1 overflow-hidden"
          >
            {/* Sidebar */}
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

            {/* Panels */}
            <div
              className="sys-scroll flex-1 overflow-y-auto"
              style={{ background: COLORS.surface }}
            >
              {TAB_CONFIG.map((tab) => (
                <Tabs.Content
                  key={tab.value}
                  value={tab.value}
                  className="outline-none p-10 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
                >
                  {PANELS[tab.value]}
                </Tabs.Content>
              ))}
            </div>
          </Tabs.Root>

          {/* ── Footer ── */}
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
