import { useState, useMemo } from "react";
import { Dialog } from "radix-ui";
import { Users, X, Search, LayoutGrid, List } from "lucide-react";

interface Player {
  name: string;
  code: string;
  country: string;
}

const VIP_PLAYERS: Player[] = [
  { name: "Trần Quyết Chiến", code: "vn", country: "Vietnam" },
  { name: "Bao Phương Vinh", code: "vn", country: "Vietnam" },
  { name: "Trần Thanh Lực", code: "vn", country: "Vietnam" },
  { name: "Chiêm Hồng Thái", code: "vn", country: "Vietnam" },
  { name: "Nguyễn Quốc Nguyện", code: "vn", country: "Vietnam" },
  { name: "Mã Xuân Cường", code: "vn", country: "Vietnam" },
  { name: "Đào Văn Ly", code: "vn", country: "Vietnam" },
  { name: "Dương Anh Vũ", code: "vn", country: "Vietnam" },
  { name: "Joshua Filler", code: "de", country: "Germany" },
  { name: "Shane Van Boening", code: "us", country: "USA" },
  { name: "Francisco Sanchez Ruiz", code: "es", country: "Spain" },
  { name: "Ko Pin Yi", code: "tw", country: "Taiwan" },
  { name: "Jayson Shaw", code: "gb", country: "Great Britain" },
  { name: "Fedor Gorst", code: "ru", country: "Russia" },
  { name: "Albin Ouschan", code: "at", country: "Austria" },
  { name: "Carlo Biado", code: "ph", country: "Philippines" },
];

const ALL_PLAYERS: Player[] = Array.from({ length: 128 }, (_, i) => {
  const base = VIP_PLAYERS[i % VIP_PLAYERS.length];
  return {
    name:
      i < VIP_PLAYERS.length
        ? base.name
        : `${base.name.split(" ").pop()} ${i + 1}`,
    code: base.code,
    country: base.country,
  };
});

const CLIP_SM =
  "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)";
const CLIP_MD =
  "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)";
const CLIP_LG =
  "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";

function ViewToggle({
  compact,
  onToggle,
}: {
  compact: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{ clipPath: CLIP_SM }}
      className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-200"
      title={compact ? "Card view" : "Compact view"}
    >
      <LayoutGrid
        size={12}
        className={!compact ? "text-cyan-400" : "text-gray-700"}
      />
      <div className="relative w-9 h-4 bg-black/60 border border-cyan-400/25 rounded-full overflow-hidden">
        <div
          className={`absolute inset-0 rounded-full transition-all duration-300 ${compact ? "bg-cyan-400/15" : "bg-transparent"}`}
        />
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full transition-all duration-300 ${compact ? "translate-x-[22px] bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.9)]" : "translate-x-0.5 bg-gray-700"}`}
        />
      </div>
      <List size={12} className={compact ? "text-cyan-400" : "text-gray-700"} />
    </button>
  );
}

function CardView({ players }: { players: Player[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
      {players.map((player, i) => (
        <div
          key={i}
          style={{ clipPath: CLIP_MD }}
          className="group relative bg-[#050509]/15 border border-white/[0.06] p-4 transition-all duration-300 hover:border-cyan-400/50 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(0,242,254,0.07)]"
        >
          <span className="absolute top-2 right-3  text-xl text-white/[0.04] group-hover:text-cyan-400/10 transition-colors select-none">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="relative z-10 flex flex-col items-start gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/15 blur-sm group-hover:bg-red-500/35 transition-all" />
              <img
                src={`https://flagcdn.com/w80/${player.code}.png`}
                className="relative h-5 w-auto object-cover border border-white/10"
                alt={player.country}
              />
            </div>
            <div className="w-full border-l-2 border-red-500/50 pl-3 group-hover:border-cyan-400 transition-colors duration-300">
              <h2 className="text-[13px] font-bold uppercase tracking-tight text-white/75 group-hover:text-white transition-colors truncate">
                {player.name}
              </h2>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">
                {player.country}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-6 h-px bg-red-500/50 group-hover:bg-cyan-400 group-hover:w-full transition-all duration-500" />
        </div>
      ))}
    </div>
  );
}

function CompactView({ players }: { players: Player[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
      {players.map((player, i) => (
        <div
          key={i}
          style={{ clipPath: CLIP_SM }}
          className="group relative bg-[#0d121d]/40 border border-white/[0.04] p-2 flex items-center gap-2 transition-all duration-200 hover:border-cyan-400/50 hover:bg-[#151c2b]"
        >
          <img
            src={`https://flagcdn.com/w40/${player.code}.png`}
            className="h-5 w-5 w-auto shrink-0 transition-all"
            alt={player.country}
          />
          <h2 className="text-xs font-semibold uppercase tracking-tight text-gray-300 group-hover:text-white transition-colors truncate">
            {player.name}
          </h2>
          <div className="absolute right-1 bottom-1 w-1 h-1 bg-red-500/40 group-hover:bg-cyan-400 group-hover:shadow-[0_0_5px_rgba(0,242,254,1)] transition-all" />
        </div>
      ))}
    </div>
  );
}

export function PlayersDialog() {
  const [search, setSearch] = useState("");
  const [compact, setCompact] = useState(false);

  const filtered = useMemo(
    () =>
      ALL_PLAYERS.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.country.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          style={{ clipPath: CLIP_MD }}
          className="group px-10 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400  uppercase tracking-[0.4em] hover:bg-cyan-400 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,242,254,0.2)] hover:shadow-[0_0_40px_rgba(0,242,254,0.4)]"
        >
          <span className="flex items-center gap-3 text-sm font-bold">
            <Users size={16} />
            Open Entry List
            <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] group-hover:bg-red-500/30 transition-colors">
              {ALL_PLAYERS.length}
            </span>
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60"  />

        <Dialog.Content
          style={{ clipPath: CLIP_LG }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[96vw] max-w-[1800px] max-h-[88vh] bg-darker-blue/95 border border-cyan-400/20 flex flex-col outline-none shadow-[0_0_80px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-cyan-400/50 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

          <header className="relative px-8 pt-8 pb-6 border-b border-cyan-400/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-red-500 text-[10px] tracking-[0.4em] uppercase mb-2">
                  Tournament Database
                </p>
                <h1 className="text-3xl md:text-4xl uppercase tracking-wider text-white leading-none">
                  WORLD{" "}
                  <span
                    className="text-cyan-400"
                    style={{ textShadow: "0 0 20px rgba(0,242,254,0.6)" }}
                  >
                    POOL
                  </span>{" "}
                  MASTERS
                </h1>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="px-2 py-0.5 bg-red-500 text-[10px] font-bold text-white uppercase tracking-wider">
                    Live Data
                  </span>
                  <span className="text-gray-500 text-[11px]  uppercase tracking-widest">
                    {ALL_PLAYERS.length} Registered Athletes
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <ViewToggle
                  compact={compact}
                  onToggle={() => setCompact((v) => !v)}
                />
                <div
                  style={{ clipPath: CLIP_SM }}
                  className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-cyan-400/20 hover:border-cyan-400/40 transition-colors"
                >
                  <Search size={12} className="text-cyan-400/40 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search player..."
                    className="bg-transparent border-none outline-none text-[12px] text-white w-32 placeholder:text-gray-700 "
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-gray-700 hover:text-white transition-colors"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
                <Dialog.Close
                  style={{ clipPath: CLIP_SM }}
                  className="w-9 h-9 flex items-center justify-center border border-gray-800 text-gray-600 hover:text-red-500 hover:border-red-500/40 transition-all duration-200 hover:rotate-90"
                >
                  <X size={16} />
                </Dialog.Close>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-cyan-400/30 [&::-webkit-scrollbar-thumb]:rounded-full">
            {filtered.length > 0 ? (
              compact ? (
                <CompactView players={filtered} />
              ) : (
                <CardView players={filtered} />
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-700">
                <Search size={32} strokeWidth={1} />
                <p className=" text-xs uppercase tracking-[0.3em]">
                  No players found
                </p>
              </div>
            )}
          </div>

          <footer className="px-8 py-4 border-t border-cyan-400/10 flex items-center justify-between bg-black/20">
            <p className=" text-[9px] text-gray-700 uppercase tracking-[0.5em]">
              Broadcast Core v2.0 //{" "}
              <span className="text-cyan-400/50">Link Established</span> // 2026
            </p>
            <div className="flex items-center gap-3">
              <span className=" text-[10px] text-gray-700">
                {filtered.length} / {ALL_PLAYERS.length}
              </span>
              <div className="flex gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_6px_rgba(0,242,254,0.8)]" />
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse [animation-delay:300ms] shadow-[0_0_6px_rgba(255,0,85,0.8)]" />
              </div>
            </div>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}