import { QSelect } from "@/components/ui/select";
import { useTournamentStore } from "@/store/match";
import { Pencil, Trophy } from "lucide-react";
import { Tooltip } from "radix-ui";
import { useMemo, useRef, useState, type RefObject } from "react";
import { useOnClickOutside } from "usehooks-ts";

type EliminationType = "SINGLE" | "DOUBLE";
type BracketSide = "winner" | "loser";

interface Round {
  id: string;
  name: string;
  eliminationType: EliminationType;
  side: BracketSide;
  raceTo: number;
}

const RACE_TO_OPTIONS = [3, 5, 7, 9, 11, 13, 15];

const MODE_ITEMS: { value: EliminationType; label: string }[] = [
  { value: "SINGLE", label: "Single Elimination" },
  { value: "DOUBLE", label: "Double Elimination" },
];

function ModeSelect({
  value,
  onChange,
  disabled,
}: {
  value: EliminationType;
  onChange: (value: EliminationType) => void;
  disabled?: boolean;
}) {
  return (
    <QSelect
      value={value}
      options={MODE_ITEMS}
      onChange={onChange}
      size="large"
    />
  );
}

function RaceToPicker({
  value,
  onChange,
  accent,
}: {
  value: number;
  onChange: (value: number) => void;
  accent: "emerald" | "rose";
}) {
  const isCustom = !RACE_TO_OPTIONS.includes(value);

  const activeChip =
    accent === "emerald"
      ? "bg-emerald-400 text-zinc-950"
      : "bg-rose-400 text-zinc-950";

  const activeInput =
    accent === "emerald"
      ? "border-emerald-400 text-emerald-400 bg-emerald-400/10"
      : "border-rose-400 text-rose-400 bg-rose-400/10";

  function handleCustomInput(raw: string) {
    const n = Number(raw.replace(/\D/g, "")) ?? 0;
    if (raw === "") {
      onChange(0);
      return;
    }
    if (!Number.isNaN(n)) onChange(Math.min(99, Math.max(0, n)));
  }

  return (
    <div className="flex items-center gap-1 bg-zinc-950/50 border border-zinc-800 rounded-lg p-1">
      {RACE_TO_OPTIONS.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
            value === opt
              ? activeChip
              : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
        >
          {opt}
        </button>
      ))}

      <div className="w-px h-4 bg-zinc-800 mx-0.5" />

      <input
        value={isCustom ? value : ""}
        onChange={(e) => handleCustomInput(e.target.value)}
        placeholder="…"
        inputMode="numeric"
        title="Nhập số khác"
        className={`w-8 h-7 rounded-md text-center text-xs font-semibold border transition-colors
                    focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder:text-zinc-600
                    ${isCustom ? activeInput : "border-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"}`}
      />
    </div>
  );
}

function SideRow({
  round,
  onChange,
}: {
  round: Round;
  onChange: (patch: Partial<Round>) => void;
}) {
  const isLoser = round.side === "loser";

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 pl-6 pr-4 py-2.5
                  border-l-2 ${isLoser ? "border-rose-400/70" : "border-emerald-400/70"}`}
    >
      <span
        className={`text-xs font-medium whitespace-nowrap ${
          isLoser ? "text-rose-400" : "text-emerald-400"
        }`}
      >
        {isLoser ? "Loser bracket · Race to" : "Winner bracket · Race to"}
      </span>

      <RaceToPicker
        value={round.raceTo}
        onChange={(raceTo) => onChange({ raceTo })}
        accent={isLoser ? "rose" : "emerald"}
      />
    </div>
  );
}

function RoundCard({
  name,
  index,
  items,
  onChangeSide,
  onChangeMode,
}: {
  name: string;
  index: number;
  items: Round[];
  onChangeSide: (id: string, patch: Partial<Round>) => void;
  onChangeMode: (name: string, eliminationType: EliminationType) => void;
}) {
  const primary = items.find((r) => r.side === "winner") ?? items[0];

  const [isEdittingRoundName, setIsEdittingRoundName] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleClickOutside = () => {
    setIsEdittingRoundName(false);
  };

  useOnClickOutside(ref as RefObject<HTMLElement>, handleClickOutside);

  return (
    <div
      className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden
                 transition-colors hover:border-zinc-700"
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <span
          className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-800
                     text-[11px] font-semibold text-orange-400 shrink-0"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {!isEdittingRoundName && (
          <>
            <span className="text-sm font-semibold text-zinc-100 truncate">
              {name}
            </span>

            <Tooltip.Provider delayDuration={400}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Pencil
                    className="w-4 h-4 hover:cursor-pointer"
                    onClick={() => {
                      setIsEdittingRoundName(true);
                      ref.current?.focus();
                    }}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content sideOffset={6}>
                    Edit
                    <Tooltip.Arrow />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </>
        )}

        {isEdittingRoundName && (
          <input
            ref={ref}
            className="!w-fit px-3.5 py-2 text-sm font-semibold text-white rounded-xl outline-none transition-all duration-150 ring-1 ring-white/10 placeholder-[#4a5568]"
            value={name}
            onChange={() => {}}
          />
        )}

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">
            Thể thức
          </span>
          <ModeSelect
            value={primary.eliminationType}
            onChange={(eliminationType) => onChangeMode(name, eliminationType)}
          />
        </div>
      </div>

      <div className="border-t border-zinc-800/80 divide-y divide-zinc-800/60 bg-zinc-950/20">
        {items.map((round) => (
          <SideRow
            key={round.id}
            round={round}
            onChange={(patch) => onChangeSide(round.id, patch)}
          />
        ))}
      </div>
    </div>
  );
}

export function RoundsList() {
  const { tournament } = useTournamentStore();

  const roundsStore = tournament?.brackets?.flatMap((bracket) =>
    bracket.rounds.map((e) => {
      return { ...e, side: bracket.side };
    }),
  );

  const [rounds, setRounds] = useState<Round[]>(roundsStore);

  function updateRound(id: string, patch: Partial<Round>) {
    setRounds((prev) =>
      prev.map((round) => {
        return round.id === id
          ? !!patch.raceTo
            ? { ...round, ...patch }
            : { ...round, raceTo: 9 }
          : round;
      }),
    );
  }

  function getOrderedRoundNames(list: Round[]): string[] {
    const seen = new Set<string>();
    const names: string[] = [];
    list.forEach((r) => {
      if (!seen.has(r.name)) {
        seen.add(r.name);
        names.push(r.name);
      }
    });
    return names;
  }

  // Đổi thể thức của 1 round:
  // - single -> xoá row loser bracket của round đó, VÀ cascade: tất cả round
  //   phía sau (đến chung kết) cũng bị ép về single, vì đã gộp nhánh thì
  //   không thể tách loser bracket ra lại ở vòng sau.
  // - double -> chỉ đổi round hiện tại, thêm lại row loser bracket nếu chưa có.
  function changeGroupMode(name: string, eliminationType: EliminationType) {
    setRounds((prev) => {
      if (eliminationType === "SINGLE") {
        const orderedNames = getOrderedRoundNames(prev);
        const startIndex = orderedNames.indexOf(name);
        const affectedNames = new Set(orderedNames.slice(startIndex));

        return prev
          .filter((r) => !(affectedNames.has(r.name) && r.side === "loser"))
          .map((r) =>
            affectedNames.has(r.name) ? { ...r, eliminationType: "SINGLE" } : r,
          );
      }

      const groupItems = prev.filter((r) => r.name === name);
      const winner =
        groupItems.find((r) => r.side === "winner") ?? groupItems[0];

      const updated = prev.map((r) =>
        r.name === name ? { ...r, eliminationType } : r,
      );

      const hasLoser = groupItems.some((r) => r.side === "loser");
      console.log("hasLoser", hasLoser)
      if (hasLoser) return updated;

      const loserRound: Round = {
        id: `${winner.id}-loser`,
        name,
        eliminationType: "DOUBLE",
        side: "loser",
        raceTo: winner.raceTo,
      };

      const winnerIndex = updated.findIndex((r) => r.id === winner.id);
      const data = [
        ...updated.slice(0, winnerIndex + 1),
        loserRound,
        ...updated.slice(winnerIndex + 1),
      ];
      console.log('data', data)
      return data
    });
  }

  const groups = useMemo(() => {
    const map = new Map<string, Round[]>();
    rounds.forEach((r) => {
      if (!map.has(r.name)) map.set(r.name, []);
      map.get(r.name)!.push(r);
    });

    return Array.from(map.entries()).map(([name, items]) => ({
      name,
      eliminationType: items[0]?.eliminationType,
      items,
    }));
  }, [rounds]);

  console.log("groups", groups)

  return (
    <div className="overflow-x-auto min-w-[640px]">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-orange-400" />
        <h2 className="text-sm font-semibold text-zinc-100">
          Vòng đấu ({groups.length})
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        {groups.map((group, index) => (
          <RoundCard
            key={group.name}
            name={group.name}
            index={index}
            items={group.items}
            onChangeSide={updateRound}
            onChangeMode={changeGroupMode}
          />
        ))}
      </div>
    </div>
  );
}
