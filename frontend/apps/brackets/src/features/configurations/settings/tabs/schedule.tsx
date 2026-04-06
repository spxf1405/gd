import { CalendarPicker } from "@/components/ui/calendar";
import {
    type Tournament
} from "@gd/proto/tournament/v1/tournament_pb";
import {
    Calendar,
    MapPin
} from "lucide-react";
import React from "react";
import {
    type UseFormRegister
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { COLORS } from "../consts/color";
import { SectionHeader } from "../header/tab-header";


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

export const ScheduleTab = ({
  register,
}: {
  register: UseFormRegister<Tournament>;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        icon={<Calendar size={18} />}
        title={t("settings.schedule.title")}
        accent={COLORS.amber}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label={t("settings.schedule.createdDate")} required>
          <CalendarPicker iconClassName="text-amber-500" />
        </Field>
        <Field label={t("settings.schedule.startDate")} required>
          <CalendarPicker iconClassName="text-amber-500" />
        </Field>
      </div>
      <Field label={t("settings.schedule.location")} required>
        <div className="relative">
          <MapPin
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: COLORS.amber }}
          />
          <LInput
            {...register("location")}
            placeholder={t("settings.schedule.locationPlaceholder")}
            className="!pl-9"
          />
        </div>
      </Field>
    </div>
  );
};
