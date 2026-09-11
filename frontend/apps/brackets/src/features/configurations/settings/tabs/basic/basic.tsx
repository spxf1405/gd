import { QSelect } from "@/components/ui/select";
import {
  TournamentFormat,
  TournamentType,
} from "@gd/proto/tournament/v1/tournament_pb";
import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";
import { Field } from "../../field/field";

export const BasicTab = () => {
  const { t } = useTranslation();

  const TournamentTypeList = [
    {
      value: TournamentType.SINGLE.toString(),
      label: t("tournament.type.single"),
    },
    {
      value: TournamentType.TEAM.toString(),
      label: t("tournament.type.team"),
    },
  ];

  const TournamentFormatList = [
    {
      value: TournamentFormat.TOURNAMENT_TYPE_8_BALL.toString(),
      label: t("tournament.format.8ball"),
    },
    {
      value: TournamentFormat.TOURNAMENT_TYPE_9_BALL.toString(),
      label: t("tournament.format.9ball"),
    },
    {
      value: TournamentFormat.TOURNAMENT_TYPE_10_BALL.toString(),
      label: t("tournament.format.10ball"),
    },
  ];

  return (
    <div className="flex flex-col">
      <Field label={t("settings.tabs.basic.fields.name")} required>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: t("settings.tabs.basic.fields.nameEmptyError"),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={t("settings.tabs.basic.fields.namePlaceholder")}
          />
        </Form.Item>
      </Field>

      <div className="flex gap-4">
        <Field label={t("settings.tabs.basic.fields.type")} required>
          <Form.Item
            name="type"
            initialValue={TournamentType.SINGLE.toString()}
            normalize={(value) => (value !== undefined ? Number(value) : value)}
            getValueProps={(value) => ({
              value: value !== undefined ? String(value) : undefined,
            })}
            rules={[{ required: true }]}
          >
            <QSelect
              size="large"
              options={TournamentTypeList}
              allowClear={false}
              classNames={{
                content: "w-20",
              }}
            />
          </Form.Item>
        </Field>

        <Field label={t("settings.tabs.basic.fields.format")} required>
          <Form.Item
            name="format"
            initialValue={TournamentFormat.TOURNAMENT_TYPE_8_BALL.toString()}
            normalize={(value) => (value !== undefined ? Number(value) : value)}
            getValueProps={(value) => ({
              value: value !== undefined ? String(value) : undefined,
            })}
            rules={[{ required: true }]}
          >
            <QSelect
              size="large"
              allowClear={false}
              options={TournamentFormatList}
              classNames={{
                content: "w-20",
              }}
            />
          </Form.Item>
        </Field>

        <div className="flex-1">
          <Field label={t("settings.tabs.basic.fields.formatDescription")}>
            <Form.Item name="formatDescription">
              <Input
                size="large"
                className="w-full"
                placeholder={t(
                  "settings.tabs.basic.fields.formatDescriptionPlaceholder",
                )}
              />
            </Form.Item>
          </Field>
        </div>
      </div>

      <Field label={t("settings.tabs.basic.fields.organizer")}>
        <Form.Item name="organizer">
          <Input
            size="large"
            placeholder={t("settings.tabs.basic.fields.organizerPlaceholder")}
          />
        </Form.Item>
      </Field>

      <Field label={t("settings.tabs.basic.fields.description")}>
        <Form.Item name="description">
          <TextArea
            placeholder={t("settings.tabs.basic.fields.descriptionPlaceholder")}
            rows={6}
          />
        </Form.Item>
      </Field>
    </div>
  );
};
