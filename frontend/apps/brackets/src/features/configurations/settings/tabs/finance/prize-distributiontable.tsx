"use client";

import { create } from "@bufbuild/protobuf";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PrizeDistributionSchema,
  type PrizeDistribution,
} from "@gd/proto/tournament/v1/tournament_pb";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { AlertCircle, GripVertical, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";

const INDIGO = "#6366f1";

interface Props {
  totalPrize: number;
  value: PrizeDistribution[];
  onChange: (rows: PrizeDistribution[]) => void;
}

const formatVND = (n: number) =>
  n > 0 ? n.toLocaleString("vi-VN") + " đ" : "—";

const getRankColor = (index: number): string => {
  const palette = [
    "#F59E0B",
    "#C0C0C0",
    "#CD7F32",
    INDIGO,
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#64748B",
  ];
  if (index < palette.length) return palette[index];
  const lightness = Math.max(55, 75 - index * 3);
  return `hsl(220, 10%, ${lightness}%)`;
};

const getRankBg = (index: number): string => {
  const bgs = [
    "rgba(245,158,11,0.07)",
    "rgba(192,192,192,0.07)",
    "rgba(205,127,50,0.07)",
    "rgba(99,102,241,0.06)",
    "rgba(139,92,246,0.06)",
    "rgba(236,72,153,0.06)",
    "rgba(20,184,166,0.06)",
    "rgba(100,116,139,0.05)",
  ];
  return bgs[index] ?? "rgba(100,116,139,0.04)";
};

function NameCell({
  row,
  index,
  onChangeLabel,
}: {
  row: any;
  index: number;
  onChangeLabel: (id: string, v: string) => void;
}) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const showHighlight = focused || hovered;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: `1.5px solid`,
        borderColor: focused ? INDIGO : hovered ? `${INDIGO}60` : `${INDIGO}20`,
        transition: "border-color 0.15s ease",
      }}
    >
      <input
        type="text"
        value={row.original.name}
        onChange={(e) => onChangeLabel(row.original.id, e.target.value)}
        placeholder={t("settings.prizeDistribution.placeholderName", {
          rank: index + 1,
        })}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/35 outline-none border-none focus:ring-0 min-w-[120px] pb-0.5 pr-5"
      />
      {/* Edit hint icon */}
      <span
        className="absolute right-0.5 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-150 text-[12px]"
        style={{
          opacity: showHighlight ? 0.45 : 0,
          color: INDIGO,
        }}
      >
        ✎
      </span>
    </div>
  );
}

function SortableRow({
  row,
  index,
  total,
  totalPrize,
  onChangeLabel,
  onChangeAmount,
  onRemove,
  amountError,
}: {
  row: any;
  index: number;
  total: number;
  totalPrize: number;
  onChangeLabel: (id: string, v: string) => void;
  onChangeAmount: (id: string, v: number) => void;
  onRemove: (id: string) => void;
  amountError: string | null;
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const rankColor = getRankColor(index);
  const rankBg = getRankBg(index);

  const cellRenderers: Record<string, () => React.ReactNode> = {
    drag: () => (
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors p-1"
      >
        <GripVertical size={16} />
      </button>
    ),

    rank: () => (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[12px] font-black"
        style={{ color: rankColor, background: `${rankColor}22` }}
      >
        {index + 1}
      </span>
    ),

    name: () => (
      <NameCell row={row} index={index} onChangeLabel={onChangeLabel} />
    ),

    amount: () => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={row.original.amount}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^\d]/g, "");
              onChangeAmount(row.original.id, parseInt(raw || "0", 10));
            }}
            placeholder="0"
            className={`
              w-full bg-transparent text-[14px] font-semibold text-right outline-none border-b-2 transition-colors pb-0.5
              ${amountError ? "border-rose-400 text-rose-400" : "border-border/30 text-foreground"}
              placeholder:text-muted-foreground/25 min-w-[100px]
            `}
            onFocus={(e) => {
              if (!amountError) e.currentTarget.style.borderColor = INDIGO;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "";
            }}
          />
          <span className="text-sm text-muted-foreground shrink-0">đ</span>
        </div>
        {amountError && (
          <span className="text-[11px] text-rose-400 text-right">
            {amountError}
          </span>
        )}
      </div>
    ),

    percent: () => (
      <span
        className="text-[13px] font-semibold tabular-nums"
        style={{ color: rankColor }}
      >
        {totalPrize > 0
          ? ((row.original.amount / totalPrize) * 100).toFixed(1) + "%"
          : "—"}
      </span>
    ),

    remove: () => (
      <button
        type="button"
        onClick={() => onRemove(row.original.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/30 hover:text-rose-400 p-1"
      >
        <Trash2 size={15} />
      </button>
    ),
  };

  return (
    <tr
      ref={setNodeRef}
      style={{ ...style, background: rankBg }}
      className="group border-border/30 last:border-none transition-colors"
    >
      {row.getVisibleCells().map((cell: any) => (
        <td
          key={cell.id}
          className={cell.column.columnDef.meta?.className ?? "px-4 py-4"}
        >
          {(
            cellRenderers[cell.column.id] ??
            (() => flexRender(cell.column.columnDef.cell, cell.getContext()))
          )()}
        </td>
      ))}
    </tr>
  );
}

export function PrizeDistributionTable({ totalPrize, value, onChange }: Props) {
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const distributedTotal = useMemo(
    () => value.reduce((sum, r) => sum + r.amount, 0),
    [value],
  );

  const remaining = (totalPrize || 0) - distributedTotal;
  const isOverBudget =
    distributedTotal > (totalPrize || 0) && (totalPrize || 0) > 0;

  const getRowError = (row: PrizeDistribution): string | null => {
    const { amount } = row;
    if (!amount) return null;
    if (!/^\d+$/.test(amount))
      return t("settings.prizeDistribution.errors.numbersOnly");
    if (amount < 0) return t("settings.prizeDistribution.errors.invalid");
    return null;
  };

  const columnHelper = createColumnHelper<PrizeDistribution>();
  const columns = useMemo<ColumnDef<PrizeDistribution, any>[]>(
    () => [
      columnHelper.display({
        id: "drag",
        meta: { className: "w-8 pl-4 pr-1 py-4" },
      }),
      columnHelper.display({
        id: "rank",
        meta: { className: "w-10 px-2 py-4 text-center" },
      }),
      columnHelper.accessor("name", {
        id: "name",
        meta: { className: "px-3 py-4 w-full" },
      }),
      columnHelper.accessor("amount", {
        id: "amount",
        meta: { className: "px-3 py-4 min-w-[160px]" },
      }),
      columnHelper.display({
        id: "percent",
        meta: { className: "px-3 py-4 w-20 text-right" },
      }),
      columnHelper.display({
        id: "remove",
        meta: { className: "w-10 pr-4 py-4 text-right" },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: value,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = value.findIndex((r) => r.id === active.id);
    const newIdx = value.findIndex((r) => r.id === over.id);
    onChange(arrayMove(value, oldIdx, newIdx));
  };

  const createNew = () => {
    return create(PrizeDistributionSchema, {
      id: v4(),
      name: "",
      amount: 0,
      displayOrder: value.length + 1,
      tournamentId: value[0].tournamentId,
    });
  };

  const handleAdd = () => onChange([...value, createNew()]);
  const handleRemove = (id: string) =>
    onChange(value.filter((r) => r.id !== id));
  const handleChangeLabel = (id: string, v: string) => {
    onChange(value.map((r) => (r.id === id ? { ...r, name: v } : r)));
  };
  const handleChangeAmount = (id: string, v: number) =>
    onChange(value.map((r) => (r.id === id ? { ...r, amount: v } : r)));

  const budgetLabel = isOverBudget
    ? t("settings.prizeDistribution.budget.over", {
        amount: formatVND(distributedTotal - totalPrize),
      })
    : remaining === 0
      ? t("settings.prizeDistribution.budget.exact")
      : t("settings.prizeDistribution.budget.remaining", {
          amount: formatVND(remaining),
        });

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: `${INDIGO}30`, background: `${INDIGO}06` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          borderBottom: `1px solid ${INDIGO}18`,
          background: `${INDIGO}0d`,
        }}
      >
        <span
          className="text-[11px] font-black tracking-[0.18em] uppercase"
          style={{ color: INDIGO }}
        >
          {t("settings.prizeDistribution.title")}
        </span>

        {(totalPrize || 0) > 0 && (
          <div className="flex items-center gap-3">
            <div
              className="w-28 h-1.5 rounded-full overflow-hidden"
              style={{ background: `${INDIGO}20` }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (distributedTotal / totalPrize) * 100)}%`,
                  background: isOverBudget
                    ? "#F43F5E"
                    : distributedTotal === totalPrize
                      ? "#10B981"
                      : INDIGO,
                }}
              />
            </div>
            <span
              className="text-[12px] font-semibold tabular-nums"
              style={{
                color: isOverBudget ? "#F43F5E" : "var(--muted-foreground)",
              }}
            >
              {budgetLabel}
            </span>
          </div>
        )}
      </div>

      {value.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={value.map((r) => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${INDIGO}15` }}>
                  <th className="w-8 pl-4 pr-1 py-3" />
                  <th className="w-10 px-2 py-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                      {t("settings.prizeDistribution.columns.rank")}
                    </span>
                  </th>
                  <th className="px-3 py-3 text-left">
                    <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                      {t("settings.prizeDistribution.columns.name")}
                    </span>
                  </th>
                  <th className="px-3 py-3 text-right min-w-[160px]">
                    <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                      {t("settings.prizeDistribution.columns.amount")}
                    </span>
                  </th>
                  <th className="px-3 py-3 w-20 text-right">
                    <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                      {t("settings.prizeDistribution.columns.percent")}
                    </span>
                  </th>
                  <th className="w-10 pr-4" />
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => (
                  <SortableRow
                    key={row.original.id}
                    row={row}
                    index={index}
                    total={value.length}
                    totalPrize={totalPrize || 0}
                    onChangeLabel={handleChangeLabel}
                    onChangeAmount={handleChangeAmount}
                    onRemove={handleRemove}
                    amountError={getRowError(row.original)}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="py-10 text-center text-sm text-muted-foreground/40">
          {t("settings.prizeDistribution.empty")}
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderTop: `1px solid ${INDIGO}12` }}
      >
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 text-[13px] font-semibold px-3 py-2 rounded-lg transition-all active:scale-95"
          style={{ color: INDIGO }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${INDIGO}12`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Plus size={14} />
          {t("settings.prizeDistribution.add")}
        </button>

        {value.length > 0 && (
          <div className="flex items-center gap-2">
            {isOverBudget && (
              <AlertCircle size={13} className="text-rose-400" />
            )}
            <span className="text-[13px] text-muted-foreground/60">
              {t("settings.prizeDistribution.total")}s
            </span>
            <span
              className="text-[13px] font-black tabular-nums"
              style={{ color: isOverBudget ? "#F43F5E" : "#10B981" }}
            >
              {formatVND(distributedTotal)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
