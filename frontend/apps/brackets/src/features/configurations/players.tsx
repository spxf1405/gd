import { Users, X, Search, ChevronDown } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState, useMemo } from "react";

const players = [
  { name: "Dương Quốc Hoàng", flag: "vn" },
  { name: "Nguyễn Anh Tuấn", flag: "vn" },
  { name: "Đặng Thành Kiên", flag: "vn" },
  { name: "Lường Đức Thiện", flag: "vn" },
  { name: "Đỗ Thế Kiên", flag: "vn" },
  { name: "Phạm Phương Nam", flag: "vn" },
  { name: "Tạ Văn Linh", flag: "vn" },
  { name: "Efren Reyes", flag: "ph" },
  { name: "Francisco Sanchez Ruiz", flag: "es" },
  { name: "Shane Van Boening", flag: "us" },
  { name: "Joshua Filler", flag: "de" },
  { name: "Fednor Gorst", flag: "us" },
  { name: "Jayson Shaw", flag: "gb" },
  { name: "Albin Ouschan", flag: "at" },
  { name: "Ko Pin Yi", flag: "tw" },
  { name: "Ko Ping Chung", flag: "tw" },
  { name: "Carlo Biado", flag: "ph" },
  { name: "Johann Chua", flag: "ph" },
  { name: "James Aranas", flag: "ph" },
  { name: "Eklent Kaci", flag: "al" },
  { name: "David Alcaide", flag: "es" },
  { name: "Mario He", flag: "at" },
  { name: "Alexander Kazakis", flag: "gr" },
  { name: "Aloysius Yapp", flag: "sg" },
  { name: "Naoyuki Oi", flag: "jp" },
  { name: "Skyler Woodward", flag: "us" },
  { name: "Tyler Styer", flag: "us" },
  { name: "Billy Thorpe", flag: "us" },
  { name: "Wu Kun Lin", flag: "tw" },
  { name: "Chang Jung Lin", flag: "tw" },
  { name: "Chang Yu Lung", flag: "tw" },
  { name: "Wiktor Zielinski", flag: "pl" },
  { name: "Konrad Juszczyszyn", flag: "pl" },
  { name: "Mieszko Fortunski", flag: "pl" },
  { name: "Wojciech Szewczyk", flag: "pl" },
  { name: "Niels Feijen", flag: "nl" },
  { name: "Marc Bijsterbosch", flag: "nl" },
  { name: "Oliver Szolnoki", flag: "hu" },
  { name: "Ralf Souquet", flag: "de" },
  { name: "Thorsten Hohmann", flag: "de" },
  { name: "Mika Immonen", flag: "fi" },
  { name: "Darren Appleton", flag: "gb" },
  { name: "Alex Pagulayan", flag: "ca" },
  { name: "John Morra", flag: "ca" },
  { name: "Roland Garcia", flag: "ph" },
  { name: "Lee Van Corteza", flag: "ph" },
  { name: "Dennis Orcollo", flag: "ph" },
  { name: "Roberto Gomez", flag: "ph" },
  { name: "Bader Alawadhi", flag: "kw" },
  { name: "Mohammad Soufi", flag: "sy" },
  { name: "Sanjin Pehlivanovic", flag: "ba" },
];

// De-duplicate
const uniquePlayers = Array.from(
  new Map(players.map((p) => [p.name + p.flag, p])).values()
);

const COUNTRY_NAMES = {
  vn: "Việt Nam", ph: "Philippines", us: "USA", de: "Germany",
  gb: "Great Britain", at: "Austria", tw: "Taiwan", al: "Albania",
  es: "Spain", gr: "Greece", sg: "Singapore", jp: "Japan",
  pl: "Poland", nl: "Netherlands", hu: "Hungary", fi: "Finland",
  ca: "Canada", kw: "Kuwait", sy: "Syria", ba: "Bosnia",
};

// --- Player Card ---
const PlayerCard = ({ player }) => {
  const isVN = player.flag === "vn";

  return (
    <div
      className={[
        "group relative flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-default",
        "border transition-all duration-200 overflow-hidden",
        isVN
          ? "bg-dark-surface border-cyber-green/20 hover:border-cyber-green/60 hover:bg-cyber-green/5"
          : "bg-dark-surface border-accent-blue/15 hover:border-accent-blue/50 hover:bg-medium-blue/60",
      ].join(" ")}
    >
      {/* left accent bar */}
      <span
        className={[
          "absolute left-0 top-0 bottom-0 w-[2px] rounded-r transition-opacity duration-200 opacity-0 group-hover:opacity-100",
          isVN ? "bg-cyber-green" : "bg-accent-blue",
        ].join(" ")}
      />

      <img
        src={`https://flagcdn.com/w80/${player.flag}.png`}
        className="w-8 h-5 object-cover rounded shadow-sm shrink-0"
        alt={player.flag}
      />

      <div className="flex-1 min-w-0">
        <p
          className={[
            "text-[11px] font-semibold uppercase tracking-wide truncate transition-colors duration-200",
            isVN
              ? "text-slate-300 group-hover:text-cyber-green"
              : "text-slate-300 group-hover:text-accent-blue",
          ].join(" ")}
        >
          {player.name}
        </p>
        <p className="text-[9px] text-slate-600 uppercase tracking-wider truncate mt-0.5">
          {COUNTRY_NAMES[player.flag] || player.flag.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

// --- Section Divider ---
const SectionDivider = ({ label, count }) => (
  <div className="flex items-center gap-3 mb-3 mt-5 first:mt-0">
    <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-accent-blue/50 whitespace-nowrap">
      {label}
    </span>
    <span className="text-[9px] font-semibold text-accent-blue/30 bg-accent-blue/5 border border-accent-blue/15 rounded-full px-2 py-0.5">
      {count}
    </span>
    <div className="flex-1 h-px bg-accent-blue/10" />
  </div>
);

// --- Main Dialog ---
const PlayersDialog = () => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return uniquePlayers;
    return uniquePlayers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (COUNTRY_NAMES[p.flag] || "").toLowerCase().includes(q) ||
        p.flag.includes(q)
    );
  }, [search]);

  const vnPlayers = filtered.filter((p) => p.flag === "vn");
  const intlPlayers = filtered.filter((p) => p.flag !== "vn");

  return (
    <Dialog.Root>
      {/* Trigger */}
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 bg-darker-surface border border-accent-blue/20 hover:border-accent-blue/50 hover:bg-dark-blue text-white text-sm rounded-lg px-3 py-2 transition-all duration-200">
          <Users className="h-4 w-4 text-accent-blue" />
          Danh sách cơ thủ
        </button>
      </Dialog.Trigger>

      {/* Portal */}
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-dark-bg/80 backdrop-blur-sm" />

        {/* Content */}
        <Dialog.Content
          className={[
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "w-[95vw] max-w-5xl max-h-[90vh]",
            "bg-dark-bg border border-accent-blue/25 rounded-2xl",
            "flex flex-col overflow-hidden",
            "shadow-[0_0_60px_rgba(66,153,225,0.12),0_0_0_1px_rgba(66,153,225,0.08)]",
            "focus:outline-none",
          ].join(" ")}
        >
          {/* ── Header ── */}
          <div className="relative flex items-center justify-between gap-4 px-6 py-4 border-b border-accent-blue/20 bg-darker-blue shrink-0">
            {/* subtle top highlight */}
            <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />

            <div className="flex items-center gap-4">
              {/* WPA logo */}
              <div className="hidden sm:flex items-center justify-center bg-white rounded-lg px-3 py-1.5 shadow-sm shrink-0">
                <img
                  src="https://www.wpa-pool.com/wp-content/uploads/2021/04/WPA-Logo-300x164.png"
                  className="h-8 w-auto"
                  alt="WPA"
                />
              </div>

              {/* Title */}
              <div>
                <Dialog.Title className="text-base sm:text-xl font-black italic tracking-tighter uppercase leading-none">
                  <span className="text-accent-blue drop-shadow-[0_0_8px_rgba(66,153,225,0.5)]">
                    PREDATOR{" "}
                  </span>
                  <span className="text-white">WORLD CHAMPIONSHIP</span>
                </Dialog.Title>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-accent-blue/60 mt-1.5">
                  17 – 19 Sep 2025 &nbsp;·&nbsp; Ho Chi Minh City
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Player count badge */}
              <span className="hidden sm:inline-flex text-[11px] font-semibold text-accent-blue bg-accent-blue/10 border border-accent-blue/20 rounded-full px-3 py-1">
                {filtered.length} players
              </span>

              {/* Close */}
              <Dialog.Close asChild>
                <button className="p-1.5 rounded-lg border border-white/10 text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* ── Search Bar ── */}
          <div className="px-6 py-3 border-b border-accent-blue/10 bg-darker-blue/60 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc quốc gia..."
                className="w-full bg-dark-surface border border-accent-blue/15 focus:border-accent-blue/45 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 outline-none transition-colors"
              />
            </div>
          </div>

          {/* ── Player Grid ── */}
          <div className="flex-1 overflow-y-auto px-6 py-4 thin-scroll">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-600">
                <Search className="w-8 h-8 opacity-30" />
                <p className="text-sm">Không tìm thấy cơ thủ nào</p>
              </div>
            ) : (
              <>
                {vnPlayers.length > 0 && (
                  <>
                    <SectionDivider label="Đội tuyển Việt Nam" count={vnPlayers.length} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-2">
                      {vnPlayers.map((p, i) => (
                        <PlayerCard key={p.name + i} player={p} />
                      ))}
                    </div>
                  </>
                )}

                {intlPlayers.length > 0 && (
                  <>
                    <SectionDivider label="Quốc tế" count={intlPlayers.length} />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {intlPlayers.map((p, i) => (
                        <PlayerCard key={p.name + i} player={p} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-accent-blue/10 bg-darker-blue/60 shrink-0">
            <div className="flex gap-1.5">
              {[true, false, false, false].map((active, i) => (
                <div
                  key={i}
                  className={[
                    "h-1.5 rounded-full transition-all",
                    active
                      ? "w-6 bg-accent-blue/60"
                      : "w-1.5 bg-medium-blue",
                  ].join(" ")}
                />
              ))}
            </div>
            <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-700">
              Predator 10-Ball World Championship
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { PlayersDialog };