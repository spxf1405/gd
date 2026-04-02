import { TournamentFormat, TournamentType, type Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { Check, ChevronDown, Info } from "lucide-react";
import { Select } from "radix-ui";
import React from "react";
import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { COLORS } from "../consts/color";

const INPUT_BASE_CLS =
  "w-full px-3.5 py-2.5 text-[13px] text-white rounded-xl outline-none transition-all duration-150 focus:ring-2 focus:ring-white/10 placeholder-[#4a5568]";

const INPUT_STYLE = {
  background: COLORS.inputBg,
  border: `1px solid ${COLORS.inputBorder}`,
};

const LInput = ({ className = "", ...p }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`${INPUT_BASE_CLS} ${className}`} style={INPUT_STYLE} {...p} />
);

const LTextarea = ({ className = "", ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
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
    <h3 className="text-[17px] font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
      {title}
    </h3>
  </div>
);

export const BasicTab = ({
  control,
  register,
}: {
  control: Control<Tournament, any, Tournament>;
  register: UseFormRegister<Tournament>;
}) => {
  const { t } = useTranslation();

  const TournamentTypeList = [
    { value: TournamentType.SINGLE.toString(), label: t("tournament.type.single") },
    { value: TournamentType.TEAM.toString(), label: t("tournament.type.team") },
  ];

  const TournamentFormatList = [
    { value: TournamentFormat.TOURNAMENT_TYPE_8_BALL.toString(), label: t("tournament.format.8ball") },
    { value: TournamentFormat.TOURNAMENT_TYPE_9_BALL.toString(), label: t("tournament.format.9ball") },
    { value: TournamentFormat.TOURNAMENT_TYPE_10_BALL.toString(), label: t("tournament.format.10ball") },
  ];

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        icon={<Info size={18} />}
        title={t("settings.tabs.basic.sectionTitle")}
        accent={COLORS.green}
      />

      <Field label={t("settings.tabs.basic.fields.name")} required>
        <LInput
          {...register("name")}
          placeholder={t("settings.tabs.basic.fields.namePlaceholder")}
        />
      </Field>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2">
          <Field label={t("settings.tabs.basic.fields.type")} required>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select.Root value={field.value.toString()} onValueChange={field.onChange}>
                  <Select.Trigger
                    className={`${INPUT_BASE_CLS} flex items-center justify-between gap-2 cursor-pointer`}
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
                        {TournamentTypeList.map(({ value, label }) => (
                          <Select.Item
                            key={value}
                            value={value}
                            className="flex items-center justify-between gap-2 my-1 px-3 py-2.5 rounded-[9px] text-[13px] text-[#b0bac8] cursor-pointer outline-none select-none transition-all duration-[120ms] hover:bg-white/[0.07] hover:text-white data-[state=checked]:bg-[rgba(16,185,129,0.1)] data-[state=checked]:text-[#10b981]"
                          >
                            <Select.ItemText>{label}</Select.ItemText>
                            <Select.ItemIndicator>
                              <Check size={13} style={{ color: COLORS.green, flexShrink: 0 }} />
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
          <Field label={t("settings.tabs.basic.fields.format")} required>
            <Controller
              name="format"
              control={control}
              render={({ field }) => (
                <Select.Root value={field.value.toString()} onValueChange={field.onChange}>
                  <Select.Trigger
                    className={`${INPUT_BASE_CLS} flex items-center justify-between gap-2 cursor-pointer`}
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
                        {TournamentFormatList.map(({ value, label }) => (
                          <Select.Item
                            key={value}
                            value={value}
                            className="flex items-center justify-between gap-2 my-1 px-3 py-2.5 rounded-[9px] text-[13px] text-[#b0bac8] cursor-pointer outline-none select-none transition-all duration-[120ms] hover:bg-white/[0.07] hover:text-white data-[state=checked]:bg-[rgba(16,185,129,0.1)] data-[state=checked]:text-[#10b981]"
                          >
                            <Select.ItemText>{label}</Select.ItemText>
                            <Select.ItemIndicator>
                              <Check size={13} style={{ color: COLORS.green, flexShrink: 0 }} />
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
          <Field label={t("settings.tabs.basic.fields.formatDescription")}>
            <LInput
              {...register("formatDescription")}
              placeholder={t("settings.tabs.basic.fields.formatDescriptionPlaceholder")}
            />
          </Field>
        </div>
      </div>

      <Field label={t("settings.tabs.basic.fields.organizer")} required>
        <LInput
          {...register("organizer")}
          placeholder={t("settings.tabs.basic.fields.organizerPlaceholder")}
        />
      </Field>

      <Field label={t("settings.tabs.basic.fields.description")}>
        <LTextarea
          {...register("description")}
          rows={3}
          placeholder={t("settings.tabs.basic.fields.descriptionPlaceholder")}
        />
      </Field>
    </div>
  );
};