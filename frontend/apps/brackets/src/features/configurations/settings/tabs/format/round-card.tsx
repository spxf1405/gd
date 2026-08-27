import { QSelect } from "@/components/ui/select";
import { Form } from "antd";
import { Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

import type { Bracket } from "@gd/proto/bracket/v1/bracket_pb";
import { EliminationType } from "@gd/proto/round/v1/round_pb";
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";

import { QTooltip } from "@/components/ui/toottip";
import { SideRow } from "./side-row";
import type { TournamentRound } from "./types/types";

const MODE_ITEMS: {
  value: EliminationType;
  label: string;
}[] = [
  {
    value: EliminationType.SINGLE,
    label: "Loại trực tiếp",
  },
  {
    value: EliminationType.DOUBLE,
    label: "Nhánh thắng nhánh thua",
  },
];

function ModeSelect({
  value,
  onChange,
  isDisableDouble,
}: {
  value: EliminationType;
  onChange: (value: EliminationType) => void;
  isDisableDouble?: boolean;
}) {
  return (
    <QSelect
      value={value}
      options={MODE_ITEMS}
      onChange={onChange}
      disabled={isDisableDouble}
      size="large"
      allowClear={false}
    />
  );
}

type RoundCardProps = {
  name: string;
  index: number;
  items: TournamentRound[];
  isDisableDouble: boolean;
  onChangeSide: (round: TournamentRound) => void;
  onChangeMode: (name: string, eliminationType: EliminationType) => void;
};

export function RoundCard({
  name,
  index,
  items,
  isDisableDouble,
  onChangeSide,
  onChangeMode,
}: RoundCardProps) {
  const form = Form.useFormInstance<Tournament>();

  const [isEditingRoundName, setIsEditingRoundName] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const originalNameRef = useRef(name);

  const winnerRound =
    items.find((round) => round.side === "winner") ?? items[0];

  const startEditingRoundName = () => {
    originalNameRef.current = name;
    setIsEditingRoundName(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const saveRoundName = (nextName: string) => {
    const trimmedName = nextName.trim();

    if (!trimmedName || trimmedName === originalNameRef.current) {
      return;
    }

    const brackets =
      (form.getFieldValue("brackets") as Bracket[] | undefined) ?? [];

    const nextBrackets = brackets.map((bracket) => ({
      ...bracket,
      rounds: bracket.rounds.map((round) =>
        round.name === originalNameRef.current
          ? {
              ...round,
              name: trimmedName,
            }
          : round,
      ),
    }));

    form.setFieldValue("brackets", nextBrackets);
  };

  const finishEditing = () => {
    saveRoundName(inputRef.current?.value ?? "");
    setIsEditingRoundName(false);
  };

  const cancelEditing = () => {
    setIsEditingRoundName(false);
  };

  useOnClickOutside(inputRef, () => {
    if (isEditingRoundName) {
      finishEditing();
    }
  });

  const handleRoundNameKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finishEditing();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  };

  if (!winnerRound) {
    return null;
  }

  return (
    <div
      className="
        overflow-hidden rounded-xl
        border border-zinc-800
        bg-zinc-900/40
        transition-colors
        hover:border-zinc-700
      "
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <span
          className="
            flex h-7 w-7 shrink-0
            items-center justify-center
            rounded-md bg-zinc-800
            text-[11px] font-semibold text-orange-400
          "
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {!isEditingRoundName ? (
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-semibold text-zinc-100">
              {name}
            </span>

            <QTooltip title="Đổi tên vòng đấu" arrow={false}>
              <button
                type="button"
                onClick={startEditingRoundName}
                className="
                  flex h-6 w-6 shrink-0
                  items-center justify-center
                  rounded-md text-zinc-300
                  transition-colors
                  hover:bg-zinc-800
                  hover:text-zinc-200
                  hover:scale-115
                  cursor-pointer
                  transition-all duration-200
                "
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </QTooltip>
          </div>
        ) : (
          <input
            ref={inputRef}
            defaultValue={name}
            autoFocus
            onKeyDown={handleRoundNameKeyDown}
            className="
              min-w-0 w-fit
              rounded-xl
              px-3.5 py-2
              text-sm font-semibold text-white
              outline-none
              ring-1 ring-white/10
              transition-all duration-150
              placeholder:text-[#4a5568]
              focus:ring-white/20
            "
          />
        )}

        <div className="ml-auto flex items-center gap-2">
          <ModeSelect
            value={winnerRound.eliminationType}
            onChange={(eliminationType) => onChangeMode(name, eliminationType)}
            isDisableDouble={isDisableDouble}
          />
        </div>
      </div>

      <div
        className="
          divide-y divide-zinc-800/60
          border-t border-zinc-800/80
          bg-zinc-950/20
        "
      >
        {items.map((round) => (
          <SideRow key={round.id} round={round} onChange={onChangeSide} />
        ))}
      </div>
    </div>
  );
}
