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
import { Form } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { AlertCircle, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 } from "uuid";
import { useEffect } from "react";

const INDIGO = "#6366f1";

const formatCurrency = (n: number, isUSD: boolean) => {
  const val = n > 0 ? n.toLocaleString(isUSD ? "en-US" : "vi-VN") : "";

  return isUSD ? `$${val}` : `${val}đ`;
};

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
  onChangeLabel: (id: string, v: string, index: number) => void;
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
        onChange={(e) => {
          console.log("row.original.name", row.original.name);
          console.log("e.target.value", e.target.value);
          onChangeLabel(row.original.id, e.target.value, index);
        }}
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
        <Pencil size={14} />
      </span>
    </div>
  );
}

function CurrencyAmountInput({
  value,
  currency,
  onChange,
  error,
}: {
  value: number;
  currency: string;
  onChange: (value: number) => void;
  error?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isUSD = currency === "USD";

  const formatAmount = (value: number) => {
    if (!value) return "";

    return new Intl.NumberFormat("vi-VN").format(value);
  };

  useEffect(() => {
    setInputValue(formatAmount(value));
  }, [value]);

  const handleFocus = () => {
    setFocused(true);

    // Vẫn giữ format: 1000000 -> 1.000.000
    setInputValue(formatAmount(value));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Bỏ toàn bộ dấu chấm để lấy số thật
    const raw = e.target.value.replace(/\D/g, "");

    const numericValue = Number(raw || 0);

    // Format ngay trong lúc nhập
    setInputValue(
      raw ? new Intl.NumberFormat("vi-VN").format(numericValue) : "",
    );

    onChange(numericValue);
  };

  const handleBlur = () => {
    setFocused(false);

    setInputValue(formatAmount(value));
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="0"
        size={Math.max(inputValue.length - 4, 1)}
        className={`
          w-fit
          bg-transparent
          text-right text-[14px] font-semibold
          outline-none
          border-b pb-0.5
          transition-colors
          ${
            error
              ? "border-rose-400 text-rose-400"
              : "border-border/30 text-foreground"
          }
          placeholder:text-muted-foreground/25
        `}
        style={{
          borderColor: error ? undefined : focused ? INDIGO : undefined,
        }}
      />
    </div>
  );
}

function SortableRow({
  row,
  index,
  totalPrize,
  onChangeLabel,
  onChangeAmount,
  onRemove,
  amountError,
}: {
  row: any;
  index: number;
  totalPrize: number;
  onChangeLabel: (id: string, v: string, index: number) => void;
  onChangeAmount: (id: string, v: number, index: number) => void;
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
  } = useSortable({
    id: row.original.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const rankColor = getRankColor(index);
  const rankBg = getRankBg(index);

  const form = useFormInstance();
  const currencyUnit = Form.useWatch("currencyUnit", form) || "VND";

  const cellRenderers: Record<string, () => React.ReactNode> = {
    drag: () => (
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="
          cursor-grab active:cursor-grabbing
          p-1
          text-muted-foreground/30
          transition-colors
          hover:text-muted-foreground
        "
      >
        <GripVertical size={16} />
      </button>
    ),

    rank: () => (
      <span
        className="
          inline-flex
          h-8 w-8
          items-center
          justify-center
          rounded-full
          text-[12px]
          font-black
        "
        style={{
          color: rankColor,
          background: `${rankColor}22`,
        }}
      >
        {index + 1}
      </span>
    ),

    name: () => (
      <NameCell row={row} index={index} onChangeLabel={onChangeLabel} />
    ),

    amount: () => (
      <>
        <CurrencyAmountInput
          value={Number(row.original.amount) || 0}
          currency={currencyUnit}
          error={!!amountError}
          onChange={(value) => {
            onChangeAmount(row.original.id, value, index);
          }}
        />

        {amountError && (
          <span className="text-right text-[11px] text-rose-400">
            {amountError}
          </span>
        )}
      </>
    ),

    percent: () => (
      <span
        className="text-[13px] font-semibold tabular-nums"
        style={{
          color: rankColor,
        }}
      >
        {totalPrize > 0
          ? `${((row.original.amount / totalPrize) * 100).toFixed(1)}%`
          : "—"}
      </span>
    ),

    remove: () => (
      <button
        type="button"
        onClick={() => onRemove(row.original.id)}
        className="
          p-1
          text-muted-foreground/30
          opacity-0
          transition-opacity
          group-hover:opacity-100
          hover:text-rose-400
        "
      >
        <Trash2 size={15} />
      </button>
    ),
  };

  return (
    <tr
      ref={setNodeRef}
      style={{
        ...style,
        background: rankBg,
      }}
      className="
        group
        border-border/30
        transition-colors
        last:border-none
      "
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

export function PrizeDistributionTable() {
  const { t } = useTranslation();
  const form = Form.useFormInstance();

  const totalPrizeString = Form.useWatch("totalPrize", form);

  const currencyUnit = Form.useWatch("currencyUnit", form) || "VND";

  const isUSD = currencyUnit === "USD";

  const totalPrize =
    typeof totalPrizeString === "number"
      ? totalPrizeString
      : parseFloat(totalPrizeString || "0");

  const prizeDistributions = Form.useWatch("prizeDistributions", form) || [];

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const distributedTotal = useMemo(
    () => prizeDistributions.reduce((sum, r) => sum + r.amount, 0),
    [prizeDistributions],
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
        meta: { className: "whitespace-nowrap px-3 py-4" },
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
    data: prizeDistributions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = prizeDistributions.findIndex((r) => r.id === active.id);
    const newIdx = prizeDistributions.findIndex((r) => r.id === over.id);
    const newArr = arrayMove(prizeDistributions, oldIdx, newIdx);
    form.setFieldValue("prizeDistributions", newArr);
  };

  const createNew = () => {
    return create(PrizeDistributionSchema, {
      id: v4(),
      name: "",
      amount: 0,
      displayOrder: prizeDistributions.length + 1,
      tournamentId: form.getFieldValue("id"),
    });
  };

  const handleAdd = () => {
    form.setFieldValue("prizeDistributions", [
      ...prizeDistributions,
      createNew(),
    ]);
  };

  const handleRemove = (id: string) => {
    const currentDistributions = form.getFieldValue("prizeDistributions");

    form.setFieldValue(
      "prizeDistributions",
      currentDistributions.filter((row) => row.id !== id),
    );
  };

  const handleChangeLabel = (id: string, label: string, index: number) => {
    form.setFieldValue(["prizeDistributions", index, "name"], label);
  };

  const handleChangeAmount = (id: string, value: number, index: number) => {
    form.setFieldValue(["prizeDistributions", index, "amount"], value);
  };

  const budgetLabel = isOverBudget
    ? t("settings.prizeDistribution.budget.over", {
        amount: formatCurrency(distributedTotal - totalPrize, isUSD),
      })
    : remaining === 0
      ? t("settings.prizeDistribution.budget.exact")
      : t("settings.prizeDistribution.budget.remaining", {
          amount: formatCurrency(remaining, isUSD),
        });

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: `${INDIGO}30`, background: `${INDIGO}06` }}
    >
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
      <Form.Item name="prizeDistributions" noStyle>
        {prizeDistributions.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={prizeDistributions.map((r) => r.id)}
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
                    <th className="px-3 py-3 text-right">
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
      </Form.Item>

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

        {prizeDistributions.length > 0 && (
          <div className="flex items-center gap-2">
            {isOverBudget && (
              <AlertCircle size={13} className="text-rose-400" />
            )}
            <span className="text-[13px] text-muted-foreground/60">
              {t("settings.prizeDistribution.total")}
            </span>
            <span
              className="text-[13px] font-black tabular-nums"
              style={{ color: isOverBudget ? "#F43F5E" : "#10B981" }}
            >
              {formatCurrency(distributedTotal, isUSD)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
