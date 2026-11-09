import { useTournamentStore } from "@/store/match";
import { ContextMenu, Popover } from "radix-ui";
import {
  Camera,
  ChevronRight,
  Heart,
  Sword,
  Swords,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";
import { Handle, Position } from "@xyflow/react";
import { useParticipantsByTournamentID } from "../configurations/players/hooks";
import { getPreviousMatchesCompact } from "./nodes";

// Định nghĩa constants nếu chưa có trong scope của bạn
const NODE_WIDTH = 260;
const NODE_HEIGHT = 64;

export const CustomNode = ({ data: nodeData }) => {
  const { id } = useTournamentStore();

  const { data } = useParticipantsByTournamentID({
    tournamentId: id,
  });

  const participants = data?.tournamentParticipants ?? [];

  const { slot1, slot2 } = useMemo(() => {
    if (!nodeData?.match?.displayOrder || !participants.length) {
      return { slot1: 0, slot2: 0 };
    }
    return getPreviousMatchesCompact(
      nodeData.match.displayOrder,
      participants.length,
    );
  }, [nodeData?.match?.displayOrder, participants.length]);

  const playerName = nodeData?.label?.displayName
    ? nodeData.label.displayName
    : nodeData?.isFirstSlot
      ? `Win trận 1 ${slot1}`
      : `Win trận ${slot2}`;

  if (nodeData?.match?.isAutoWin) {
    return null;
  }

  const nationality = nodeData?.label?.nationality?.toLowerCase() ?? "vn";

  return (
    <Popover.Root>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <Popover.Trigger asChild>
            <div
              className="
    group relative z-10 cursor-pointer
    overflow-hidden
    rounded-2xl
    border border-slate-600/70
    bg-[#151C2B]
    shadow-[0_3px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.035)]
    transition-all duration-200 ease-out
    hover:border-sky-400/60
    hover:bg-[#192438]
    hover:shadow-[0_5px_18px_rgba(0,0,0,0.35),0_0_12px_rgba(56,189,248,0.07)]
  "
              style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
            >
              {/* Soft left accent */}
              <div
                className="
    absolute left-0 top-3 bottom-3
    w-[3px] rounded-full
    bg-sky-500/70
    transition-all duration-200
    group-hover:bg-sky-400
  "
              />

              <div className="relative flex h-full items-center gap-3 px-3.5 py-2">
                {/* Match Number */}
                <div
                  className="
      flex shrink-0 items-center justify-center
      rounded-lg border border-slate-700/70
      bg-slate-800/70 px-2 py-1
      font-mono text-xs font-semibold
      text-slate-400
    "
                >
                  #{nodeData?.match?.displayOrder}
                </div>

                {/* Flag */}
                <div
                  className="
      shrink-0 overflow-hidden
      rounded-md
      border border-white/10
      shadow-sm
    "
                >
                  <img
                    src={`https://flagcdn.com/w80/${nationality}.png`}
                    alt="flag"
                    className="h-4 w-7 object-cover"
                  />
                </div>

                {/* Player */}
                <div className="min-w-0 flex-1">
                  <div
                    className="
        truncate text-[13px]
        font-semibold tracking-wide
        text-slate-100
        group-hover:text-white
        transition-colors
      "
                  >
                    {playerName} 123
                  </div>
                </div>

                {/* Live */}

                <div
                  className="
        flex shrink-0 items-center gap-1.5
        rounded-full
        border border-emerald-500/20
        bg-emerald-500/10
        px-2 py-1
      "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span
                    className="
          text-[9px] font-bold
          tracking-wider text-emerald-400
        "
                  >
                    LIVE
                  </span>
                </div>

                {/* Score */}
                <div
                  className="
      flex h-8 min-w-[38px] shrink-0
      items-center justify-center
      rounded-xl
      border border-sky-400/20
      bg-sky-500/10
      px-2
      font-mono text-sm font-bold
      tabular-nums text-sky-300
      transition-all duration-200
      group-hover:border-sky-400/40
      group-hover:bg-sky-500/15
    "
                >
                  {score}
                </div>
              </div>

              {/* Handles */}
              <Handle
                type="source"
                position={
                  nodeData?.match?.side === "left"
                    ? Position.Right
                    : Position.Left
                }
                id="l"
                className="
      !h-2.5 !w-2.5
      !rounded-full
      !border-2 !border-[#151C2B]
      !bg-sky-400
      !shadow-[0_0_0_2px_rgba(56,189,248,0.15)]
    "
              />

              <Handle
                type="target"
                position={
                  nodeData?.match?.side === "left"
                    ? Position.Left
                    : Position.Right
                }
                id="r"
                className="
      !h-2.5 !w-2.5
      !rounded-full
      !border-2 !border-[#151C2B]
      !bg-sky-400
      !shadow-[0_0_0_2px_rgba(56,189,248,0.15)]
    "
              />
            </div>
          </Popover.Trigger>
        </ContextMenu.Trigger>

        {/* Context Menu Content */}
        <ContextMenu.Portal>
          <ContextMenu.Content className="rounded-xl overflow-hidden bg-slate-900/95 backdrop-blur-xl p-2 border border-slate-700/50 shadow-2xl min-w-[200px] text-slate-200 z-50">
            {/* Quick Actions */}
            {[
              { Icon: Sword, color: "text-cyan-400", label: "Chiến thắng" },
              { Icon: Heart, color: "text-red-400", label: "Tỉ lệ chấp" },
            ].map((item, idx) => (
              <ContextMenu.Item
                key={idx}
                className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/10 outline-none"
              >
                <item.Icon
                  className={`w-4 h-4 ${item.color} transition-transform group-hover:scale-110`}
                />
                <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                  {item.label}
                </span>
              </ContextMenu.Item>
            ))}

            <ContextMenu.Separator className="h-[1px] bg-slate-700/60 my-2 mx-1" />

            {/* Submenu: Chụp ảnh */}
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/10 outline-none data-[state=open]:bg-white/10">
                <Camera className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Chụp ảnh
                </span>
                <ChevronRight className="ml-auto w-3.5 h-3.5 text-gray-500" />
              </ContextMenu.SubTrigger>

              <ContextMenu.Portal>
                <ContextMenu.SubContent
                  sideOffset={8}
                  className="bg-slate-900/95 backdrop-blur-xl p-2 rounded-xl border border-slate-700/50 shadow-xl min-w-[240px] z-50"
                >
                  <ContextMenu.Label className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    Phạm vi chụp
                  </ContextMenu.Label>
                  <ContextMenu.Item className="flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-purple-500/10 transition-colors">
                    <UserRound className="w-4 h-4 text-purple-400" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-200">
                        Hành trình cơ thủ
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Tất cả trận đấu của cơ thủ
                      </span>
                    </div>
                  </ContextMenu.Item>
                  <ContextMenu.Item className="flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-purple-500/10 transition-colors">
                    <Swords className="w-4 h-4 text-purple-400" />
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-200">
                        Trận đấu này
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Chỉ hiển thị trận đang chọn
                      </span>
                    </div>
                  </ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Portal>
            </ContextMenu.Sub>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>

      {/* Popover Detail Content */}
      <Popover.Portal>
        <Popover.Content className="overflow-auto bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 text-slate-200 max-w-lg w-full p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">FINISHED</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">9-Ball Pool</span>
            </div>
            <span className="text-slate-500">15/01/2026 • 19:30</span>
          </div>

          <div className="py-4 text-center">
            <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Billiard Championship 2026 - Quarter Finals
            </h2>
            <p className="text-slate-500 text-[11px] mt-1">
              Race to 9 • Best of 17
            </p>

            <div className="grid grid-cols-3 gap-4 items-center mt-4">
              <div className="text-center">
                <img
                  src="https://flagcdn.com/w80/vn.png"
                  alt="VN"
                  className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-blue-500 object-cover"
                />
                <h3 className="text-white font-semibold text-sm">
                  Nguyễn Văn A
                </h3>
                <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded mt-1">
                  WINNER
                </span>
              </div>
              <div className="bg-slate-800/80 rounded-lg py-3 px-2">
                <div className="flex items-center justify-center gap-3 text-3xl font-bold">
                  <span className="text-blue-500">9</span>
                  <span className="text-slate-600 font-normal">-</span>
                  <span className="text-slate-500">7</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Final Score
                </span>
              </div>
              <div className="text-center">
                <img
                  src="https://flagcdn.com/w80/us.png"
                  alt="US"
                  className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-slate-700 object-cover"
                />
                <h3 className="text-slate-300 font-semibold text-sm">
                  John Smith
                </h3>
                <span className="text-slate-500 text-[10px] block mt-1">
                  Seed #3
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Table 3 • Referee: Trần Văn B
            </span>
            <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Chi tiết →
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
