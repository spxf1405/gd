import { Handle, Position } from "@xyflow/react";
import {
  Check,
  Heart,
  Image,
  Lightbulb,
  Settings,
  Shield,
  Sword,
  Volume2,
} from "lucide-react";
import { ContextMenu, Popover } from "radix-ui";
import { FINAL_OF_FINAL_NODE_WIDTH, NODE_HEIGHT, NODE_WIDTH } from "./consts";
import { isBye } from "./helper/player";

export const CustomNode = (node) => {
  const { data } = node;

  if (isBye(data?.match.players[0]) || isBye(data.match.players[1])) {
    return null;
  }

  return (
    <Popover.Root>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <Popover.Trigger asChild>
            <div
              className="relative flex items-center justify-between gap-4 p-3 bg-[#0a0a0d] border-4 border-blue-600 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.6),inset_0_0_15px_rgba(37,99,235,0.3)]"
              style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
            >
              <div className="absolute top-2 right-2 flex items-center space-x-1">
                <span className="inline-flex h-3 w-3 rounded-full bg-green-500"></span>{" "}
              </div>
              <div className="font-black text-blue-500 text-lg italic drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                {data.match?.displayOrder}
              </div>

              {data && (
                <>
                  <div className="relative shrink-0">
                    <img
                      src={`https://flagcdn.com/w80/${data.flag ?? "vn"}.png`}
                      className="w-12 h-8 rounded-sm object-cover border border-blue-400/30 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="text-white font-black text-lg tracking-wider uppercase truncate drop-shadow-[0_0_10px_rgba(59,130,246,0.9)]">
                      {(data.label as string) ?? ""} Phùng Ngọc Sơn
                    </div>
                    <div className="text-blue-400/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Professional Player
                    </div>
                  </div>

                  <div className="flex items-center justify-center min-w-[60px] h-12 rounded bg-blue-600 border border-white/20 shadow-[0_0_15px_rgba(37,99,235,0.8)]">
                    <div className="text-white font-black text-3xl italic tracking-tighter">
                      12
                    </div>
                  </div>
                </>
              )}

              <div className="absolute -inset-1 bg-blue-500/10 rounded-xl blur-md -z-10" />

              <Handle
                type="source"
                position={
                  data.match.side === "left" ? Position.Right : Position.Left
                }
                id="l"
              />
              <Handle
                type="target"
                position={
                  data.match.side === "left" ? Position.Left : Position.Right
                }
                id="r"
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
                label: "Thắng luôn",
              },
              {
                Icon: Shield,
                color: "text-blue-400",
                hoverColor: "group-hover:text-blue-300",
                label: "Thua luôn",
              },
              {
                Icon: Heart,
                color: "text-red-400",
                hoverColor: "group-hover:text-red-300",
                label: "Chấp",
              },
              {
                Icon: Image,
                color: "text-orange-400",
                hoverColor: "group-hover:text-orange-300",
                label: "Xuất ảnh trận đấu",
              },
              {
                Icon: Lightbulb,
                color: "text-blue-400",
                hoverColor: "group-hover:text-blue-300",
                label: "Xem hành trình cơ thủ",
              },
              {
                Icon: Heart,
                color: "text-red-400",
                hoverColor: "group-hover:text-red-300",
                label: "Xem các trận đấu cùng vòng",
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
                  <span className="text-green-500 font-semibold text-sm">
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
                      className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-emerald-500"
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
                        <div className="text-4xl font-bold text-emerald-500">
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

                {/* <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Match Progress</span>
                    <span className="font-semibold">9 - 7 (16 frames)</span>
                  </div>
                  <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500"
                      style={{ width: "56.25%" }}
                    ></div>
                    <div
                      className="bg-gray-600"
                      style={{ width: "43.75%" }}
                    ></div>
                  </div>
                </div> */}

                {/* <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <div className="text-xs font-semibold text-gray-400 mb-2">
                    Frame by Frame
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      1A
                    </span>
                    <span className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      2B
                    </span>
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      3A
                    </span>
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      4A
                    </span>
                    <span className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      5B
                    </span>
                    <span className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      6B
                    </span>
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      7A
                    </span>
                    <span className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      8B
                    </span>
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      9A
                    </span>
                    <span className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      10B
                    </span>
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      11A
                    </span>
                    <span className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      12B
                    </span>
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      13A
                    </span>
                    <span className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      14B
                    </span>
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                      15A
                    </span>
                    <span className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold border-2 border-yellow-400">
                      16A
                    </span>
                  </div>
                </div> */}

                {/* <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-400 mb-2">
                      Nguyễn Văn A Stats
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total shots</span>
                        <span className="text-white font-semibold">142</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Success rate</span>
                        <span className="text-emerald-400 font-semibold">
                          78%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fouls</span>
                        <span className="text-yellow-400 font-semibold">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Avg. frame time</span>
                        <span className="text-blue-400 font-semibold">
                          8:30
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs font-semibold text-gray-400 mb-2">
                      John Smith Stats
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total shots</span>
                        <span className="text-white font-semibold">138</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Success rate</span>
                        <span className="text-emerald-400 font-semibold">
                          72%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fouls</span>
                        <span className="text-yellow-400 font-semibold">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Avg. frame time</span>
                        <span className="text-blue-400 font-semibold">
                          9:15
                        </span>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="bg-gray-800 rounded p-2 text-center">
                    <div className="text-sm font-semibold text-purple-400">
                      9-Ball
                    </div>
                    <div className="text-xs text-gray-500">Game Type</div>
                  </div>
                  <div className="bg-gray-800 rounded p-2 text-center">
                    <div className="text-sm font-semibold text-blue-400">
                      16 Frames
                    </div>
                    <div className="text-xs text-gray-500">Total Played</div>
                  </div>
                  <div className="bg-gray-800 rounded p-2 text-center">
                    <div className="text-sm font-semibold text-orange-400">
                      52:30
                    </div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                </div> */}
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

            {/* <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-400 mb-2">
                  Match Information
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tournament</span>
                    <span className="text-white">Championship 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Round</span>
                    <span className="text-white">Quarter Finals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="text-white">Hanoi, Vietnam</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Venue</span>
                    <span className="text-white">National Sports Center</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-400 mb-2">
                  Prize & Awards
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Winner prize</span>
                    <span className="text-emerald-400 font-semibold">
                      $5,000
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Runner-up prize</span>
                    <span className="text-gray-400">$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Ranking points</span>
                    <span className="text-yellow-400 font-semibold">+150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next match</span>
                    <span className="text-blue-400">Semi Finals</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export const FinalNode = (node) => {
  const { data } = node;
  const isFinal = true;

  return (
    <div
      className="relative flex items-center justify-center p-[2px] overflow-visible"
      style={{ width: NODE_WIDTH, height: NODE_HEIGHT }}
    >
      {/* Lớp nền phát sáng rực rỡ phía sau (Glow Effect) */}
      {isFinal && (
        <div className="absolute inset-0 bg-orange-500/30 blur-[40px] rounded-full scale-110" />
      )}

      {/* Khung viền phong cách Sci-fi cơ học */}
      <div
        className={`relative w-full h-full p-1 flex items-center bg-gray-900/80 backdrop-blur-xl border-y-2 
    ${isFinal ? "border-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.5)]" : "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"}
    before:absolute before:inset-y-0 before:-left-1 before:w-3 before:border-l-4 before:border-inherit
    after:absolute after:inset-y-0 after:-right-1 after:w-3 after:border-r-4 after:border-inherit`}
      >
        {/* Họa tiết góc cắt (Cyber Corners) */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-inherit" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-inherit" />

        {/* Số thứ tự - Đặt trong khối lục giác giả lập */}
        <div className="relative z-10 ml-2">
          <div
            className={`flex items-center justify-center w-10 h-10 clip-path-hexagon font-black text-xl
        ${isFinal ? "bg-orange-500 text-white shadow-[0_0_10px_white]" : "bg-purple-600 text-white"}`}
          >
            {data.match?.displayOrder}
          </div>
        </div>

        <div className="flex flex-1 items-center px-4 gap-4">
          {/* Flag với hiệu ứng kính (Glassmorphism) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white/20 blur-sm rounded scale-110 group-hover:bg-white/40" />
            {data.flag && (
              <img
                src={`https://flagcdn.com/w80/${data.flag}.png`}
                alt="Flag"
                className="relative w-12 h-8 object-cover rounded border border-white/30"
              />
            )}
          </div>

          <div className="flex-1">
            <div
              className={`font-black text-lg tracking-widest uppercase italic leading-none
          ${isFinal ? "text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-yellow-100 to-orange-400" : "text-white"}`}
            >
              {data.label} CHAMPIONSHIP ROUND
            </div>
            {isFinal && (
              <div className="text-[10px] text-orange-400 font-bold tracking-[0.2em] mt-1 flex items-center gap-1">
                {/* <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" /> */}
                {/* CHAMPIONSHIP ROUND */}
              </div>
            )}
          </div>

          {/* Điểm số - Thiết kế khối nổi bật */}
          <div className="relative">
            <div
              className={`px-4 py-2 rounded-md font-black text-2xl skew-x-[-12deg] border-2
          ${
            isFinal
              ? "bg-gradient-to-b from-orange-400 to-red-600 border-yellow-200 text-white shadow-[0_0_15px_rgba(251,146,60,0.8)]"
              : "bg-gradient-to-b from-purple-500 to-indigo-700 border-purple-300 text-white"
          }`}
            >
              12
            </div>
          </div>
        </div>
      </div>

      {/* Handles của React Flow */}
      <Handle
        type="source"
        position={data.match.side === "left" ? Position.Right : Position.Left}
        className="!w-3 !h-3 !bg-orange-400"
      />
      <Handle
        type="target"
        position={data.match.side === "left" ? Position.Left : Position.Right}
        className="!w-3 !h-3 !bg-orange-400"
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
        <div className="font-gamer relative w-full bg-slate-950 rounded-3xl p-1 shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)] border border-slate-800 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-blue-600/10 blur-[120px]"></div>

          <div className="relative z-10 p-8 border border-white/5 rounded-[22px]">
            <div className="text-center mb-10">
              <div className="inline-block bg-blue-600 px-4 py-1 text-[10px] font-black italic tracking-[0.3em] text-white mb-2 rounded-sm">
                PREMIUM EVENT
              </div>
              <h1 className="text-white text-5xl font-black italic uppercase tracking-tighter drop-shadow-sm">
                World <span className="text-blue-500">9-Ball</span> Championship
                {/* ACUI Collegiate Pocket Billiards National Championship */}
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
                <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] animate-bounce mb-2">
                  🏆
                </div>
                <div className="text-white/20 font-black text-xl italic uppercase">
                  VS
                </div>
              </div>

              <div className="flex-1 flex flex-row-reverse items-center bg-gradient-to-l from-red-900/80 to-slate-900 p-4 rounded-xl border-r-4 border-red-500 shadow-lg">
                <img
                  src="https://flagcdn.com/us.svg"
                  className="w-14 h-10 object-cover rounded shadow-md border border-white/10"
                  alt="US"
                />
                <div className="mr-4 text-right">
                  <p className="text-white text-2xl font-black italic uppercase tracking-tight">
                    F. SANCHEZ
                  </p>
                  <p className="text-red-400 text-[10px] font-bold tracking-[0.2em]">
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
                  {/* 9-Ball International */}9 bi Quốc tế - Xếp cao - Thắng phá
                </p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Race To
                </p>
                <p className="text-blue-500 font-black text-3xl italic leading-none">
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

      {/* <hr className="border-gray-300" />

      <section>
        <h2 className="text-center text-gray-500 font-bold mb-6 tracking-widest uppercase">
          Theme 02: Premier League Style
        </h2>

        <div className="font-premier w-full bg-[#3d195d] shadow-2xl overflow-hidden border-b-[12px] border-[#00ff87]">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#00ff87] via-[#02efff] to-[#00ff87]"></div>

          <div className="p-8 pb-0 flex justify-between items-start">
            <div>
              <div className="bg-white/10 inline-block px-3 py-1 rounded text-[11px] font-black tracking-widest text-[#00ff87] mb-2 uppercase italic">
                Final Stage
              </div>
              <h2 className="text-white text-4xl font-black tracking-tight uppercase italic leading-none">
                PREMIER <span className="text-[#00ff87]">POOL</span> LEAGUE
              </h2>
            </div>
            <img
              src="https://www.wpa-pool.com/wp-content/uploads/2021/04/WPA-Logo-300x164.png"
              className="h-12 brightness-0 invert opacity-50"
              alt="Logo"
            />
          </div>

          <div className="px-8 py-10 flex items-center">
            <div className="flex-1 flex items-center">
              <img
                src="https://flagcdn.com/ph.svg"
                className="w-16 h-11 object-cover shadow-xl border-2 border-white/20"
                alt="Flag"
              />
              <h3 className="ml-6 text-4xl font-black text-white italic tracking-tighter">
                EFREN REYES
              </h3>
            </div>

            <div className="flex items-center gap-4 bg-[#240d39] px-6 py-4 rounded-xl shadow-inner border border-white/5">
              <span className="text-6xl font-black text-white">12</span>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#00ff87] rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-[#00ff87]/20">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-[#00ff87] font-black text-xs mt-2 uppercase tracking-tighter">
                  VERSUS
                </span>
              </div>
              <span className="text-6xl font-black text-white">09</span>
            </div>

            <div className="flex-1 flex flex-row-reverse items-center">
              <img
                src="https://flagcdn.com/gb.svg"
                className="w-16 h-11 object-cover shadow-xl border-2 border-white/20"
                alt="Flag"
              />
              <h3 className="mr-6 text-4xl font-black text-white italic tracking-tighter text-right">
                JAYSON SHAW
              </h3>
            </div>
          </div>

          <div className="bg-[#240d39]/80 px-8 py-5 flex justify-between items-center border-t border-white/10">
            <div className="flex items-center gap-12">
              <div>
                <span className="text-[#00ff87] text-[10px] font-black uppercase tracking-widest block">
                  Format
                </span>
                <span className="text-white font-bold italic text-lg uppercase">
                  10-Ball Pro
                </span>
              </div>
              <div className="w-[1px] h-8 bg-white/10"></div>
              <div>
                <span className="text-[#00ff87] text-[10px] font-black uppercase tracking-widest block">
                  Race To
                </span>
                <span className="text-white font-black italic text-2xl leading-none">
                  15
                </span>
              </div>
            </div>

            <div className="flex items-center bg-[#00ff87] text-[#3d195d] px-6 py-2 rounded-sm skew-x-[-15deg] font-black tracking-tighter">
              <span className="skew-x-[15deg] uppercase">Streaming Live</span>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};
