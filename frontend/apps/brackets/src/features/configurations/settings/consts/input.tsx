import {
  TournamentFormat,
  TournamentType,
} from "@gd/proto/tournament/v1/tournament_pb";
import {
  Calendar,
  Check,
  ChevronDown,
  DollarSign,
  Image as ImageIcon,
  Info,
  Users,
} from "lucide-react";
import { Select, Switch, Tooltip } from "radix-ui";
import React from "react";
import { COLORS } from "./color";
import classNames from "classnames";

export const TAB_CONFIG = (t: (key: string) => string) => [
  {
    value: "basic",
    label: t("settings.tabs.basic.label"),
    sub: t("settings.tabs.basic.sub"),
    icon: Info,
    accent: COLORS.green,
  },
  {
    value: "schedule",
    label: t("settings.tabs.schedule.label"),
    sub: t("settings.tabs.schedule.sub"),
    icon: Calendar,
    accent: COLORS.amber,
  },
  {
    value: "finance",
    label: t("settings.tabs.finance.label"),
    sub: t("settings.tabs.finance.sub"),
    icon: DollarSign,
    accent: COLORS.indigo,
  },
  {
    value: "players",
    label: t("settings.tabs.players.label"),
    sub: t("settings.tabs.players.sub"),
    icon: Users,
    accent: COLORS.blue,
  },
  {
    value: "media",
    label: t("settings.tabs.media.label"),
    sub: t("settings.tabs.media.sub"),
    icon: ImageIcon,
    accent: COLORS.red,
  },
];

export const TournamentTypeList = [
  { val: TournamentType.SINGLE, label: "Đơn" },
  { val: TournamentType.TEAM, label: "Đồng đội" },
];

export const TournamentFormatList = [
  { val: TournamentFormat.TOURNAMENT_TYPE_8_BALL.toString(), label: "8 Bi" },
  { val: TournamentFormat.TOURNAMENT_TYPE_9_BALL.toString(), label: "9 Bi" },
  { val: TournamentFormat.TOURNAMENT_TYPE_10_BALL.toString(), label: "10 Bi" },
];

const INPUT_BASE_CLS =
  "w-full px-3.5 py-2.5 text-[13px] text-white rounded-xl outline-none transition-all duration-150 focus:ring-2 focus:ring-white/10 placeholder-[#4a5568]";
const INPUT_STYLE = {
  background: COLORS.inputBg,
  border: `1px solid ${COLORS.inputBorder}`,
};

export const LInput = ({ className = "", ...p }) => (
  <input
    className={`${INPUT_BASE_CLS} ${className}`}
    style={INPUT_STYLE}
    {...p}
  />
);

export const LTextarea = ({ className = "", ...p }) => (
  <textarea
    className={`${INPUT_BASE_CLS} resize-none leading-relaxed ${className}`}
    style={INPUT_STYLE}
    {...p}
  />
);

export const LSelect = ({
  value,
  onValueChange,
  children,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <Select.Root value={value} onValueChange={onValueChange}>
    <Select.Trigger
      className={`${INPUT_BASE_CLS} flex items-center justify-between gap-2 cursor-pointer ${className}`}
      style={INPUT_STYLE}
    >
      <Select.Value />
      <Select.Icon asChild>
        <ChevronDown
          size={14}
          style={{ color: COLORS.iconGray, flexShrink: 0 }}
        />
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
          boxShadow:
            "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          overflow: "hidden",
          zIndex: 9999,
          minWidth: "var(--radix-select-trigger-width)",
          maxHeight: "var(--radix-select-content-available-height)",
        }}
      >
        <Select.ScrollUpButton className="flex items-center justify-center h-7 bg-white/[0.03] text-[#9aa4b4]">
          <ChevronDown size={12} className="rotate-180" />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-1.5">{children}</Select.Viewport>
        <Select.ScrollDownButton className="flex items-center justify-center h-7 bg-white/[0.03] text-[#9aa4b4]">
          <ChevronDown size={12} />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export const LSelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => (
  <Select.Item
    value={value}
    className="
      flex items-center justify-between gap-2 my-1
      px-3 py-2.5 rounded-[9px]
      text-[13px] text-[#b0bac8]
      cursor-pointer outline-none select-none
      transition-all duration-[120ms]
      hover:bg-white/[0.07] hover:text-white
      data-[state=checked]:bg-[rgba(16,185,129,0.1)] data-[state=checked]:text-[#10b981]
    "
  >
    <Select.ItemText>{children}</Select.ItemText>
    <Select.ItemIndicator>
      <Check size={13} style={{ color: COLORS.green, flexShrink: 0 }} />
    </Select.ItemIndicator>
  </Select.Item>
);

export const LTooltip = ({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) => (
  <Tooltip.Provider delayDuration={400}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          sideOffset={6}
          className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white z-[99999]"
          style={{
            background: COLORS.surfaceAlt,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {content}
          <Tooltip.Arrow style={{ fill: COLORS.surfaceAlt }} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export const Field = ({
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

export const CurrencyHint = ({ value }: { value: number }) =>
  value > 0 ? (
    <p className="text-[11px] mt-1" style={{ color: COLORS.indigo }}>
      ≈ {value.toLocaleString("vi-VN")} đồng
    </p>
  ) : null;

export const OPTIONS_MAXPLAYERS = [16, 32, 64, 128];

export const RANKING_CLASSES = [
  "CN",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "K",
];

interface SwitchProps extends React.ComponentPropsWithoutRef<
  typeof Switch.Root
> {
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    track: "w-8 h-[18px]",
    thumb: "size-[13px] data-[state=checked]:translate-x-[14px]",
  },
  md: {
    track: "w-[42px] h-6",
    thumb: "size-[18px] data-[state=checked]:translate-x-[18px]",
  },
  lg: {
    track: "w-[54px] h-[30px]",
    thumb: "size-[23px] data-[state=checked]:translate-x-[24px]",
  },
};

export const SwitchComp = ({
  size = "md",
  className,
  ...props
}: SwitchProps) => {
  const { track, thumb } = sizeConfig[size];

  return (
    <Switch.Root
      className={classNames(
        "inline-flex shrink-0 cursor-pointer items-center rounded-full",
        "border-none outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "data-[state=unchecked]:bg-gray-300",
        "data-[state=checked]:bg-blue-500",
        "disabled:cursor-not-allowed disabled:opacity-40",
        track,
        className,
      )}
      {...props}
    >
      <Switch.Thumb
        className={classNames(
          "pointer-events-none block rounded-full bg-white shadow-sm",
          "transition-transform duration-200 ease-[cubic-bezier(0.34,1.2,0.64,1)]",
          "translate-x-[3px]",
          thumb,
        )}
      />
    </Switch.Root>
  );
};
