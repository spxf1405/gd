import {
  Activity,
  Calendar,
  ChevronRight,
  Trophy,
  User,
  X,
} from "lucide-react";
import { Dialog } from "radix-ui";

const PlayerMatchHistory = () => {
  const matches = [
    {
      id: 1,
      round: "Chung kết",
      opponent: "Dick Jaspers",
      score: "40 - 38",
      status: "LIVE",
      avg: "2.105",
      time: "Đang diễn ra",
    },
    {
      id: 2,
      round: "Bán kết",
      opponent: "Torbjörn Blomdahl",
      score: "50 - 42",
      status: "WIN",
      avg: "1.850",
      time: "Hôm qua",
    },
    {
      id: 3,
      round: "Tứ kết",
      opponent: "Marco Zanetti",
      score: "50 - 30",
      status: "WIN",
      avg: "2.333",
      time: "12/01/2026",
    },
    {
      id: 4,
      round: "Vòng 16",
      opponent: "Cho Myung-woo",
      score: "50 - 48",
      status: "WIN",
      avg: "1.500",
      time: "11/01/2026",
    },
  ];

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="inline-flex !bg-[#151829] items-center gap-2 border border-accent-blue/20 rounded-lg px-3 py-2 text-white !text-sm">
          <Activity className="w-4 h-4" /> Hành trình cơ thủ
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" />

        {/* Tăng width lên max-w-3xl (khoảng 768px) để thoáng hơn nữa */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[101] w-[95%] max-w-3xl translate-x-[-50%] translate-y-[-50%] bg-[#0B1224] border border-blue-900/30 rounded-2xl shadow-2xl outline-none overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header Area - Giảm padding từ p-8 xuống p-5 */}
          <div className="p-5 bg-gradient-to-r from-blue-900/20 to-transparent border-b border-blue-900/20">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-[#0B1224] flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <Dialog.Title className="text-xl font-black text-white uppercase tracking-tight">
                    Trần Quyết Chiến
                  </Dialog.Title>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded uppercase">
                      <Trophy className="w-2.5 h-2.5" /> Hạng 1 Thế giới
                    </span>
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> World Cup 2026
                    </span>
                  </div>
                </div>
              </div>
              <Dialog.Close
                className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                asChild
              >
                <X className="w-6 h-6 text-white stroke-[4] hover:cursor-pointer" />
              </Dialog.Close>
            </div>
          </div>

          {/* Matches List - Giảm padding container và gap giữa các item */}
          <div className="p-4 max-h-[60vh] overflow-y-auto thin-scroll space-y-2.5">
            {matches.map((match) => (
              <div
                key={match.id}
                className={`group relative flex items-center gap-5 p-3.5 rounded-xl border transition-all duration-300 ${
                  match.status === "LIVE"
                    ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]"
                    : "bg-slate-900/30 border-slate-800/60 hover:border-blue-900/50 hover:bg-slate-900/60"
                }`}
              >
                {/* Trạng thái - Giảm min-width và padding-right */}
                <div className="flex flex-col items-center justify-center border-r border-slate-800/80 pr-4 min-w-[70px]">
                  {match.status === "LIVE" ? (
                    <span className="flex items-center gap-1 text-red-500 text-[9px] font-black animate-pulse uppercase">
                      <div className="w-1 h-1 bg-red-500 rounded-full"></div>{" "}
                      LIVE
                    </span>
                  ) : (
                    <span
                      className={`text-[9px] font-black uppercase ${match.status === "WIN" ? "text-emerald-500" : "text-slate-500"}`}
                    >
                      {match.status === "WIN" ? "Thắng" : "Thua"}
                    </span>
                  )}
                  <span className="text-[9px] text-slate-600 font-medium mt-0.5">
                    {match.time}
                  </span>
                </div>

                {/* Thông tin trận đấu - Tận dụng chiều rộng mới */}
                <div className="flex-1 flex items-center justify-between gap-8">
                  <div className="flex-1">
                    <h4 className="text-[9px] text-blue-500 font-bold uppercase tracking-widest mb-0.5">
                      {match.round}
                    </h4>
                    <p className="text-white font-bold text-base group-hover:text-blue-400 transition-colors">
                      vs {match.opponent}
                    </p>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <div className="text-xl font-mono font-black text-white leading-none">
                        {match.score}
                      </div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase mt-1">
                        AVG:{" "}
                        <span className="text-slate-300 font-mono">
                          {match.avg}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-all transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footer - Giảm padding từ p-6 xuống p-4 */}
          <div className="p-4 bg-slate-950/60 border-t border-blue-900/20 flex justify-between items-center">
            <div className="flex gap-8">
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider">
                  Tổng thời gian
                </span>
                <span className="text-white text-xs font-mono font-bold">
                  12h 45m
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider">
                  AVG Tổng
                </span>
                <span className="text-blue-400 text-xs font-mono font-bold">
                  1.942
                </span>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded border border-blue-400/20 hover:bg-blue-500 transition-all uppercase tracking-tighter">
              Chi tiết giải đấu
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export { PlayerMatchHistory };
