import React, { useState, useMemo } from "react";
import { Dialog } from "radix-ui";
import { Users, X, Search, ArrowRight, Shield } from "lucide-react";

const players = [
  { name: "Dương Quốc Hoàng", flag: "vn", title: "Master" },
  { name: "Efren Reyes", flag: "ph", title: "Legend" },
  { name: "Shane Van Boening", flag: "us", title: "Grandmaster" },
  { name: "Joshua Filler", flag: "de", title: "Elite" },
  { name: "Ko Pin Yi", flag: "tw", title: "Elite" },
  { name: "Nguyễn Anh Tuấn", flag: "vn", title: "Pro" },
  // ... data của bro
];

const COUNTRY_NAMES = { vn: "Vietnam", ph: "Philippines", us: "USA", de: "Germany", tw: "Taiwan" };

const LuxuryCard = ({ player }) => {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/[0.03] p-6 transition-all duration-700 hover:bg-[#0f0f0f] hover:border-white/10">
      {/* Thanh chỉ thị mảnh dẻ */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-amber-200/40 transition-all duration-700" />
      
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between items-start">
          <span className="text-[10px] tracking-[0.3em] font-light text-white/30 uppercase group-hover:text-amber-200/60 transition-colors">
            {player.title}
          </span>
          <img 
            src={`https://flagcdn.com/w40/${player.flag}.png`} 
            className="w-5 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
            alt="flag" 
          />
        </div>

        <div className="pt-2">
          <h3 className="text-lg font-extralight tracking-wider text-white group-hover:tracking-[0.12em] transition-all duration-500">
            {player.name.split(' ').map((word, i) => (
              <span key={i} className={i === player.name.split(' ').length - 1 ? "font-medium" : ""}>
                {word}{' '}
              </span>
            ))}
          </h3>
          <p className="text-[9px] font-light uppercase tracking-[0.2em] text-white/20 mt-1">
            {COUNTRY_NAMES[player.flag] || player.flag}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
          <span className="text-[8px] text-amber-200/40 tracking-[0.2em] uppercase">View Profile</span>
          <ArrowRight className="w-3 h-3 text-amber-200/40" />
        </div>
      </div>
    </div>
  );
};

const PlayersDialog = () => {
  const [search, setSearch] = useState("");

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="relative px-12 py-4 bg-transparent border border-white/10 hover:border-amber-200/30 text-white transition-all duration-1000 group overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
          <span className="relative z-10 text-xs font-light tracking-[0.4em] uppercase flex items-center gap-4">
            <div className="w-8 h-[1px] bg-white/20 group-hover:w-12 group-hover:bg-amber-200/50 transition-all duration-700" />
            Curated Athletes
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-sm animate-in fade-in duration-1000" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-full max-w-6xl h-[85vh] bg-[#050505] border border-white/5 flex flex-col focus:outline-none shadow-2xl">
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none" />

          {/* Header Section */}
          <div className="px-12 pt-16 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-amber-200/30" />
                  <span className="text-[10px] font-light tracking-[0.5em] text-white/40 uppercase">Saigon Series</span>
                </div>
                <h2 className="text-5xl font-extralight tracking-tighter text-white">
                  The <span className="font-medium italic">Athletes</span>
                </h2>
              </div>

              <div className="relative group border-b border-white/10 focus-within:border-amber-200/40 transition-all duration-700">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name" 
                  className="bg-transparent pl-8 pr-4 py-3 text-sm font-light tracking-widest text-white outline-none w-64 placeholder:text-white/10 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1 overflow-y-auto px-12 pb-12 custom-scrollbar grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-white/[0.03]">
            {players.map((p, i) => (
              <LuxuryCard key={i} player={p} />
            ))}
          </div>

          {/* Footer */}
          <div className="px-12 py-8 flex justify-between items-center border-t border-white/[0.03]">
             <div className="flex items-center gap-10">
                <div className="flex flex-col">
                   <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] mb-1">Total Entrants</span>
                   <span className="text-sm font-light text-white/60 tracking-widest">{players.length}</span>
                </div>
                <div className="flex flex-col">
                   <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] mb-1">Year</span>
                   <span className="text-sm font-light text-white/60 tracking-widest">2025</span>
                </div>
             </div>
             
             <Dialog.Close className="text-[10px] font-light tracking-[0.3em] text-white/30 hover:text-white transition-colors flex items-center gap-3 group">
                DISMISS <X className="w-3 h-3 group-hover:rotate-90 transition-transform duration-500" />
             </Dialog.Close>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { PlayersDialog };