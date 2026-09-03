import { AntdThemeConfig } from "@/components/ui/antd-config";
import { useTournamentStore } from "@/store/match";
import { ConfigProvider, DatePicker, Input, theme } from "antd";
import dayjs from "dayjs";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../consts/color";
import { Field } from "../../field/field";


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
            colorPrimary: COLORS.amber,
          },
        }}
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label={t("settings.schedule.createdDate")} required>
              <DatePicker
                size="large"
                value={createdAt}
              />
            </Field>
            <Field label={t("settings.schedule.startDate")} required>
              <DatePicker
                size="large"
                value={startDate}
              />
            </Field>
          </div>
          <Field label={t("settings.schedule.location")}>
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
