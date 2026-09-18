import { useTournamentStore } from "@/store/match";
import { ConfigProvider, DatePicker, Form, Input, theme } from "antd";
import dayjs from "dayjs";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../consts/color";
import { Field } from "../../field/field";

export const ScheduleTab = () => {
  const { t } = useTranslation();
  const { useToken } = theme;
  const { token } = useToken();

  const { tournament } = useTournamentStore();

  const createdAt = dayjs(tournament?.createdAt);
  // const startDate = dayjs(tournament?.startDate);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: COLORS.amber,
        },
      }}
    >
      <Field label={t("settings.schedule.venue")} required>
        <Form.Item
          name="venue"
          rules={[
            {
              required: true,
              message: "Venue required!",
            },
          ]}
        >
          <Input
            placeholder={t("settings.schedule.venuePlaceholder")}
            size="large"
            prefix={<MapPin size={16} style={{ color: COLORS.amber }} />}
          />
        </Form.Item>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={t("settings.schedule.createdDate")}>
          <DatePicker
            size="large"
            styles={{
              input: {
                fontSize: 13,
              },
            }}
            value={createdAt}
            disabled={true}
          />
        </Field>
        {/* TODO: sử dụng heap và chan để giải quyết bài toán này */}
        {/* <Field label={t("settings.schedule.startDate")} required>
              <DatePicker
                size="large"
                value={startDate}
              />
            </Field> */}
      </div>
    </ConfigProvider>
  );
};
