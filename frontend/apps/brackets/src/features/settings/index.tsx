import { useState } from "react";
import { Dialog, Tabs } from "radix-ui";
import {
  X, Trophy, Info, Calendar, MapPin, DollarSign,
  Users, Image as ImageIcon, Upload, Palette, Settings, ShieldCheck,
} from "lucide-react";

// ─── Tab config — 5 tabs từ block 1, accent colors từ block 2 ─────────────────
const TAB_CONFIG = [
  { value: "basic",    label: "Thông tin cơ bản",      sub: "Basic Info", icon: Info,       accent: "#10b981" },
  { value: "schedule", label: "Lịch trình & Địa điểm", sub: "Schedule",   icon: Calendar,   accent: "#f59e0b" },
  { value: "finance",  label: "Tài chính",              sub: "Finance",    icon: DollarSign, accent: "#6366f1" },
  { value: "players",  label: "Người chơi",             sub: "Players",    icon: Users,      accent: "#3b82f6" },
  { value: "media",    label: "Hình ảnh & Theme",       sub: "Media",      icon: ImageIcon,  accent: "#ef4444" },
];

// ─── SidebarTab — design block 2 ──────────────────────────────────────────────
const SidebarTab = ({ tab }) => {
  const Icon = tab.icon;
  return (
    <Tabs.Trigger
      value={tab.value}
      className="group relative w-full text-left outline-none cursor-pointer p-0 bg-transparent border-0"
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-0 transition-all duration-200 scale-y-50 group-data-[state=active]:opacity-100 group-data-[state=active]:scale-y-100"
        style={{ background: `linear-gradient(180deg, ${tab.accent}, ${tab.accent}70)`, boxShadow: `2px 0 10px ${tab.accent}70` }}
      />
      <div className="relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 overflow-hidden hover:bg-white/[0.04]">
        <div className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-200 group-data-[state=active]:opacity-100 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${tab.accent}16 0%, ${tab.accent}08 100%)` }} />
        <div className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none transition-opacity duration-200 group-data-[state=active]:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${tab.accent}35` }} />
        <div className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 bg-white/[0.05] group-hover:bg-white/[0.08] group-data-[state=active]:bg-transparent">
          <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-data-[state=active]:opacity-100"
            style={{ background: `linear-gradient(135deg, ${tab.accent}38, ${tab.accent}18)`, boxShadow: `0 0 18px ${tab.accent}50, inset 0 1px 0 ${tab.accent}30` }} />
          <span className="relative z-10 group-data-[state=active]:hidden"><Icon size={20} color="#9aa4b4" /></span>
          <span className="relative z-10 hidden group-data-[state=active]:inline-flex"><Icon size={20} color={tab.accent} /></span>
        </div>
        <div className="min-w-0 flex-1 relative z-10">
          <p className="text-[14px] font-semibold leading-tight text-[#9aa3b0] transition-colors duration-200 group-hover:text-[#ccd3db] group-data-[state=active]:text-white">
            {tab.label}
          </p>
          <p className="text-[11px] leading-tight mt-0.5">
            <span className="text-[#7a8494] group-data-[state=active]:hidden">{tab.sub}</span>
            <span className="hidden group-data-[state=active]:inline" style={{ color: tab.accent }}>{tab.sub}</span>
          </p>
        </div>
        <div className="relative z-10 flex-shrink-0 w-5 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full opacity-0 scale-50 transition-all duration-200 group-data-[state=active]:opacity-100 group-data-[state=active]:scale-100"
            style={{ background: tab.accent, boxShadow: `0 0 10px ${tab.accent}, 0 0 4px ${tab.accent}` }} />
        </div>
      </div>
    </Tabs.Trigger>
  );
};

// ─── Shared form atoms — styling từ block 2 ───────────────────────────────────
const iBase = "w-full px-3.5 py-2.5 text-[13px] text-white rounded-xl outline-none transition-all duration-150 focus:ring-2 focus:ring-white/10 placeholder-[#4a5568]";
const iSt   = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" };

const LInput    = ({ className = "", ...p }) => <input    className={`${iBase} ${className}`} style={iSt} {...p} />;
const LSelect   = ({ children, className = "", ...p }) => (
  <select className={`${iBase} ${className}`} style={{ ...iSt, appearance: "none" }} {...p}>{children}</select>
);
const LTextarea = ({ className = "", ...p }) => (
  <textarea className={`${iBase} resize-none leading-relaxed ${className}`} style={iSt} {...p} />
);

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold uppercase tracking-[0.09em]" style={{ color: "#9aa4b4" }}>
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const SectionHeader = ({ icon, title, accent = "#10b981" }) => (
  <div className="flex items-center gap-3 pb-3 mb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: accent + "18", border: `1px solid ${accent}30`, color: accent }}>
      {icon}
    </div>
    <h3 className="text-[17px] font-bold text-white" style={{ letterSpacing: "-0.02em" }}>{title}</h3>
  </div>
);

// ─── Tab 1: Thông tin cơ bản — nội dung từ block 1 ───────────────────────────
const BasicTab = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader icon={<Info size={18} />} title="Thông tin cơ bản" accent="#10b981" />
    <Field label="Tên giải đấu" required>
      <LInput value={form.name} onChange={e => set("name", e.target.value)} placeholder="VD: Giải Vô Địch 8-Ball Hà Nội 2026" />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Loại hình" required>
        <LSelect value={form.type} onChange={e => set("type", e.target.value)}>
          {["8-Ball","9-Ball","10-Ball","Carom 3-băng","Snooker"].map(v => <option key={v}>{v}</option>)}
        </LSelect>
      </Field>
      <Field label="Thể thức" required>
        <LSelect value={form.format} onChange={e => set("format", e.target.value)}>
          {["Đơn","Đôi","Đồng đội"].map(v => <option key={v}>{v}</option>)}
        </LSelect>
      </Field>
    </div>
    <Field label="Ban tổ chức" required>
      <LInput value={form.organizer} onChange={e => set("organizer", e.target.value)} placeholder="VD: CLB Billard Golden" />
    </Field>
    <Field label="Mô tả giải đấu">
      <LTextarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Mô tả chi tiết về giải đấu..." />
    </Field>
  </div>
);

// ─── Tab 2: Lịch trình & Địa điểm — nội dung từ block 1 ──────────────────────
const ScheduleTab = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader icon={<Calendar size={18} />} title="Lịch trình & Địa điểm" accent="#f59e0b" />
    <div className="grid grid-cols-2 gap-4">
      <Field label="Ngày bắt đầu" required>
        <LInput type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
      </Field>
      <Field label="Ngày kết thúc" required>
        <LInput type="date" value={form.endDate} onChange={e => set("endDate", e.target.value)} />
      </Field>
    </div>
    <Field label="Địa điểm tổ chức" required>
      <div className="relative">
        <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#f59e0b" }} />
        <LInput value={form.location} onChange={e => set("location", e.target.value)} placeholder="VD: CLB Billard Golden, Hà Nội" className="!pl-9" />
      </div>
    </Field>
    <Field label="Số bàn billard" required>
      <LInput type="number" value={form.tables} onChange={e => set("tables", +e.target.value)} min="1" className="max-w-[160px]" />
    </Field>
  </div>
);

// ─── Tab 3: Tài chính — nội dung từ block 1 ──────────────────────────────────
const FinanceTab = ({ form, set }) => {
  const DIST = { "50-30-20": [0.5,0.3,0.2], "40-25-20-15": [0.4,0.25,0.2,0.15], "35-25-15-15-10": [0.35,0.25,0.15,0.15,0.1] };
  const pcts  = DIST[form.prizeDistribution] || [0.5,0.3,0.2];
  const names = ["🥇 Nhất","🥈 Nhì","🥉 Ba","④ Tư","⑤ Năm"];
  const clrs  = ["#fbbf24","#d4dae3","#fb923c","#b0bac8","#b0bac8"];
  return (
    <div className="flex flex-col gap-5">
      <SectionHeader icon={<DollarSign size={18} />} title="Tài chính" accent="#6366f1" />
      <Field label="Tổng giải thưởng (VNĐ)" required>
        <div className="relative">
          <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#10b981" }} />
          <LInput type="number" value={form.totalPrize} onChange={e => set("totalPrize", +e.target.value)} placeholder="50000000" className="!pl-9" />
        </div>
        {form.totalPrize > 0 && <p className="text-[11px] mt-1" style={{ color: "#6366f1" }}>≈ {form.totalPrize.toLocaleString("vi-VN")} đồng</p>}
      </Field>
      <Field label="Lệ phí tham gia (VNĐ)">
        <LInput type="number" value={form.entryFee} onChange={e => set("entryFee", +e.target.value)} placeholder="500000" />
        {form.entryFee > 0 && <p className="text-[11px] mt-1" style={{ color: "#6366f1" }}>≈ {form.entryFee.toLocaleString("vi-VN")} đồng</p>}
      </Field>
      <Field label="Phân phối giải thưởng">
        <LSelect value={form.prizeDistribution} onChange={e => set("prizeDistribution", e.target.value)}>
          <option value="50-30-20">50% - 30% - 20% (Top 3)</option>
          <option value="40-25-20-15">40% - 25% - 20% - 15% (Top 4)</option>
          <option value="35-25-15-15-10">35% - 25% - 15% - 15% - 10% (Top 5)</option>
        </LSelect>
      </Field>
      {form.totalPrize > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.04)" }}>
          <div className="px-5 py-2.5" style={{ borderBottom: "1px solid rgba(99,102,241,0.12)", background: "rgba(99,102,241,0.08)" }}>
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "#6366f1" }}>Dự kiến giải thưởng</span>
          </div>
          {pcts.map((p, i) => (
            <div key={i} className="flex justify-between items-center px-5 py-3 hover:bg-white/[0.03] transition-colors"
              style={{ borderBottom: i < pcts.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <span className="text-[13px]" style={{ color: "#b0bac8" }}>{names[i]}</span>
              <span className="text-[13px] font-bold" style={{ color: clrs[i] }}>{(form.totalPrize * p).toLocaleString("vi-VN")} đ</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Tab 4: Người chơi — nội dung từ block 1 ─────────────────────────────────
const PlayersTab = ({ form, set }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader icon={<Users size={18} />} title="Cài đặt người chơi" accent="#3b82f6" />
    <Field label="Số lượng người chơi tối đa" required>
      <LSelect value={form.maxPlayers} onChange={e => set("maxPlayers", +e.target.value)} className="max-w-[220px]">
        {[16,32,64,128].map(n => <option key={n} value={n}>{n} người</option>)}
      </LSelect>
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Độ tuổi tối thiểu">
        <LInput type="number" value={form.minAge} onChange={e => set("minAge", +e.target.value)} min="0" />
      </Field>
      <Field label="Giới tính">
        <LSelect value={form.gender} onChange={e => set("gender", e.target.value)}>
          <option>Tất cả</option><option>Nam</option><option>Nữ</option>
        </LSelect>
      </Field>
    </div>
    <Field label="Trình độ">
      <LSelect value={form.skillLevel} onChange={e => set("skillLevel", e.target.value)}>
        <option>Tất cả</option>
        <option>Mới bắt đầu</option>
        <option>Trung bình</option>
        <option>Nâng cao</option>
        <option>Chuyên nghiệp</option>
      </LSelect>
    </Field>
  </div>
);

// ─── Tab 5: Hình ảnh & Theme — nội dung từ block 1 ───────────────────────────
const MediaTab = ({ form, set, handleFile }) => (
  <div className="flex flex-col gap-5">
    <SectionHeader icon={<ImageIcon size={18} />} title="Hình ảnh & Theme" accent="#ef4444" />

    <Field label="Ảnh nền giải đấu">
      <input type="file" accept="image/*" id="bg-upload" className="hidden" onChange={e => handleFile("background", e.target.files?.[0] || null)} />
      <label htmlFor="bg-upload"
        className="flex flex-col items-center justify-center gap-2 h-40 rounded-xl cursor-pointer overflow-hidden transition-all duration-200 hover:bg-white/[0.03]"
        style={{ border: "2px dashed rgba(255,255,255,0.1)" }}>
        {form.backgroundPreview
          ? <img src={form.backgroundPreview} alt="bg" className="w-full h-full object-cover" />
          : <>
              <Upload size={24} style={{ color: "#9aa4b4" }} />
              <p className="text-[12px] font-semibold" style={{ color: "#9aa4b4" }}>Click để tải ảnh nền</p>
              <span className="text-[10px]" style={{ color: "#5a6475" }}>Khuyến nghị: 1920×1080px</span>
            </>}
      </label>
    </Field>

    <Field label="Logo/Avatar giải đấu">
      <input type="file" accept="image/*" id="avatar-upload" className="hidden" onChange={e => handleFile("avatar", e.target.files?.[0] || null)} />
      <div className="flex items-center gap-4">
        <label htmlFor="avatar-upload"
          className="flex flex-col items-center justify-center gap-1 w-28 h-28 flex-shrink-0 rounded-xl cursor-pointer overflow-hidden transition-all duration-150 hover:scale-105"
          style={{ border: "2px dashed rgba(255,255,255,0.1)" }}>
          {form.avatarPreview
            ? <img src={form.avatarPreview} alt="logo" className="w-full h-full object-cover" />
            : <><Upload size={20} style={{ color: "#9aa4b4" }} /><span className="text-[10px]" style={{ color: "#5a6475" }}>Click để tải logo</span></>}
        </label>
        <p className="text-[11px] leading-relaxed" style={{ color: "#9aa4b4" }}>
          Hiển thị trên toàn bộ trang.<br />
          <span className="text-[10px]" style={{ color: "#5a6475" }}>PNG · 512×512 · Transparent</span>
        </p>
      </div>
    </Field>

    <Field label="Màu chủ đạo">
      <div className="flex gap-3 items-center">
        <input type="color" value={form.themeColor} onChange={e => set("themeColor", e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer flex-shrink-0"
          style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.1)" }} />
        <LInput type="text" value={form.themeColor} onChange={e => set("themeColor", e.target.value)} className="font-mono max-w-[130px]" />
      </div>
    </Field>

    <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="text-[10px] font-bold tracking-[0.16em] uppercase mb-3 flex items-center gap-2" style={{ color: "#9aa4b4" }}>
        <Palette size={12} /> Xem trước theme
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${form.themeColor}, #8B5CF6)`, boxShadow: `0 0 16px ${form.themeColor}44` }}>
          <Trophy size={18} color="white" />
        </div>
        <div>
          <p className="text-[14px] font-bold"
            style={{ background: `linear-gradient(to right, ${form.themeColor}, #10B981)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {form.name || "Tên giải đấu"}
          </p>
          <p className="text-[10px]" style={{ color: "#5a6475" }}>Tournament Platform</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main — shell hoàn toàn từ block 2 ───────────────────────────────────────
export const Setting = () => {
  const [form, setForm] = useState({
    name: "", type: "8-Ball", format: "Đơn", organizer: "", description: "",
    startDate: "", endDate: "", location: "", tables: 8,
    totalPrize: 0, entryFee: 0, prizeDistribution: "50-30-20",
    maxPlayers: 32, minAge: 16, gender: "Tất cả", skillLevel: "Tất cả",
    backgroundPreview: "", avatarPreview: "", themeColor: "#00D9FF",
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleFile = (field, file) => {
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => setForm(p => ({ ...p, [`${field}Preview`]: r.result }));
    r.readAsDataURL(file);
  };

  const PANELS = {
    basic:    <BasicTab    form={form} set={set} />,
    schedule: <ScheduleTab form={form} set={set} />,
    finance:  <FinanceTab  form={form} set={set} />,
    players:  <PlayersTab  form={form} set={set} />,
    media:    <MediaTab    form={form} set={set} handleFile={handleFile} />,
  };

  return (
    <>
      <style>{`
        .sys-scroll::-webkit-scrollbar { width: 3px; }
        .sys-scroll::-webkit-scrollbar-track { background: transparent; }
        .sys-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        select option { background: #1a1d27; }
        input[type='date']::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
      `}</style>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 cursor-pointer border-0"
            style={{ background: "linear-gradient(135deg, #1a1d27, #22263a)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <Settings size={14} style={{ color: "#10b981" }} />
            Cài đặt giải đấu
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-200" />

          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col outline-none
              data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-1
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
            style={{ width: "72vw", height: "82vh", borderRadius: "20px", overflow: "hidden", background: "#13151f", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.4)" }}
          >
            <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)", pointerEvents: "none" }} />

            {/* HEADER */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
                </div>
                <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.3),rgba(99,102,241,0.2))", border: "1px solid rgba(16,185,129,0.3)" }}>
                    <Trophy size={17} style={{ color: "#10b981" }} />
                  </div>
                  <div>
                    <Dialog.Title className="text-[14px] font-bold text-white" style={{ letterSpacing: "-0.01em" }}>
                      Cài đặt giải đấu
                    </Dialog.Title>
                    <Dialog.Description className="text-[10px] mt-0.5" style={{ color: "#9aa4b4", letterSpacing: "0.06em" }}>
                      Tùy chỉnh thông tin và cài đặt cho giải đấu của bạn
                    </Dialog.Description>
                  </div>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer border-0"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#8a95a8" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#8a95a8"; }}>
                  <X size={13} />
                </button>
              </Dialog.Close>
            </div>

            {/* BODY */}
            <Tabs.Root defaultValue="basic" className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="flex-shrink-0 flex flex-col sys-scroll overflow-y-auto"
                style={{ width: 330, borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)", padding: "24px 16px" }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a95a8", paddingLeft: 4, marginBottom: 10 }}>
                  Navigation
                </p>
                <Tabs.List className="flex flex-col gap-1.5">
                  {TAB_CONFIG.map(tab => <SidebarTab key={tab.value} tab={tab} />)}
                </Tabs.List>
                <div className="mt-auto pt-4">
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 14 }} />
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 600, color: "#10b981" }}>All Systems Online</p>
                      <p style={{ fontSize: 9, color: "#7ab090", marginTop: 1 }}>99.9% uptime · 30d</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="sys-scroll flex-1 overflow-y-auto" style={{ background: "#13151f" }}>
                {TAB_CONFIG.map(tab => (
                  <Tabs.Content key={tab.value} value={tab.value}
                    className="outline-none p-10 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200">
                    {PANELS[tab.value]}
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>

            {/* FOOTER */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
              <p style={{ fontSize: 10, color: "#8a95a8", letterSpacing: "0.06em" }}>
                LAST SAVED · 14:32:07
              </p>
              <div className="flex gap-2.5">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer border-0"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#b0bac8", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                    Huỷ bỏ
                  </button>
                </Dialog.Close>
                <button className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white transition-all duration-150 cursor-pointer border-0"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 0 20px rgba(16,185,129,0.25), 0 4px 12px rgba(0,0,0,0.3)" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 28px rgba(16,185,129,0.4), 0 4px 12px rgba(0,0,0,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(16,185,129,0.25), 0 4px 12px rgba(0,0,0,0.3)"}>
                  Lưu thay đổi
                </button>
              </div>
            </div>

          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};