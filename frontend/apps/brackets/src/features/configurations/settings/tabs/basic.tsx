import {
  TournamentFormat,
  TournamentType,
  type Tournament,
} from "@gd/proto/tournament/v1/tournament_pb";
import { Check, ChevronDown, Info } from "lucide-react";
import { Select } from "radix-ui";
import React from "react";
import {
  Controller,
  type Control,
  type UseFormRegister,
} from "react-hook-form";
import { COLORS } from "../consts/color";

const INPUT_BASE_CLS =
  "w-full px-3.5 py-2.5 text-[13px] text-white rounded-xl outline-none transition-all duration-150 focus:ring-2 focus:ring-white/10 placeholder-[#4a5568]";
const INPUT_STYLE = {
  background: COLORS.inputBg,
  border: `1px solid ${COLORS.inputBorder}`,
};

const LInput = ({ className = "", ...p }) => (
  <input
    className={`${INPUT_BASE_CLS} ${className}`}
    style={INPUT_STYLE}
    {...p}
  />
);

const LTextarea = ({ className = "", ...p }) => (
  <textarea
    className={`${INPUT_BASE_CLS} resize-none leading-relaxed ${className}`}
    style={INPUT_STYLE}
    {...p}
  />
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

const SectionHeader = ({
  icon,
  title,
  accent = COLORS.green,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: string;
}) => (
  <div
    className="flex items-center gap-3 pb-3 mb-1"
    style={{ borderBottom: `1px solid ${COLORS.borderFaint}` }}
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: `${accent}18`,
        border: `1px solid ${accent}30`,
        color: accent,
      }}
    >
      {icon}
    </div>
    <h3
      className="text-[17px] font-bold text-white"
      style={{ letterSpacing: "-0.02em" }}
    >
      {title}
    </h3>
  </div>
);

const TournamentTypeList = [
  { value: TournamentType.SINGLE.toString(), label: "Đơn" },
  { value: TournamentType.TEAM.toString(), label: "Đồng đội" },
];

const TournamentFormatList = [
  { value: TournamentFormat.TOURNAMENT_TYPE_8_BALL.toString(), label: "8 Bi" },
  { value: TournamentFormat.TOURNAMENT_TYPE_9_BALL.toString(), label: "9 Bi" },
  {
    value: TournamentFormat.TOURNAMENT_TYPE_10_BALL.toString(),
    label: "10 Bi",
  },
];

export const BasicTab = ({
  control,
  register,
}: {
  control: Control<Tournament, any, Tournament>;
  register: UseFormRegister<Tournament>;
}) => (
  <div className="flex flex-col gap-5">
    <SectionHeader
      icon={<Info size={18} />}
      title="Thông tin cơ bản"
      accent={COLORS.green}
    />
    <Field label="Tên giải đấu" required>
      <LInput
        {...register("name")}
        placeholder="VD: Giải Vô Địch 8-Ball Hà Nội 2026"
      />
    </Field>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-2">
        <Field label="Nội dung" required>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select.Root
                value={field.value.toString()}
                onValueChange={field.onChange}
              >
                <Select.Trigger
                  className={`${INPUT_BASE_CLS} flex items-center justify-between gap-2 cursor-pointer`}
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

                    <Select.Viewport className="p-1.5">
                      {TournamentTypeList.map(({ value, label }) => (
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
                          <Select.ItemText>{label}</Select.ItemText>
                          <Select.ItemIndicator>
                            <Check
                              size={13}
                              style={{ color: COLORS.green, flexShrink: 0 }}
                            />
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
            )}
          />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="Thể thức" required>
          <Controller
            name="format"
            control={control}
            render={({ field }) => (
              <Select.Root
                value={field.value.toString()}
                onValueChange={field.onChange}
              >
                <Select.Trigger
                  className={`${INPUT_BASE_CLS} flex items-center justify-between gap-2 cursor-pointer`}
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

                    <Select.Viewport className="p-1.5">
                      {TournamentFormatList.map(({ value, label }) => (
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
                          <Select.ItemText>{label}</Select.ItemText>
                          <Select.ItemIndicator>
                            <Check
                              size={13}
                              style={{ color: COLORS.green, flexShrink: 0 }}
                            />
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
            )}
          />
        </Field>
      </div>
      <div className="col-span-8">
        <Field label="Mô tả thêm thể thức" required={false}>
          <LInput
            {...register("formatDescription")}
            placeholder="Eg. Xếp Cao - Thắng Phá - WPA Rules"
          />
        </Field>
      </div>
    </div>
    <Field label="Ban tổ chức" required>
      <LInput {...register("organizer")} placeholder="VD: CLB Billard Golden" />
    </Field>
    <Field label="Mô tả giải đấu">
      <LTextarea
        {...register("description")}
        rows={3}
        placeholder="Mô tả chi tiết về giải đấu..."
      />
    </Field>
  </div>
);
