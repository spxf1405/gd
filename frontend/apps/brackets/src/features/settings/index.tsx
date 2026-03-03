import React, { useState } from "react";
import {
  X, Trophy, Info, Calendar, MapPin, DollarSign,
  Users, Image as ImageIcon, Upload, Sword, ChevronRight,
  Shield, Zap,
} from "lucide-react";
import { Dialog, Tabs } from "radix-ui";

// ─── Tailwind utility combiner (tiny cx helper) ───────────────────────────────
const cx = (...classes: (string | false | undefined | null)[]) =>
  classes.filter(Boolean).join(" ");

// ─── Reusable sub-components ─────────────────────────────────────────────────

const LolInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cx(
      "w-full px-3.5 py-2.5 rounded-sm text-[13px] font-semibold",
      "bg-[#0a1930] border border-[#c89b3c33] text-[#f0e6be]",
      "placeholder:text-[#3e4a5c] placeholder:font-normal",
      "outline-none transition-all duration-150",
      "hover:border-[#c89b3c66] hover:bg-[#0d1f35]",
      "focus:border-[#c89b3c] focus:bg-[#0d1f35]",
      "focus:shadow-[0_0_0_1px_rgba(200,155,60,0.15),0_0_14px_rgba(200,155,60,0.07)]",
      className
    )}
    {...props}
  />
));
LolInput.displayName = "LolInput";

const LolSelect = ({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cx(
      "w-full px-3.5 py-2.5 rounded-sm text-[13px] font-semibold appearance-none cursor-pointer",
      "bg-[#0a1930] border border-[#c89b3c33] text-[#f0e6be]",
      "outline-none transition-all duration-150",
      "hover:border-[#c89b3c66] hover:bg-[#0d1f35]",
      "focus:border-[#c89b3c] focus:bg-[#0d1f35]",
      // custom arrow
      "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C89B3C' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] pr-9",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

const LolLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block mb-2 text-[9px] font-bold tracking-[0.22em] uppercase text-[#a9b0b8]">
    {children}
    {required && <span className="text-[#c23b22] ml-1">*</span>}
  </label>
);

const Field = ({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cx("mb-5", className)}>
    <LolLabel required={required}>{label}</LolLabel>
    {children}
  </div>
);

const HelpText = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-1.5 text-[10px] text-[#785a28] tracking-wide">
    ✦ {children}
  </p>
);

const SectionHeader = ({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) => (
  <div className="mb-5">
    <h2 className="text-[18px] font-bold tracking-[0.07em] uppercase text-[#f0e6be] [text-shadow:0_0_30px_rgba(200,155,60,0.35)]">
      {title}
    </h2>
    <p className="text-[11px] text-[#3e4a5c] tracking-wide mt-0.5">
      {desc}
    </p>
    {/* Gold divider */}
    <div className="mt-5 h-px bg-gradient-to-r from-[#785a28] via-[#c89b3c33] to-transparent" />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament?: Record<string, unknown>;
  onSave?: (data: unknown) => void;
}

export const Setting: React.FC<Props> = ({ open, onOpenChange, tournament, onSave }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const [form, setForm] = useState({
    name:              (tournament?.name as string)        || "",
    type:              (tournament?.type as string)        || "8-Ball",
    format:            (tournament?.format as string)      || "Đơn",
    organizer:         (tournament?.organizer as string)   || "",
    description:       "",
    startDate:         (tournament?.startDate as string)   || "",
    endDate:           (tournament?.endDate as string)     || "",
    location:          (tournament?.location as string)    || "",
    tables:            (tournament?.tables as number)      ?? 8,
    totalPrize:        (tournament?.totalPrize as number)  ?? 0,
    entryFee:          (tournament?.entryFee as number)    ?? 0,
    prizeDistribution: "50-30-20",
    maxPlayers:        (tournament?.maxPlayers as number)  ?? 32,
    minAge:            16,
    gender:            "Tất cả",
    skillLevel:        "Tất cả",
    bgFile:            null as File | null,
    bgPreview:         "",
    avatarFile:        null as File | null,
    avatarPreview:     "",
    themeColor:        "#C89B3C",
  });

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFile = (field: "bg" | "avatar", file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((prev) => ({
        ...prev,
        [`${field}File`]: file,
        [`${field}Preview`]: reader.result as string,
      }));
    reader.readAsDataURL(file);
  };

  const tabs = [
    { value: "basic",    label: "Thông Tin",   icon: Info        },
    { value: "schedule", label: "Lịch Trình",  icon: Calendar    },
    { value: "finance",  label: "Giải Thưởng", icon: DollarSign  },
    { value: "players",  label: "Chiến Binh",  icon: Users       },
    { value: "media",    label: "Huy Hiệu",    icon: ImageIcon   },
  ];

  // Prize distribution helper
  const parsePrize = () => {
    const map: Record<string, number[]> = {
      "50-30-20":      [0.5, 0.3, 0.2],
      "40-25-20-15":   [0.4, 0.25, 0.2, 0.15],
      "35-25-15-15-10":[0.35, 0.25, 0.15, 0.15, 0.1],
    };
    return map[form.prizeDistribution] ?? [0.5, 0.3, 0.2];
  };
  const medals = ["🥇", "🥈", "🥉", "④", "⑤"];
  const rankNames = ["Vô Địch", "Á Quân", "Hạng Ba", "Hạng Tư", "Hạng Năm"];

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;900&family=Cinzel+Decorative:wght@400;700&family=Nunito:wght@400;500;600;700&display=swap');

        .lol-sheen::after {
          content:'';
          position:absolute;
          top:-50%; left:-60%;
          width:40%; height:200%;
          background:linear-gradient(105deg,transparent,rgba(240,230,190,0.18),transparent);
          animation:lol-sheen 3.5s ease-in-out infinite;
        }
        @keyframes lol-sheen {
          0%   { left:-60%; }
          50%  { left:130%; }
          100% { left:130%; }
        }

        /* Hex corner decorator */
        .hc::before,.hc::after,
        .hc > span::before,.hc > span::after {
          content:'';
          position:absolute;
          width:14px; height:14px;
          border-color:#785a28;
          border-style:solid;
          pointer-events:none;
          z-index:2;
        }
        .hc::before  { top:0;    left:0;  border-width:2px 0 0 2px; }
        .hc::after   { top:0;    right:0; border-width:2px 2px 0 0; }
        .hc > span::before { bottom:0; left:0;  border-width:0 0 2px 2px; }
        .hc > span::after  { bottom:0; right:0; border-width:0 2px 2px 0; }

        /* native date/color input theming */
        input[type='date']::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(2) hue-rotate(5deg); cursor:pointer; }
        input[type='color'] { -webkit-appearance:none; padding:3px; }
        input[type='color']::-webkit-color-swatch-wrapper { padding:0; }
        input[type='color']::-webkit-color-swatch { border:none; border-radius:2px; }

        select option { background:#0a1628; color:#f0e6be; }

        /* scrollbar */
        .lol-scroll::-webkit-scrollbar { width:4px; }
        .lol-scroll::-webkit-scrollbar-track { background:transparent; }
        .lol-scroll::-webkit-scrollbar-thumb { background:#785a28; border-radius:2px; }

        /* tab active ring */
        [data-state='active'].lol-tab {
          background:linear-gradient(90deg,rgba(200,155,60,0.16),rgba(200,155,60,0.04));
          color:#c89b3c !important;
          border-color:rgba(200,155,60,0.4) !important;
          box-shadow: inset 3px 0 0 #c89b3c;
        }
        [data-state='active'].lol-tab svg { color:#c89b3c; filter:drop-shadow(0 0 5px rgba(200,155,60,0.6)); }
      `}</style>

      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        {/* Trigger */}
        <Dialog.Trigger asChild>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-bold tracking-[0.12em] uppercase rounded-sm border border-[#c89b3c66] bg-gradient-to-br from-[#0a1628] to-[#010a13] text-[#c89b3c] cursor-pointer transition-all duration-200 hover:shadow-[0_0_18px_rgba(200,155,60,0.35)] hover:from-[#1a2a4a] hover:to-[#0a1628] ">
            <Sword size={13} />
            Cài Đặt Giải Đấu
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          {/* Overlay */}
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/75" />

          {/* Dialog */}
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50
           w-[60vw] h-[90vh]
           -translate-x-1/2 -translate-y-1/2
           bg-[#0F172A]
           rounded-2xl shadow-2xl
           dialog-transition
           p-6 flex flex-col gap-2"
          >
            <span /> {/* needed for hc CSS trick */}

            {/* ── HEADER ─────────────────────────────────────────────────────── */}
            <div className="relative flex items-center justify-between px-7 py-5 bg-gradient-to-b from-[#16264a] to-[#0a1628] border-b border-[#c89b3c44] flex-shrink-0 overflow-hidden">
              {/* Subtle gold radial */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_100%_at_15%_50%,rgba(200,155,60,0.07),transparent_70%)] pointer-events-none" />
              {/* Bottom shine */}
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent" />

              <div className="relative flex items-center gap-5">
                {/* Diamond icon */}
                <div className="w-12 h-12 rotate-45 flex items-center justify-center border border-[#c89b3c66] bg-gradient-to-br from-[#1c3060] to-[#0a1628] flex-shrink-0 shadow-[0_0_22px_rgba(200,155,60,0.35),inset_0_1px_0_rgba(200,155,60,0.2)]">
                  <Trophy className="-rotate-45 text-[#c89b3c]" size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <Dialog.Title className="m-0 text-[15px] font-bold tracking-[0.07em] uppercase text-[#c89b3c]  [text-shadow:0_0_28px_rgba(200,155,60,0.5)]">
                    Cài Đặt Giải Đấu
                  </Dialog.Title>
                  <Dialog.Description className="mt-1 text-[10px] tracking-[0.16em] uppercase text-[#a9b0b8]">
                    ✦ Cấu Hình Trận Chiến ✦
                  </Dialog.Description>
                </div>
              </div>

              <Dialog.Close asChild>
                <button className="relative flex items-center justify-center w-9 h-9 border border-[#c89b3c33] rounded-sm text-[#a9b0b8] bg-transparent cursor-pointer transition-all duration-200 hover:border-[#c23b22] hover:text-[#ff6b6b] hover:bg-[rgba(194,59,34,0.1)]">
                  <X size={15} />
                </button>
              </Dialog.Close>
            </div>

            {/* ── BODY ───────────────────────────────────────────────────────── */}
            <Tabs.Root
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-1 overflow-hidden"
            >
              {/* Sidebar */}
              <div className="relative w-52 flex-shrink-0 bg-gradient-to-b from-[#0a1525] to-[#060e1a] border-r border-[#c89b3c44] px-3 py-5 overflow-y-auto lol-scroll">
                {/* Right gold line */}
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#c89b3c] to-transparent opacity-60" />

                <p className="mb-3 px-2 pb-2.5 text-[8px] font-bold tracking-[0.24em] uppercase text-[#3e4a5c] border-b border-[#c89b3c18] ">
                  Danh Mục
                </p>

                <Tabs.List className="flex flex-col gap-1">
                  {tabs.map((tab) => (
                    <Tabs.Trigger
                      key={tab.value}
                      value={tab.value}
                      className={cx(
                        "lol-tab",
                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-left cursor-pointer",
                        "text-[10.5px] font-bold tracking-[0.06em] uppercase text-[#a9b0b8]",
                        "border border-transparent bg-transparent transition-all duration-150",
                        "hover:bg-[rgba(200,155,60,0.06)] hover:text-[#f0e6be] hover:border-[rgba(200,155,60,0.12)]",
                        "",
                      )}
                    >
                      <tab.icon size={12} className="text-[#3e4a5c] flex-shrink-0 transition-all duration-150" />
                      {tab.label}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>

                {/* Bottom decoration */}
                <div className="mt-6 px-2">
                  <div className="h-px bg-gradient-to-r from-[#785a28] to-transparent mb-4" />
                  <div className="flex items-center gap-2 opacity-30">
                    <Shield size={10} className="text-[#c89b3c]" />
                    <span className="text-[8px] tracking-widest uppercase text-[#c89b3c] ">Season 2026</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto lol-scroll px-9 py-8 bg-gradient-to-b from-[#06101c] to-[#030810] relative">
                {/* Ambient glow top */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_25%_at_50%_0%,rgba(200,155,60,0.03),transparent_60%)] pointer-events-none" />

                {/* ── BASIC ── */}
                <Tabs.Content value="basic" className="relative">
                  <SectionHeader title="Thông Tin Cơ Bản" desc="Danh Hiệu & Thông Tin Giải Đấu" />

                  <Field label="Tên Giải Đấu" required>
                    <LolInput
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="VD: Giải Vô Địch 8-Ball Hà Nội 2026"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <Field label="Loại Hình" required className="mb-0">
                      <LolSelect value={form.type} onChange={(e) => set("type", e.target.value)}>
                        {["8-Ball","9-Ball","10-Ball","Carom 3-băng","Snooker"].map(v => <option key={v} value={v}>{v}</option>)}
                      </LolSelect>
                    </Field>
                    <Field label="Thể Thức" required className="mb-0">
                      <LolSelect value={form.format} onChange={(e) => set("format", e.target.value)}>
                        {["Đơn","Đôi","Đồng đội"].map(v => <option key={v} value={v}>{v}</option>)}
                      </LolSelect>
                    </Field>
                  </div>

                  <Field label="Ban Tổ Chức" required>
                    <LolInput value={form.organizer} onChange={(e) => set("organizer", e.target.value)} placeholder="VD: CLB Billard Golden" />
                  </Field>

                  <Field label="Mô Tả">
                    <textarea
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      rows={4}
                      placeholder="Mô tả chi tiết về giải đấu..."
                      className="w-full px-3.5 py-2.5 rounded-sm text-[13px] font-semibold resize-none leading-relaxed bg-[#0a1930] border border-[#c89b3c33] text-[#f0e6be] placeholder:text-[#3e4a5c] placeholder:font-normal outline-none transition-all duration-150 hover:border-[#c89b3c66] hover:bg-[#0d1f35] focus:border-[#c89b3c] focus:bg-[#0d1f35] "
                    />
                  </Field>
                </Tabs.Content>

                {/* ── SCHEDULE ── */}
                <Tabs.Content value="schedule" className="relative">
                  <SectionHeader title="Lịch Trình & Địa Điểm" desc="Thời Gian & Chiến Trường" />

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <Field label="Ngày Bắt Đầu" required className="mb-0">
                      <LolInput type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
                    </Field>
                    <Field label="Ngày Kết Thúc" required className="mb-0">
                      <LolInput type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
                    </Field>
                  </div>

                  <Field label="Địa Điểm" required>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#785a28]" />
                      <LolInput
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="VD: CLB Billard Golden, Hà Nội"
                        className="!pl-9"
                      />
                    </div>
                  </Field>

                  <Field label="Số Bàn Thi Đấu" required>
                    <LolInput
                      type="number"
                      value={form.tables}
                      onChange={(e) => set("tables", parseInt(e.target.value))}
                      min="1"
                      className="max-w-[140px]"
                    />
                  </Field>
                </Tabs.Content>

                {/* ── FINANCE ── */}
                <Tabs.Content value="finance" className="relative">
                  <SectionHeader title="Kho Báu & Giải Thưởng" desc="Phần Thưởng Dành Cho Chiến Thắng" />

                  <Field label="Tổng Giải Thưởng (VNĐ)" required>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#785a28]" />
                      <LolInput
                        type="number"
                        value={form.totalPrize}
                        onChange={(e) => set("totalPrize", parseInt(e.target.value))}
                        placeholder="50000000"
                        className="!pl-9"
                      />
                    </div>
                    {form.totalPrize > 0 && <HelpText>{form.totalPrize.toLocaleString("vi-VN")} đồng</HelpText>}
                  </Field>

                  <Field label="Lệ Phí Tham Gia (VNĐ)" required>
                    <LolInput
                      type="number"
                      value={form.entryFee}
                      onChange={(e) => set("entryFee", parseInt(e.target.value))}
                      placeholder="500000"
                    />
                    {form.entryFee > 0 && <HelpText>{form.entryFee.toLocaleString("vi-VN")} đồng</HelpText>}
                  </Field>

                  <Field label="Phân Phối Giải Thưởng">
                    <LolSelect value={form.prizeDistribution} onChange={(e) => set("prizeDistribution", e.target.value)}>
                      <option value="50-30-20">50% — 30% — 20% (Top 3)</option>
                      <option value="40-25-20-15">40% — 25% — 20% — 15% (Top 4)</option>
                      <option value="35-25-15-15-10">35% — 25% — 15% — 15% — 10% (Top 5)</option>
                    </LolSelect>
                  </Field>

                  {/* Prize preview card */}
                  {form.totalPrize > 0 && (
                    <div className="relative bg-gradient-to-br from-[#0a1930] to-[#060e1a] border border-[#c89b3c44] rounded-sm p-5 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(200,155,60,0.05)] to-transparent pointer-events-none" />
                      {/* mini hex corners */}
                      <span className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#785a28]" />
                      <span className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#785a28]" />

                      <p className="mb-4 text-[9px] font-bold tracking-[0.2em] uppercase text-[#c89b3c] ">
                        ✦ Dự Kiến Trao Thưởng
                      </p>
                      {parsePrize().map((pct, i) => (
                        <div
                          key={i}
                          className={cx(
                            "flex justify-between items-center py-2.5  text-[13px] font-semibold",
                            i < parsePrize().length - 1 ? "border-b border-[#c89b3c14]" : "",
                          )}
                        >
                          <div className="flex items-center gap-3 text-[#a9b0b8]">
                            <span className="text-[17px]">{medals[i]}</span>
                            {rankNames[i]}
                          </div>
                          <span className={i === 0 ? "text-[#c89b3c] font-bold" : "text-[#a9b0b8]"}>
                            {(form.totalPrize * pct).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Tabs.Content>

                {/* ── PLAYERS ── */}
                <Tabs.Content value="players" className="relative">
                  <SectionHeader title="Chiến Binh Tham Gia" desc="Điều Kiện & Giới Hạn Người Chơi" />

                  <Field label="Số Chiến Binh Tối Đa" required>
                    <LolSelect
                      value={form.maxPlayers}
                      onChange={(e) => set("maxPlayers", parseInt(e.target.value))}
                      className="max-w-[200px]"
                    >
                      {[16, 32, 64, 128].map(n => <option key={n} value={n}>{n} người</option>)}
                    </LolSelect>
                  </Field>

                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <Field label="Tuổi Tối Thiểu" className="mb-0">
                      <LolInput type="number" value={form.minAge} onChange={(e) => set("minAge", parseInt(e.target.value))} min="0" />
                    </Field>
                    <Field label="Giới Tính" className="mb-0">
                      <LolSelect value={form.gender} onChange={(e) => set("gender", e.target.value)}>
                        <option>Tất Cả</option>
                        <option>Nam</option>
                        <option>Nữ</option>
                      </LolSelect>
                    </Field>
                  </div>

                  <Field label="Hạng Bậc">
                    <LolSelect value={form.skillLevel} onChange={(e) => set("skillLevel", e.target.value)}>
                      <option value="Tất cả">Tất Cả Hạng</option>
                      <option value="Mới bắt đầu">Sắt — Đồng</option>
                      <option value="Trung bình">Bạc — Vàng</option>
                      <option value="Nâng cao">Bạch Kim — Kim Cương</option>
                      <option value="Chuyên nghiệp">Cao Thủ — Thách Đấu</option>
                    </LolSelect>
                  </Field>

                  {/* Rank tiers visual */}
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {[
                      { label: "Sắt",       color: "#8a8a8a", icon: "🪨" },
                      { label: "Đồng",      color: "#ad6432", icon: "🥉" },
                      { label: "Vàng",      color: "#c89b3c", icon: "🥇" },
                      { label: "Bạch Kim",  color: "#dde6e8", icon: "💎" },
                      { label: "Thách Đấu", color: "#9b59b6", icon: "👑" },
                    ].map((tier) => (
                      <div
                        key={tier.label}
                        className="flex flex-col items-center gap-1.5 py-3 rounded-sm border border-[#ffffff0a] bg-[#0a193066] transition-all duration-150 hover:border-[#c89b3c22]"
                      >
                        <span className="text-xl">{tier.icon}</span>
                        <span
                          className="text-[9px] font-bold tracking-wide "
                          style={{ color: tier.color }}
                        >
                          {tier.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </Tabs.Content>

                {/* ── MEDIA ── */}
                <Tabs.Content value="media" className="relative">
                  <SectionHeader title="Huy Hiệu & Sắc Màu" desc="Biểu Tượng & Màu Chủ Đạo" />

                  {/* Background upload */}
                  <Field label="Ảnh Nền Giải Đấu">
                    <input type="file" accept="image/*" id="bg-upload" className="hidden"
                      onChange={(e) => handleFile("bg", e.target.files?.[0] ?? null)} />
                    <label
                      htmlFor="bg-upload"
                      className="flex flex-col items-center justify-center gap-2.5 h-36 rounded-sm border border-dashed border-[#c89b3c33] bg-[#0a1930] text-[#3e4a5c] cursor-pointer transition-all duration-200 overflow-hidden hover:border-[#c89b3c77] hover:bg-[rgba(200,155,60,0.03)] hover:text-[#c89b3c] "
                    >
                      {form.bgPreview
                        ? <img src={form.bgPreview} alt="bg" className="w-full h-full object-cover" />
                        : <>
                            <Upload size={22} />
                            <p className="text-[12px] font-bold tracking-wide">Chọn Ảnh Nền</p>
                            <span className="text-[10px] tracking-[0.1em]">1920 × 1080 · PNG / JPG</span>
                          </>
                      }
                    </label>
                  </Field>

                  {/* Avatar + color row */}
                  <div className="grid grid-cols-2 gap-6 mb-5">
                    <Field label="Huy Hiệu Giải Đấu" className="mb-0">
                      <input type="file" accept="image/*" id="avatar-upload" className="hidden"
                        onChange={(e) => handleFile("avatar", e.target.files?.[0] ?? null)} />
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="avatar-upload"
                          className="flex flex-col items-center justify-center gap-1.5 w-24 h-24 rounded-sm border border-dashed border-[#c89b3c33] bg-[#0a1930] text-[#3e4a5c] cursor-pointer transition-all duration-200 overflow-hidden flex-shrink-0 hover:border-[#c89b3c77] hover:text-[#c89b3c] "
                        >
                          {form.avatarPreview
                            ? <img src={form.avatarPreview} alt="logo" className="w-full h-full object-cover" />
                            : <>
                                <Upload size={16} />
                                <span className="text-[9px] tracking-wider">Logo</span>
                              </>
                          }
                        </label>
                        <p className="text-[11px] text-[#a9b0b8] leading-relaxed ">
                          Hiển thị trên toàn bộ trang giải đấu.<br />
                          <span className="text-[10px] text-[#3e4a5c] tracking-wider">PNG · 512×512 · Nền trong suốt</span>
                        </p>
                      </div>
                    </Field>

                    <Field label="Màu Chủ Đạo" className="mb-0">
                      <div className="flex gap-2.5 items-center">
                        <input
                          type="color"
                          value={form.themeColor}
                          onChange={(e) => set("themeColor", e.target.value)}
                          className="w-11 h-11 rounded-sm border border-[#c89b3c44] bg-[#0a1930] cursor-pointer flex-shrink-0"
                        />
                        <LolInput
                          type="text"
                          value={form.themeColor}
                          onChange={(e) => set("themeColor", e.target.value)}
                          className="font-mono max-w-[130px]"
                        />
                      </div>
                    </Field>
                  </div>

                  {/* Preview */}
                  <Field label="Xem Trước">
                    <div className="flex items-center gap-4 px-5 py-4 rounded-sm border border-[#c89b3c44] bg-[#0a1930]">
                      <div
                        className="w-11 h-11 rounded-sm flex items-center justify-center border flex-shrink-0 bg-gradient-to-br from-[#16264a] to-[#0a1628] transition-all duration-300"
                        style={{
                          borderColor: form.themeColor + "55",
                          boxShadow: `0 0 16px ${form.themeColor}44`,
                        }}
                      >
                        <Trophy size={22} color={form.themeColor} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p
                          className="text-[14px] font-bold tracking-[0.05em]  transition-all duration-300"
                          style={{
                            color: form.themeColor,
                            textShadow: `0 0 20px ${form.themeColor}55`,
                          }}
                        >
                          {form.name || "Tên Giải Đấu"}
                        </p>
                        <p className="mt-1 text-[10px] tracking-[0.12em] uppercase text-[#3e4a5c] ">
                          Tournament Platform ✦ Season 2026
                        </p>
                      </div>
                    </div>
                  </Field>
                </Tabs.Content>

              </div>{/* end content */}
            </Tabs.Root>

            {/* ── FOOTER ─────────────────────────────────────────────────────── */}
            <div className="relative flex justify-between items-center px-7 py-4 bg-gradient-to-b from-[#0a1525] to-[#060e1a] border-t border-[#c89b3c44] flex-shrink-0">
              {/* Top shine */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent" />

              {/* Left decoration */}
              <div className="flex items-center gap-2 opacity-40">
                <Zap size={11} className="text-[#c89b3c]" />
                <span className="text-[8px] tracking-[0.2em] uppercase text-[#c89b3c] ">Riot Games Style</span>
              </div>

              <div className="flex gap-3">
                <Dialog.Close asChild>
                  <button className="px-6 py-2.5 text-[10px] font-bold tracking-[0.14em] uppercase rounded-sm border border-[#c89b3c33] bg-transparent text-[#a9b0b8] cursor-pointer transition-all duration-150 hover:border-[#c89b3c66] hover:text-[#f0e6be] hover:bg-[rgba(200,155,60,0.04)] ">
                    Hủy Bỏ
                  </button>
                </Dialog.Close>

                <button
                  onClick={() => { onSave?.(form); onOpenChange(false); }}
                  className="lol-sheen relative px-7 py-2.5 text-[10px] font-bold tracking-[0.14em] uppercase rounded-sm border border-[#c89b3c] bg-gradient-to-br from-[#1a3a26] to-[#0f2018] text-[#c89b3c] cursor-pointer transition-all duration-200 overflow-hidden shadow-[0_0_14px_rgba(200,155,60,0.15)] hover:shadow-[0_0_24px_rgba(200,155,60,0.3)] hover:text-[#f0e6be] hover:from-[#243d2e] hover:to-[#183020]"
                >
                  ✦ Xác Nhận
                </button>
              </div>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
