import { Handle, Position } from "@xyflow/react";
import {
  ArrowRightLeft,
  Camera,
  Check,
  ChevronRight,
  Download,
  GitBranch,
  Heart,
  ImageDown,
  Network,
  Settings,
  Sword,
  Swords,
  UserRound,
  Volume2,
} from "lucide-react";
import { ContextMenu, Popover } from "radix-ui";
import { FINAL_OF_FINAL_NODE_WIDTH, NODE_HEIGHT, NODE_WIDTH } from "./consts";
import { useParticipantsByTournamentID } from "../configurations/players/hooks";
import { useTournamentStore } from "@/store/match";
import { useMemo } from "react";

export function getPreviousMatchesCompact(
  matchNo: number,
  totalPlayers: number,
) {
  const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(totalPlayers)));
  const round1Matches = totalPlayers - powerOfTwo / 2;

  // Nếu là trận thuộc Vòng 1 -> Không có trận nguồn
  if (matchNo <= round1Matches) {
    return { slot1: null, slot2: null };
  }

  let prevOffset = 0;
  let currentOffset = round1Matches;
  let matchesInRound = powerOfTwo / 4;

  // Tìm offset của vòng chứa matchNo
  while (matchNo > currentOffset + matchesInRound) {
    prevOffset = currentOffset;
    currentOffset += matchesInRound;
    matchesInRound /= 2;
  }

  // k là chỉ số thứ tự của trận đấu trong vòng hiện tại (1-indexed)
  const k = matchNo - currentOffset;

  const slot1 = 2 * k - 1 + prevOffset;
  const slot2 = 2 * k + prevOffset;

  return {
    slot1: slot1 <= currentOffset ? slot1 : null,
    slot2: slot2 <= currentOffset ? slot2 : null,
  };
}

export const CustomNode = (node) => {
  const { data: nodeData } = node;

  const { id } = useTournamentStore();

  const { data } = useParticipantsByTournamentID({
    tournamentId: id,
  });

  const participants = data?.tournamentParticipants ?? [];

  const { slot1, slot2 } = useMemo(() => {
    if (!nodeData.match.displayOrder || !participants.length) {
      return {
        slot1: 0,
        slot2: 0,
      };
    }
    return getPreviousMatchesCompact(
      nodeData.match.displayOrder,
      participants.length,
    );
  }, [node, participants]);

  console.log("nodeData.label?.slot", nodeData.label?.slot);

  const name = nodeData.label?.displayName
    ? nodeData.label.displayName
    : nodeData.isFirstSlot
      ? `Win trận ${slot1}`
      : `Win trận  ${slot2}`;

  console.log("nodeData", nodeData);

  if (nodeData.match.isAutoWin) {
    return <></>;
  }

  return (
    <Popover.Root>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <Popover.Trigger asChild>
            <div
              className="relative bg-gradient-to-b from-[#162032] via-[#0f172a] to-[#0a0f1d] rounded-2xl p-[1px] shadow-[0_10px_35px_-5px_rgba(0,0,0,0.9),0_0_25px_rgba(14,165,233,0.25)] group transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_15px_45px_-5px_rgba(0,0,0,0.95),0_0_35px_rgba(14,165,233,0.45)] z-10 select-none"
              style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
            >
              {/* Lớp viền Gradient bo tròn bao bên ngoài giúp node tách nền cực rõ */}
              <div className="absolute inset-0 rounded-2xl border border-sky-400/30 group-hover:border-sky-400/70 transition-colors pointer-events-none" />

              {/* Highlight ánh sáng mỏng ở mép trên (Top Inner Gloss) */}
              <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-300/40 to-transparent pointer-events-none" />

              {/* Top Badge Bo Tròn Mềm Mại */}
              <div className="absolute -top-3.5 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070b14] border border-sky-400/40 text-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.8)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></span>
                </span>
                <span className="font-extrabold tracking-wider text-emerald-400 uppercase">
                  LIVE
                </span>
                <span className="text-slate-600 font-bold">•</span>
                <span className="font-mono font-bold text-sky-300">
                  M{nodeData.match.displayOrder}
                </span>
              </div>

              {/* Main Content Row */}
              <div className="relative w-full h-full flex items-center justify-between px-4 rounded-2xl bg-[#0d1424]/80 backdrop-blur-sm overflow-hidden">
                {/* Vạch điểm nhấn bo mềm góc trái */}
                <div className="absolute left-0 top-2 bottom-2 w-[4px] bg-gradient-to-b from-sky-400 to-blue-600 rounded-r-full shadow-[0_0_10px_rgba(56,189,248,0.8)]" />

                {/* Left: Flag + Name */}
                <div className="flex items-center gap-3.5 min-w-0 pl-1.5">
                  <div className="shrink-0 w-8 h-5.5 rounded-md overflow-hidden border border-white/20 shadow-md">
                    <img
                      src={`https://flagcdn.com/w80/${nodeData.label?.nationality?.toLowerCase() ?? "vn"}.png`}
                      alt="Flag"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="truncate text-sm font-bold text-slate-100 tracking-wide group-hover:text-white transition-colors">
                    {name ?? ""}
                  </div>
                </div>

                {/* Right: Score Box Bo Tròn Mềm Mại */}
                <div className="min-w-[42px] h-9 px-2 rounded-xl bg-gradient-to-b from-sky-400 to-blue-600 flex items-center justify-center border border-sky-200/50 shadow-[0_4px_12px_rgba(14,165,233,0.4)] group-hover:shadow-[0_4px_18px_rgba(14,165,233,0.7)] shrink-0 transition-all">
                  <span className="font-mono text-lg font-black text-white leading-none">
                    -
                  </span>
                </div>
              </div>

              {/* React Flow Handles */}
              <Handle
                type="source"
                position={
                  nodeData.match.side === "left"
                    ? Position.Right
                    : Position.Left
                }
                id="l"
                className="!w-3.5 !h-3.5 !bg-sky-400 !border-2 !border-[#070b14] shadow-[0_0_10px_rgba(56,189,248,0.9)] !z-30"
              />
              <Handle
                type="target"
                position={
                  nodeData.match.side === "left"
                    ? Position.Left
                    : Position.Right
                }
                id="r"
                className="!w-3.5 !h-3.5 !bg-sky-400 !border-2 !border-[#070b14] shadow-[0_0_10px_rgba(56,189,248,0.9)] !z-30"
              />
            </div>
          </Popover.Trigger>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="rounded-xl overflow-auto thin-scroll bg-gray-900 p-2 border border-gray-700/50 shadow-2xl min-w-[200px]">
            {/* Quick Actions */}
            {[
              {
                Icon: Sword,
                color: "text-cyan-400",
                hoverColor: "group-hover:text-cyan-300",
                label: "Chiến thắng",
              },
              {
                Icon: Heart,
                color: "text-red-400",
                hoverColor: "group-hover:text-red-300",
                label: "Tỉ lệ chấp",
              },
            ].map((item, idx) => (
              <ContextMenu.Item
                key={idx}
                className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-white/10 outline-none focus:bg-white/10"
              >
                <item.Icon
                  className={`w-4 h-4 ${item.color} ${item.hoverColor} transition-transform group-hover:scale-110`}
                />
                <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </ContextMenu.Item>
            ))}

            <ContextMenu.Separator className="h-[1px] bg-gray-700 my-2 mx-1" />

            <ContextMenu.Sub>
              <ContextMenu.SubTrigger className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/10 outline-none data-[state=open]:bg-white/10">
                <Camera className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />

                <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Chụp ảnh
                </span>

                <ChevronRight className="ml-auto w-3.5 h-3.5 text-gray-500" />
              </ContextMenu.SubTrigger>

              <ContextMenu.Portal>
                <ContextMenu.SubContent
                  sideOffset={8}
                  className="bg-gray-900 p-2 rounded-xl border border-gray-700/50 shadow-xl min-w-[250px] z-50"
                >
                  {/* MATCH SCOPE */}
                  <ContextMenu.Label className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    Phạm vi chụp
                  </ContextMenu.Label>

                  <ContextMenu.Item className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-purple-500/10 focus:bg-purple-500/10 transition-colors">
                    <UserRound className="w-4 h-4 text-purple-400" />

                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-gray-200">
                        Hành trình cơ thủ
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Tất cả trận đấu của cơ thủ
                      </span>
                    </div>
                  </ContextMenu.Item>

                  <ContextMenu.Item className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-purple-500/10 focus:bg-purple-500/10 transition-colors">
                    <Swords className="w-4 h-4 text-purple-400" />

                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-gray-200">
                        Trận đấu này
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Chỉ hiển thị trận đang chọn
                      </span>
                    </div>
                  </ContextMenu.Item>

                  <ContextMenu.Separator className="h-px bg-gray-700/70 my-2 mx-1" />

                  {/* BRACKET SCOPE */}
                  <ContextMenu.Label className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    Kèm thông tin nhánh đấu
                  </ContextMenu.Label>

                  <ContextMenu.Item className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-blue-500/10 focus:bg-blue-500/10 transition-colors">
                    <GitBranch className="w-4 h-4 text-blue-400" />

                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-gray-200">
                        Trận đấu và nhánh đấu
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Hiển thị các nhánh liên quan
                      </span>
                    </div>
                  </ContextMenu.Item>

                  <ContextMenu.Item className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-blue-500/10 focus:bg-blue-500/10 transition-colors">
                    <ArrowRightLeft className="w-4 h-4 text-blue-400" />

                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-gray-200">
                        Kèm trận đấu kế tiếp
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Hiển thị cả trận tiếp theo
                      </span>
                    </div>
                  </ContextMenu.Item>

                  <ContextMenu.Item className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-blue-500/10 focus:bg-blue-500/10 transition-colors">
                    <Network className="w-4 h-4 text-blue-400" />

                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm text-gray-200">
                        Toàn bộ vòng đấu
                      </span>
                      <span className="text-[10px] text-gray-500">
                        Tất cả trận đấu trong vòng này
                      </span>
                    </div>
                  </ContextMenu.Item>

                  <ContextMenu.Separator className="h-px bg-gray-700/70 my-2 mx-1" />

                  {/* ACTION */}
                  <ContextMenu.Item className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-emerald-500/10 focus:bg-emerald-500/10 transition-colors">
                    <ImageDown className="w-4 h-4 text-emerald-400" />

                    <span className="text-sm font-medium text-emerald-400">
                      Chụp và tải ảnh
                    </span>

                    <Download className="ml-auto w-3.5 h-3.5 text-emerald-500/60" />
                  </ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Portal>
            </ContextMenu.Sub>

            <ContextMenu.Sub>
              <ContextMenu.SubTrigger className="group flex gap-3 items-center p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/10 outline-none data-[state=open]:bg-white/10">
                <Settings className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-transform group-hover:rotate-45" />
                <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                  Game Settings
                </span>
                <span className="ml-auto text-gray-500 text-[10px]">▶</span>
              </ContextMenu.SubTrigger>

              <ContextMenu.Portal>
                <ContextMenu.SubContent className="bg-gray-900 p-2 rounded-xl border border-gray-700/50 shadow-xl min-w-[180px]">
                  <ContextMenu.Label className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                    Difficulty
                  </ContextMenu.Label>

                  <ContextMenu.RadioGroup>
                    <ContextMenu.RadioItem
                      value="easy"
                      className="flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-green-500/10 focus:bg-green-500/10 text-green-400 transition-colors"
                    >
                      <Check className="w-3 h-3 opacity-0 data-[state=checked]:opacity-100" />
                      <span className="text-sm">Easy Mode</span>
                    </ContextMenu.RadioItem>

                    <ContextMenu.RadioItem
                      value="normal"
                      className="flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-yellow-500/10 focus:bg-yellow-500/10 text-yellow-400 transition-colors"
                    >
                      <Check className="w-3 h-3 opacity-0 data-[state=checked]:opacity-100" />
                      <span className="text-sm">Normal Mode</span>
                    </ContextMenu.RadioItem>
                  </ContextMenu.RadioGroup>

                  <ContextMenu.Separator className="h-[1px] bg-gray-700 my-2 mx-1" />

                  <ContextMenu.CheckboxItem className="flex gap-3 items-center p-2 rounded-lg cursor-pointer outline-none hover:bg-cyan-500/10 focus:bg-cyan-500/10 transition-colors">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-white">Sound Effects</span>
                  </ContextMenu.CheckboxItem>
                </ContextMenu.SubContent>
              </ContextMenu.Portal>
            </ContextMenu.Sub>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <Popover.Portal>
        <Popover.Content className="overflow-auto thin-scroll bg-gray-900">
          <div className="min-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="bg-gray-800 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-semibold text-sm">
                    FINISHED
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-400 text-sm">9-Ball Pool</span>
                </div>
                <div className="text-gray-400 text-sm">15/01/2026 • 19:30</div>
              </div>

              <div className="p-5">
                <div className="text-center mb-4">
                  <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                    Billiard Championship 2026 - Quarter Finals
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">
                    Race to 9 • Best of 17
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center mb-4">
                  <div className="text-center">
                    <img
                      src="https://flagcdn.com/w80/vn.png"
                      alt="VN"
                      className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-blue-500"
                    />
                    <h3 className="text-white font-semibold">Nguyễn Văn A</h3>
                    <p className="text-gray-500 text-xs">Seed #1</p>
                    <div className="mt-2 inline-block bg-emerald-500/10 text-emerald-500 text-xs font-semibold px-2 py-1 rounded">
                      WINNER
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="bg-gray-800 rounded-lg py-4 px-3">
                      <div className="flex items-center justify-center gap-3">
                        <div className="text-4xl font-bold text-blue-500">
                          9
                        </div>
                        <div className="text-2xl text-gray-600">-</div>
                        <div className="text-4xl font-bold text-gray-500">
                          7
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Final Score
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <img
                      src="https://flagcdn.com/w80/us.png"
                      alt="US"
                      className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-700"
                    />
                    <h3 className="text-gray-300 font-semibold">John Smith</h3>
                    <p className="text-gray-500 text-xs">Seed #3</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 px-4 py-2.5 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <div className="text-gray-500">
                    Table 3 • Referee: Trần Văn B
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 font-semibold">
                    View Full Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export const FinalNode = (node) => {
  const { data } = node;
  const isFinal = true;

  return <>1</>;

  return (
    <div
      className="relative flex items-center justify-center p-[2px] overflow-visible"
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
    >
      {/* Glow phía sau - gold cho final */}
      {isFinal && (
        <div className="absolute inset-0 bg-amber-500/30 blur-[40px] rounded-full scale-110" />
      )}

      {/* Khung viền */}
      <div
        className={`relative w-full h-full p-1 flex items-center bg-gray-900/80 backdrop-blur-xl border-y-2 
    ${isFinal ? "border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]" : "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]"}
    before:absolute before:inset-y-0 before:-left-1 before:w-3 before:border-l-4 before:border-inherit
    after:absolute after:inset-y-0 after:-right-1 after:w-3 after:border-r-4 after:border-inherit`}
      >
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-inherit" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-inherit" />
        {/* Số thứ tự */}
        <div className="relative z-10 ml-2">
          <div
            className={`flex items-center justify-center w-10 h-10 clip-path-hexagon font-black text-xl
        ${isFinal ? "bg-amber-500 text-slate-950 shadow-[0_0_10px_white]" : "bg-blue-600 text-white"}`}
          >
            {/* {data.match?.displayOrder} */}
          </div>
        </div>
        Ỏ
        <div className="flex flex-1 items-center px-4 gap-4">
          {/* Flag */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 blur-sm rounded scale-110 group-hover:bg-white/40" />
            {data.flag && (
              <img
                // src={`https://flagcdn.com/w80/${data.flag}.png`}
                alt="Flag"
                className="relative w-12 h-8 object-cover rounded border border-white/30"
              />
            )}
          </div>

          <div className="flex-1">
            <div
              className={`font-black text-lg tracking-widest uppercase italic leading-none
          ${isFinal ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400" : "text-white"}`}
            >
              {data.label} CHAMPIONSHIP ROUND
            </div>
          </div>

          {/* Điểm số */}
          <div className="relative">
            <div
              className={`px-4 py-2 rounded-md font-black text-2xl skew-x-[-12deg] border-2
          ${
            isFinal
              ? "bg-gradient-to-b from-amber-400 to-orange-600 border-yellow-200 text-white shadow-[0_0_15px_rgba(251,191,36,0.8)]"
              : "bg-gradient-to-b from-blue-500 to-indigo-700 border-blue-300 text-white"
          }`}
            >
              12
            </div>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="source"
        position={data.match.side === "left" ? Position.Right : Position.Left}
        className={`!w-3 !h-3 ${isFinal ? "!bg-amber-400" : "!bg-blue-400"}`}
      />
      <Handle
        type="target"
        position={data.match.side === "left" ? Position.Left : Position.Right}
        className={`!w-3 !h-3 ${isFinal ? "!bg-amber-400" : "!bg-blue-400"}`}
      />
    </div>
  );
};

export const FinalOfFinalNode = () => {
  return (
    <div
      className="mx-auto space-y-24"
      style={{ minWidth: FINAL_OF_FINAL_NODE_WIDTH }}
    >
      <section>
        <div className="font-gamer relative w-full bg-slate-950 rounded-3xl p-1 shadow-[0_0_60px_-15px_rgba(251,191,36,0.5)] border border-slate-800 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-amber-500/10 blur-[120px]"></div>

          <div className="relative z-10 p-8 border border-white/5 rounded-[22px]">
            <div className="text-center mb-10">
              <div className="inline-block bg-amber-600 px-4 py-1 text-[10px] font-black italic tracking-[0.3em] text-white mb-2 rounded-sm">
                PREMIUM EVENT
              </div>
              <h1 className="text-white text-5xl font-black italic uppercase tracking-tighter drop-shadow-sm">
                World <span className="text-amber-400">9-Ball</span>{" "}
                Championship
              </h1>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center bg-gradient-to-r from-blue-900/80 to-slate-900 p-4 rounded-xl border-l-4 border-blue-500 shadow-lg">
                <img
                  src="https://flagcdn.com/vn.svg"
                  className="w-14 h-10 object-cover rounded shadow-md border border-white/10"
                  alt="VN"
                />
                <div className="ml-4">
                  <p className="text-white text-2xl font-black italic uppercase tracking-tight">
                    DUC ANH
                  </p>
                  <p className="text-blue-400 text-[10px] font-bold tracking-[0.2em]">
                    CHALLENGER
                  </p>
                </div>
                <div className="ml-auto text-5xl font-black text-white px-4">
                  08
                </div>
              </div>

              <div className="flex flex-col items-center px-4 relative">
                <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce mb-2">
                  🏆
                </div>
                <div className="text-white/20 font-black text-xl italic uppercase">
                  VS
                </div>
              </div>

              <div className="flex-1 flex flex-row-reverse items-center bg-gradient-to-l from-amber-900/60 to-slate-900 p-4 rounded-xl border-r-4 border-amber-500 shadow-lg">
                <img
                  src="https://flagcdn.com/us.svg"
                  className="w-14 h-10 object-cover rounded shadow-md border border-white/10"
                  alt="US"
                />
                <div className="mr-4 text-right">
                  <p className="text-white text-2xl font-black italic uppercase tracking-tight">
                    F. SANCHEZ
                  </p>
                  <p className="text-amber-400 text-[10px] font-bold tracking-[0.2em]">
                    DEFENDING CHAMP
                  </p>
                </div>
                <div className="mr-auto text-5xl font-black text-white px-4">
                  10
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 border-t border-white/10 pt-6">
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Thể thức
                </p>
                <p className="text-white font-bold text-lg italic uppercase">
                  9 bi Quốc tế - Xếp cao - Thắng phá
                </p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Race To
                </p>
                <p className="text-amber-500 font-black text-3xl italic leading-none">
                  13
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <span className="text-white font-black text-sm tracking-tighter uppercase">
                    Live Stream
                  </span>
                </div>
                <p className="text-slate-500 text-[10px] font-bold">
                  YOUTUBE / FACEBOOK
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
