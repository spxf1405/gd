/**
 * Dependencies needed (if not already installed):
 *   npm install @tanstack/react-table @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @dnd-kit/modifiers
 */

import { TournamentFormat, TournamentType, type Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";
import { AlertTriangle, Check, ChevronDown, Grid2X2, GripVertical, Plus, Trash2, X } from "lucide-react";
import { Select } from "radix-ui";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useWatch, type Control, type UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { COLORS } from "../consts/color";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT = {
  main:   COLORS.bronze,
  dim:    "rgba(251,146,60,0.12)",
  border: "rgba(251,146,60,0.25)",
};

const INPUT_BASE_CLS =
  "w-full px-3.5 py-2.5 text-[13px] text-white rounded-xl outline-none transition-all duration-150 focus:ring-2 focus:ring-[#fb923c]/20 placeholder-[#4a5568]";

const INPUT_STYLE = {
  background: COLORS.inputBg,
  border: `1px solid ${COLORS.inputBorder}`,
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

const LInput = ({ className = "", ...p }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`${INPUT_BASE_CLS} ${className}`} style={INPUT_STYLE} {...p} />
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      className="text-[11px] font-semibold uppercase tracking-[0.09em]"
      style={{ color: COLORS.textSecondary }}
    >
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div
    className="flex items-center gap-3 pb-3 mb-1"
    style={{ borderBottom: `1px solid ${COLORS.borderFaint}` }}
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: ACCENT.dim,
        border: `1px solid ${ACCENT.border}`,
        color: ACCENT.main,
      }}
    >
      <Grid2X2 size={17} />
    </div>
    <h3 className="text-[17px] font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
      {title}
    </h3>
  </div>
);

const MAX_PLAYER_OPTIONS = [8, 16, 32, 64, 128, 256];

function SelectField<T extends string>({
  value,
  onChange,
  items,
  disabled,
}: {
  value: T | undefined;
  onChange: (v: T) => void;
  items: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <Select.Root value={value?.toString()} onValueChange={(v) => onChange(v as T)} disabled={disabled}>
      <Select.Trigger
        className={`${INPUT_BASE_CLS} flex items-center justify-between gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
        style={INPUT_STYLE}
      >
        <Select.Value />
        <Select.Icon asChild>
          <ChevronDown size={14} style={{ color: COLORS.iconGray, flexShrink: 0 }} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          style={{
            background: COLORS.surfaceAlt,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            overflow: "hidden",
            zIndex: 9999,
            minWidth: "var(--radix-select-trigger-width)",
            maxHeight: "var(--radix-select-content-available-height)",
          }}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-7 bg-white/[0.03] text-[#9aa4b4]">
            <ChevronDown size={12} className="rotate-180" />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-1.5">
            {items.map(({ value, label }) => (
              <Select.Item
                key={value}
                value={value}
                className="flex items-center justify-between gap-2 my-1 px-3 py-2.5 rounded-[9px] text-[13px] text-[#b0bac8] cursor-pointer outline-none select-none transition-all duration-[120ms] hover:bg-white/[0.07] hover:text-white data-[state=checked]:bg-[rgba(251,146,60,0.1)] data-[state=checked]:text-[#fb923c]"
              >
                <Select.ItemText>{label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={13} style={{ color: COLORS.bronze, flexShrink: 0 }} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-7 bg-white/[0.03] text-[#9aa4b4]">
            <ChevronDown size={12} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type RoundFormat = "double_elim" | "single_elim";

interface RoundConfig {
  id: string;
  roundName: string;
  format: RoundFormat;
  raceTo: number;
}

// ─── Warning Banner ───────────────────────────────────────────────────────────

function SingleElimWarning({
  roundName,
  onClose,
}: {
  roundName: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [roundName, onClose]);

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl text-[13px] leading-relaxed"
      style={{
        background: "rgba(234,179,8,0.08)",
        border: "1px solid rgba(234,179,8,0.28)",
        color: "#fde68a",
        animation: "fadeSlideIn 0.25s ease",
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <AlertTriangle size={15} style={{ color: "#facc15", flexShrink: 0, marginTop: 1 }} />
      <span className="flex-1">
        Bạn đã chọn{" "}
        <strong style={{ color: "#fef08a" }}>
          {roundName || "vòng này"}
        </strong>{" "}
        có thể thức{" "}
        <strong style={{ color: "#fef08a" }}>Loại trực tiếp</strong>,{" "}
        các vòng đấu tiếp theo cho đến hết giải sẽ sử dụng thể thức này!
      </span>
      <button
        type="button"
        onClick={onClose}
        className="transition-opacity hover:opacity-60 flex-shrink-0 mt-0.5"
        style={{ color: "#fde68a" }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

// ─── Round Format Options ─────────────────────────────────────────────────────

const ROUND_FORMAT_OPTIONS: { value: RoundFormat; label: string }[] = [
  { value: "double_elim", label: "Nhánh thắng nhánh thua" },
  { value: "single_elim", label: "Loại trực tiếp" },
];

// ─── Sortable Row ─────────────────────────────────────────────────────────────

function SortableRow({
  row,
  isForced,
  isEven,
  onFormatChange,
  onRaceToChange,
  onRoundNameChange,
  onDelete,
}: {
  row: Row<RoundConfig>;
  isForced: boolean;
  isEven: boolean;
  onFormatChange: (id: string, value: RoundFormat) => void;
  onRaceToChange: (id: string, value: number) => void;
  onRoundNameChange: (id: string, value: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.original.id });

  const trStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 10 : "auto",
    position: "relative",
    background: isDragging
      ? "rgba(251,146,60,0.07)"
      : isEven
      ? "transparent"
      : "rgba(255,255,255,0.015)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    boxShadow: isDragging ? "0 4px 20px rgba(0,0,0,0.5)" : "none",
  };

  const tdCls = "px-2 py-1.5 align-middle";

  return (
    <tr ref={setNodeRef} style={trStyle}>
      {/* Drag handle */}
      <td className={tdCls} style={{ width: 36, textAlign: "center" }}>
        <button
          type="button"
          className="w-6 h-6 flex items-center justify-center rounded-md mx-auto transition-colors hover:bg-white/10 cursor-grab active:cursor-grabbing"
          style={{ color: "rgba(255,255,255,0.2)", touchAction: "none" }}
          {...attributes}
          {...listeners}
        >
          <GripVertical size={13} />
        </button>
      </td>

      {/* Tên vòng đấu */}
      <td className={tdCls}>
        <input
          value={row.original.roundName}
          onChange={(e) => onRoundNameChange(row.original.id, e.target.value)}
          placeholder="VD: Vòng 1/32"
          className="w-full px-3 py-2 text-[13px] text-white rounded-lg outline-none transition-all duration-150 focus:ring-1 focus:ring-[#fb923c]/30 placeholder-[#3a4456]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        />
      </td>

      {/* Thể thức */}
      <td className={tdCls}>
        <div className="relative">
          <SelectField<RoundFormat>
            value={row.original.format}
            onChange={(v) => onFormatChange(row.original.id, v)}
            items={ROUND_FORMAT_OPTIONS}
            disabled={isForced}
          />
          {isForced && (
            <div
              className="absolute -top-1.5 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none"
              style={{
                background: "rgba(251,146,60,0.15)",
                color: "#fb923c",
                border: "1px solid rgba(251,146,60,0.3)",
              }}
            >
              bắt buộc
            </div>
          )}
        </div>
      </td>

      {/* Race to */}
      <td className={tdCls}>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] whitespace-nowrap" style={{ color: COLORS.textSecondary }}>
            Race to
          </span>
          <input
            type="number"
            min={1}
            max={99}
            value={row.original.raceTo}
            onChange={(e) => onRaceToChange(row.original.id, parseInt(e.target.value) || 1)}
            className="w-14 px-2 py-2 text-[13px] text-white text-center rounded-lg outline-none transition-all duration-150 focus:ring-1 focus:ring-[#fb923c]/30"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          />
        </div>
      </td>

      {/* Delete */}
      <td className={tdCls} style={{ textAlign: "center", width: 48 }}>
        <button
          type="button"
          onClick={() => onDelete(row.original.id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-150 hover:bg-red-500/15 hover:text-red-400 mx-auto"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          <Trash2 size={13} />
        </button>
      </td>
    </tr>
  );
}

// ─── Column Helper ────────────────────────────────────────────────────────────

const columnHelper = createColumnHelper<RoundConfig>();

// ─── Round Config Table ───────────────────────────────────────────────────────

function RoundConfigTable({
  rounds,
  onChange,
}: {
  rounds: RoundConfig[];
  onChange: (rounds: RoundConfig[]) => void;
}) {
  const [warning, setWarning] = useState<{ roundName: string; key: number } | null>(null);
  const warningKeyRef = useRef(0);

  const firstSingleElimIndex = rounds.findIndex((r) => r.format === "single_elim");

  // Cascade helper: after any mutation, re-enforce single_elim constraint
  const cascadeSingleElim = (list: RoundConfig[]): RoundConfig[] => {
    const firstIdx = list.findIndex((r) => r.format === "single_elim");
    if (firstIdx === -1) return list;
    return list.map((r, i) =>
      i > firstIdx ? { ...r, format: "single_elim" as RoundFormat } : r
    );
  };

  const handleFormatChange = (id: string, value: RoundFormat) => {
    const idx = rounds.findIndex((r) => r.id === id);
    if (idx === -1) return;

    const isNewSingleElim =
      value === "single_elim" &&
      (firstSingleElimIndex === -1 || idx < firstSingleElimIndex);

    const updated = rounds.map((r, i) =>
      i === idx ? { ...r, format: value } : r
    );
    onChange(cascadeSingleElim(updated));

    if (isNewSingleElim) {
      warningKeyRef.current += 1;
      setWarning({ roundName: rounds[idx].roundName, key: warningKeyRef.current });
    }
  };

  const handleRaceToChange = (id: string, value: number) => {
    onChange(rounds.map((r) => (r.id === id ? { ...r, raceTo: value } : r)));
  };

  const handleRoundNameChange = (id: string, value: string) => {
    onChange(rounds.map((r) => (r.id === id ? { ...r, roundName: value } : r)));
  };

  const handleDelete = (id: string) => {
    onChange(cascadeSingleElim(rounds.filter((r) => r.id !== id)));
  };

  const handleAdd = () => {
    const lastFormat = rounds.length > 0 ? rounds[rounds.length - 1].format : "double_elim";
    onChange([
      ...rounds,
      {
        id: Math.random().toString(36).slice(2),
        roundName: "",
        format: lastFormat,
        raceTo: 5,
      },
    ]);
  };

  // TanStack Table
  const columns = useMemo(
    () => [
      columnHelper.display({ id: "drag",   header: ""            }),
      columnHelper.accessor("roundName",   { header: "Tên vòng đấu" }),
      columnHelper.accessor("format",      { header: "Thể thức"  }),
      columnHelper.accessor("raceTo",      { header: "Chạm mấy"  }),
      columnHelper.display({ id: "delete", header: "Xoá"         }),
    ],
    []
  );

  const table = useReactTable({
    data: rounds,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  // DnD Kit
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = rounds.findIndex((r) => r.id === active.id);
    const newIndex = rounds.findIndex((r) => r.id === over.id);
    onChange(cascadeSingleElim(arrayMove(rounds, oldIndex, newIndex)));
  };

  const thCls =
    "text-left text-[11px] font-semibold uppercase tracking-[0.09em] px-3 py-2.5 whitespace-nowrap";

  return (
    <div className="flex flex-col gap-3">
      {/* Section divider */}
      <div className="flex items-center gap-3 mt-1">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.09em] whitespace-nowrap"
          style={{ color: ACCENT.main }}
        >
          Cấu hình vòng đấu
        </span>
        <div className="flex-1 h-px" style={{ background: ACCENT.border }} />
      </div>

      {/* Warning banner */}
      {warning && (
        <SingleElimWarning
          key={warning.key}
          roundName={warning.roundName}
          onClose={() => setWarning(null)}
        />
      )}

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: `1px solid ${COLORS.border ?? "rgba(255,255,255,0.08)"}`,
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className={thCls}
                      style={{
                        color: COLORS.textSecondary,
                        textAlign: header.id === "delete" ? "center" : "left",
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-[13px]"
                    style={{ color: COLORS.textSecondary }}
                  >
                    Chưa có vòng đấu nào. Nhấn "+ Thêm vòng" để bắt đầu.
                  </td>
                </tr>
              )}
              <SortableContext
                items={rounds.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row, idx) => (
                  <SortableRow
                    key={row.original.id}
                    row={row}
                    isForced={firstSingleElimIndex !== -1 && idx > firstSingleElimIndex}
                    isEven={idx % 2 === 0}
                    onFormatChange={handleFormatChange}
                    onRaceToChange={handleRaceToChange}
                    onRoundNameChange={handleRoundNameChange}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
      </div>

      {/* Add row */}
      <button
        type="button"
        onClick={handleAdd}
        className="self-start flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 hover:bg-[rgba(251,146,60,0.12)] hover:text-[#fb923c]"
        style={{
          color: COLORS.textSecondary,
          border: "1px dashed rgba(251,146,60,0.25)",
          background: "transparent",
        }}
      >
        <Plus size={13} />
        Thêm vòng
      </button>
    </div>
  );
}

// ─── FormatTab ────────────────────────────────────────────────────────────────

export const FormatTab = ({
  control,
  register,
}: {
  control: Control<Tournament, any, Tournament>;
  register: UseFormRegister<Tournament>;
}) => {
  const { t } = useTranslation();

  const TournamentTypeList = [
    { value: TournamentType.SINGLE.toString(), label: t("tournament.type.single") },
    { value: TournamentType.TEAM.toString(),   label: t("tournament.type.team") },
  ];

  const TournamentFormatList = [
    { value: TournamentFormat.TOURNAMENT_TYPE_8_BALL.toString(),  label: t("tournament.format.8ball") },
    { value: TournamentFormat.TOURNAMENT_TYPE_9_BALL.toString(),  label: t("tournament.format.9ball") },
    { value: TournamentFormat.TOURNAMENT_TYPE_10_BALL.toString(), label: t("tournament.format.10ball") },
  ];

  const maxPlayersOptions = MAX_PLAYER_OPTIONS.map((n) => ({
    value: n.toString(),
    label: `${n} ${t("settings.tabs.format.fields.playersUnit")}`,
  }));

  const [rounds, setRounds] = useState<RoundConfig[]>([]);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title={t("settings.tabs.format.sectionTitle")} />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <Field label={t("settings.tabs.format.fields.type")} required>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <SelectField
                  value={field.value?.toString()}
                  onChange={field.onChange}
                  items={TournamentTypeList}
                />
              )}
            />
          </Field>
        </div>

        <div className="col-span-2">
          <Field label={t("settings.tabs.format.fields.format")} required>
            <Controller
              name="format"
              control={control}
              render={({ field }) => (
                <SelectField
                  value={field.value?.toString()}
                  onChange={field.onChange}
                  items={TournamentFormatList}
                />
              )}
            />
          </Field>
        </div>

        <div className="col-span-8">
          <Field label={t("settings.tabs.format.fields.formatDescription")}>
            <LInput
              {...register("formatDescription")}
              placeholder={t("settings.tabs.format.fields.formatDescriptionPlaceholder")}
            />
          </Field>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label={t("settings.tabs.format.fields.maxPlayers")} required>
          <Controller
            name={"maxPlayers" as any}
            control={control}
            render={({ field }) => (
              <SelectField
                value={field.value?.toString()}
                onChange={(v) => field.onChange(parseInt(v))}
                items={maxPlayersOptions}
              />
            )}
          />
        </Field>
      </div>

      <RoundConfigTable rounds={rounds} onChange={setRounds} />
    </div>
  );
};