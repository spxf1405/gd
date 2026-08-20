import { AntdThemeConfig } from "@/components/ui/antd-config";
import { useTournamentStore } from "@/store/match";
import { type Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { ConfigProvider, DatePicker, Input, theme } from "antd";
import dayjs from "dayjs";
import { Calendar, MapPin } from "lucide-react";
import React from "react";
import { type UseFormRegister } from "react-hook-form";
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

export const ScheduleTab = () => {
  const { t } = useTranslation();

  const { tournament } = useTournamentStore();

  const createdAt = dayjs(tournament?.createdAt);
  const startDate = dayjs(tournament?.startDate);

  return (
    <AntdThemeConfig>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f59e0b",
            colorInfo: "#f59e0b",
          },
        }}
      >
        <div className="flex flex-col gap-5">
          {/* <SectionHeader
            icon={<Calendar size={18} />}
            title={t("settings.schedule.title")}
            accent={COLORS.amber}
          /> */}
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("settings.schedule.createdDate")} required>
              <DatePicker
                size="large"
                className="font-bold"
                value={createdAt}
              />
            </Field>
            <Field label={t("settings.schedule.startDate")} required>
              <DatePicker
                size="large"
                className="font-bold"
                value={startDate}
              />
            </Field>
          </div>
          <Field label={t("settings.schedule.location")} required>
            <SearchInput />
          </Field>
        </div>
      </ConfigProvider>
    </AntdThemeConfig>
  );
};

const SearchInput = () => {
  const { useToken } = theme;

  const { t } = useTranslation();
  const { token } = useToken();

  return (
    <Input
      placeholder={t("settings.schedule.locationPlaceholder")}
      size="large"
      prefix={<MapPin size={16} style={{ color: token.colorPrimary }} />}
    />
  );
};
