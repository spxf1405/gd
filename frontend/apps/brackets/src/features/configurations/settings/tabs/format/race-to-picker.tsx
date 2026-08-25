
const RACE_TO_OPTIONS = [3, 5, 7, 9, 11, 13, 15];

export function RaceToPicker({
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
