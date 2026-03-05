import { Dialog, Tabs } from "radix-ui";
import { X, LayoutDashboard, ShoppingCart, TrendingUp, ShieldCheck } from "lucide-react";

/* ─── Design direction: Editorial Luxury Dark ─────────────────────────────────
   Charcoal/slate base, emerald accents, DM Mono for numbers/labels,
   Fraunces for display, clean density with surgical spacing.
   Tab triggers: pill-shaped with colored glow, icon backdrop blur.
   ─────────────────────────────────────────────────────────────────────────── */

const TAB_CONFIG = [
  {
    value: "tab1",
    label: "Tổng quan",
    sub: "Overview",
    icon: LayoutDashboard,
    accent: "#10b981",   // emerald
    glow: "rgba(16,185,129,0.18)",
    dimGlow: "rgba(16,185,129,0.07)",
  },
  {
    value: "tab2",
    label: "Đơn hàng",
    sub: "Orders",
    icon: ShoppingCart,
    accent: "#f59e0b",   // amber
    glow: "rgba(245,158,11,0.18)",
    dimGlow: "rgba(245,158,11,0.07)",
  },
  {
    value: "tab3",
    label: "Tăng trưởng",
    sub: "Growth",
    icon: TrendingUp,
    accent: "#6366f1",   // indigo
    glow: "rgba(99,102,241,0.18)",
    dimGlow: "rgba(99,102,241,0.07)",
  },
  {
    value: "tab4",
    label: "Bảo mật",
    sub: "Security",
    icon: ShieldCheck,
    accent: "#ef4444",   // red
    glow: "rgba(239,68,68,0.18)",
    dimGlow: "rgba(239,68,68,0.07)",
  },
];

/* ── Minimal stat card used in content ── */
const StatCard = ({ label, value, delta, color }) => (
  <div
    className="relative rounded-xl p-4 flex flex-col gap-2 overflow-hidden"
    style={{ background: "#1a1d27", border: "1px solid rgba(255,255,255,0.06)" }}
  >
    <div
      className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl pointer-events-none"
      style={{ background: color + "18", transform: "translate(30%,-30%)" }}
    />
    <span className="text-[10px] font-semibold tracking-[0.16em] uppercase" style={{ color: "#8a95a8" }}>
      {label}
    </span>
    <span className="text-[32px] font-bold text-white leading-none">
      {value}
    </span>
    {delta && (
      <span className="text-[11px] font-medium" style={{ color }}>
        {delta}
      </span>
    )}
  </div>
);

/* ── Toggle switch ── */
const Toggle = ({ label, sub, defaultOn = false }) => {
  return (
    <div className="flex items-center justify-between py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <p className="text-[13px] font-medium text-white">{label}</p>
        {sub && <p className="text-[11px] mt-0.5" style={{ color: "#8a95a8" }}>{sub}</p>}
      </div>
      <div
        className="relative w-9 h-5 rounded-full cursor-pointer transition-all duration-300 flex-shrink-0"
        style={{ background: defaultOn ? "#10b981" : "#2a2d3a", boxShadow: defaultOn ? "0 0 10px rgba(16,185,129,0.4)" : "none" }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm"
          style={{ left: defaultOn ? "calc(100% - 18px)" : "2px" }}
        />
      </div>
    </div>
  );
};

/* ── Custom sidebar tab trigger ── */
const SidebarTab = ({ tab }) => {
  const Icon = tab.icon;
  return (
    <Tabs.Trigger
      value={tab.value}
      className="group relative w-full text-left outline-none cursor-pointer"
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-0 transition-all duration-200 scale-y-50 group-data-[state=active]:opacity-100 group-data-[state=active]:scale-y-100"
        style={{
          background: `linear-gradient(180deg, ${tab.accent}, ${tab.accent}70)`,
          boxShadow: `2px 0 10px ${tab.accent}70`,
        }}
      />

      <div className="relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 overflow-hidden hover:bg-white/[0.04]">
        {/* Active background fill */}
        <div
          className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-200 group-data-[state=active]:opacity-100 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${tab.accent}16 0%, ${tab.accent}08 100%)` }}
        />
        {/* Active border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none transition-opacity duration-200 group-data-[state=active]:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${tab.accent}35` }}
        />

        {/* Icon box */}
        <div className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 bg-white/[0.05] group-hover:bg-white/[0.08] group-data-[state=active]:bg-transparent">
          {/* Colored bg for active */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-data-[state=active]:opacity-100"
            style={{
              background: `linear-gradient(135deg, ${tab.accent}38, ${tab.accent}18)`,
              boxShadow: `0 0 18px ${tab.accent}50, inset 0 1px 0 ${tab.accent}30`,
            }}
          />
          {/* Icon — inactive */}
          <span className="relative z-10 group-data-[state=active]:hidden">
            <Icon size={20} color="#9aa4b4" />
          </span>
          {/* Icon — active colored */}
          <span className="relative z-10 hidden group-data-[state=active]:inline-flex">
            <Icon size={20} color={tab.accent} />
          </span>
        </div>

        {/* Labels */}
        <div className="min-w-0 flex-1 relative z-10">
          <p className="text-[14px] font-semibold leading-tight text-[#9aa3b0] transition-colors duration-200 group-hover:text-[#ccd3db] group-data-[state=active]:text-white">
            {tab.label}
          </p>
          <p className="text-[11px] leading-tight mt-0.5">
            <span className="text-[#7a8494] group-data-[state=active]:hidden">{tab.sub}</span>
            <span className="hidden group-data-[state=active]:inline" style={{ color: tab.accent }}>{tab.sub}</span>
          </p>
        </div>

        {/* Glowing dot */}
        <div className="relative z-10 flex-shrink-0 w-5 flex items-center justify-center">
          <div
            className="w-2 h-2 rounded-full opacity-0 scale-50 transition-all duration-200 group-data-[state=active]:opacity-100 group-data-[state=active]:scale-100"
            style={{ background: tab.accent, boxShadow: `0 0 10px ${tab.accent}, 0 0 4px ${tab.accent}` }}
          />
        </div>
      </div>
    </Tabs.Trigger>
  );
};

/* ── Tab content panels ── */
const OverviewContent = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h3 className="text-[22px] font-bold text-white mb-0.5" style={{ letterSpacing: "-0.02em" }}>
        Dashboard Overview
      </h3>
      <p className="text-[13px]" style={{ color: "#8a95a8" }}>Real-time metrics · Last synced 2 min ago</p>
    </div>
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Revenue" value="₫ 4.2M" delta="↑ 12.4% this week" color="#10b981" />
      <StatCard label="Orders" value="1,847" delta="↑ 8.1% vs last week" color="#f59e0b" />
      <StatCard label="Uptime" value="99.9%" delta="30-day average" color="#6366f1" />
    </div>
    <div
      className="rounded-xl p-4"
      style={{ background: "#1a1d27", border: "1px solid rgba(16,185,129,0.15)", borderLeft: "3px solid #10b981" }}
    >
      <p className="text-[12px] font-semibold text-white mb-1">System Status</p>
      <p className="text-[12px] leading-relaxed" style={{ color: "#b0bac8" }}>
        All services running normally. Dashboard được thiết kế tối ưu cho trải nghiệm người dùng ban đêm.
        Dữ liệu được cập nhật theo thời gian thực từ các API nội bộ.
      </p>
    </div>
  </div>
);

const OrdersContent = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h3 className="text-[22px] font-bold text-white mb-0.5" style={{ letterSpacing: "-0.02em" }}>
        Orders Management
      </h3>
      <p className="text-[13px]" style={{ color: "#8a95a8" }}>Quản lý và theo dõi đơn hàng</p>
    </div>
    {[
      { id: "#ORD-2891", status: "Completed", amount: "₫ 320,000", time: "2 min ago", color: "#10b981" },
      { id: "#ORD-2890", status: "Processing", amount: "₫ 150,000", time: "15 min ago", color: "#f59e0b" },
      { id: "#ORD-2889", status: "Pending",    amount: "₫ 870,000", time: "1 hr ago",  color: "#6366f1" },
      { id: "#ORD-2888", status: "Cancelled",  amount: "₫ 45,000",  time: "3 hr ago",  color: "#ef4444" },
    ].map((o) => (
      <div key={o.id} className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 hover:bg-white/[0.03]"
        style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: o.color, boxShadow: `0 0 8px ${o.color}` }} />
        <span className="text-[12px] font-semibold flex-1" style={{ color: "#e2e6ec" }}>{o.id}</span>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full" style={{ background: o.color + "18", color: o.color }}>{o.status}</span>
        <span className="text-[12px] font-medium" style={{ color: "#b0bac8" }}>{o.amount}</span>
        <span className="text-[10px]" style={{ color: "#8a95a8" }}>{o.time}</span>
      </div>
    ))}
  </div>
);

const GrowthContent = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h3 className="text-[22px] font-bold text-white mb-0.5" style={{ letterSpacing: "-0.02em" }}>
        Growth Analytics
      </h3>
      <p className="text-[13px]" style={{ color: "#8a95a8" }}>Phân tích tăng trưởng theo thời gian</p>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "MoM Growth", value: "+18.4%", color: "#6366f1" },
        { label: "YoY Growth", value: "+142%",  color: "#6366f1" },
        { label: "New Users",  value: "3,291",   color: "#6366f1" },
        { label: "Churn Rate", value: "2.1%",    color: "#ef4444" },
      ].map((m) => (
        <StatCard key={m.label} label={m.label} value={m.value} color={m.color} />
      ))}
    </div>
  </div>
);

const SecurityContent = () => (
  <div className="flex flex-col gap-5">
    <div>
      <h3 className="text-[22px] font-bold text-white mb-0.5" style={{ letterSpacing: "-0.02em" }}>
        Security Center
      </h3>
      <p className="text-[13px]" style={{ color: "#8a95a8" }}>Thiết lập xác thực và quản lý phiên</p>
    </div>
    <div className="flex flex-col">
      <Toggle label="Xác thực 2 yếu tố" sub="Yêu cầu OTP khi đăng nhập" defaultOn={true} />
      <Toggle label="Phiên tự động hết hạn" sub="Sau 30 phút không hoạt động" defaultOn={true} />
      <Toggle label="Thông báo đăng nhập lạ" sub="Gửi email khi phát hiện IP mới" defaultOn={false} />
      <Toggle label="Chế độ audit log" sub="Ghi lại toàn bộ thao tác admin" defaultOn={false} />
    </div>
    <div
      className="rounded-xl p-4 flex items-start gap-3"
      style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)" }}
    >
      <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#ef4444" }} />
      <p className="text-[12px] leading-relaxed" style={{ color: "#b0bac8" }}>
        Phiên đăng nhập cuối: <span style={{ color: "#ef4444" }}>192.168.1.42</span> · 2 giờ trước · Hà Nội, VN
      </p>
    </div>
  </div>
);

const CONTENT_MAP = {
  tab1: <OverviewContent />,
  tab2: <OrdersContent />,
  tab3: <GrowthContent />,
  tab4: <SecurityContent />,
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export const Setting = () => {
  return (
    <>
      <style>{`
        .sys-scroll::-webkit-scrollbar { width: 3px; }
        .sys-scroll::-webkit-scrollbar-track { background: transparent; }
        .sys-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>

      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 cursor-pointer border-0"
            style={{
              background: "linear-gradient(135deg, #1a1d27, #22263a)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
          >
            <LayoutDashboard size={15} style={{ color: "#10b981" }} />
            Mở Cấu Hình Hệ Thống
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-200" />

          <Dialog.Content
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col outline-none
              data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-1
              data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
              duration-200"
            style={{
              width: "72vw",
              height: "72vh",
              borderRadius: "20px",
              overflow: "hidden",
              background: "#13151f",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.4)",
            }}
          >
            {/* subtle top highlight */}
            <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)", pointerEvents:"none" }} />

            {/* ── HEADER ── */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
            >
              <div className="flex items-center gap-3.5">
                {/* macOS-style traffic lights */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
                </div>
                <div className="w-px h-5" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div>
                  <Dialog.Title className="text-[14px] font-bold text-white" style={{ letterSpacing: "-0.01em" }}>
                    Hệ Thống Quản Trị
                  </Dialog.Title>
                  <Dialog.Description className="text-[10px] mt-0.5" style={{ color: "#9aa4b4", letterSpacing: "0.06em" }}>
                    SYSTEM · CONFIGURATION · v2.4.1
                  </Dialog.Description>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer border-0"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#8a95a8" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#8a95a8"; }}
                >
                  <X size={13} />
                </button>
              </Dialog.Close>
            </div>

            {/* ── BODY ── */}
            <Tabs.Root defaultValue="tab1" className="flex flex-1 overflow-hidden">

              {/* ── Sidebar ── */}
              <div
                className="flex-shrink-0 flex flex-col"
                style={{ width: 330, borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)", padding: "24px 16px" }}
              >
                {/* section label */}
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a95a8", paddingLeft: 4, marginBottom: 10 }}>
                  Navigation
                </p>

                <Tabs.List className="flex flex-col gap-1.5">
                  {TAB_CONFIG.map((tab) => (
                    <SidebarTab key={tab.value} tab={tab} />
                  ))}
                </Tabs.List>

                {/* bottom badge */}
                <div className="mt-auto pt-4">
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 14 }} />
                  <div
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#10b981", boxShadow: "0 0 8px #10b981", animation: "pulse 2s infinite" }} />
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 600, color: "#10b981" }}>All Systems Online</p>
                      <p style={{ fontSize: 9, color: "#7ab090", marginTop: 1 }}>99.9% uptime · 30d</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Content ── */}
              <div className="sys-scroll flex-1 overflow-y-auto" style={{ background: "#13151f" }}>
                {TAB_CONFIG.map((tab) => (
                  <Tabs.Content
                    key={tab.value}
                    value={tab.value}
                    className="outline-none h-full p-10 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
                  >
                    {CONTENT_MAP[tab.value]}
                  </Tabs.Content>
                ))}
              </div>
            </Tabs.Root>

            {/* ── FOOTER ── */}
            <div
              className="flex-shrink-0 flex items-center justify-between px-6 py-3.5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}
            >
              <p style={{ fontSize: 10, color: "#8a95a8", letterSpacing: "0.06em" }}>
                LAST SAVED · 14:32:07
              </p>
              <div className="flex gap-2.5">
                <Dialog.Close asChild>
                  <button
                    className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all duration-150 cursor-pointer border-0"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#b0bac8", border: "1px solid rgba(255,255,255,0.08)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.09)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  >
                    Huỷ bỏ
                  </button>
                </Dialog.Close>
                <button
                  className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white transition-all duration-150 cursor-pointer border-0"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    boxShadow: "0 0 20px rgba(16,185,129,0.25), 0 4px 12px rgba(0,0,0,0.3)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 28px rgba(16,185,129,0.4), 0 4px 12px rgba(0,0,0,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 20px rgba(16,185,129,0.25), 0 4px 12px rgba(0,0,0,0.3)"}
                >
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