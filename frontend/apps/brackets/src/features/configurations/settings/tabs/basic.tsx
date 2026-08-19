import { QSelect } from "@/components/ui/select";
import {
  TournamentFormat,
  TournamentType
} from "@gd/proto/tournament/v1/tournament_pb";
import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Info } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../consts/color";

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
    <div className="flex flex-col gap-5">
      {/* <SectionHeader
        icon={<Info size={18} />}
        title={t("settings.tabs.basic.sectionTitle")}
        accent={COLORS.green}
      /> */}

      <Field label={t("settings.tabs.basic.fields.name")} required>
        <Form.Item
          name="name"
          noStyle
          rules={[{ required: true, message: t("settings.tabs.basic.fields.name") }]}
        >
          <Input size="large" />
        </Form.Item>
      </Field>

      <div className="flex gap-4">
        <Field label={t("settings.tabs.basic.fields.type")} required>
          <Form.Item
            name="type"
            noStyle
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
              className="w-56"
              style={{ fontSize: 13 }}
            />
          </Form.Item>
        </Field>

        <Field label={t("settings.tabs.basic.fields.format")} required>
          <Form.Item
            name="format"
            noStyle
            initialValue={TournamentFormat.TOURNAMENT_TYPE_8_BALL.toString()}
            normalize={(value) => (value !== undefined ? Number(value) : value)}
            getValueProps={(value) => ({
              value: value !== undefined ? String(value) : undefined,
            })}
            rules={[{ required: true }]}
          >
            <QSelect size="large" options={TournamentFormatList} className="w-56" />
          </Form.Item>
        </Field>

        <div className="flex-1">
          <Field
            label={t("settings.tabs.basic.fields.formatDescription")}
            required
          >
            <Form.Item
              name="formatDescription"
              noStyle
              rules={[{ required: true }]}
            >
              <Input size="large" className="w-full" />
            </Form.Item>
          </Field>
        </div>
      </div>

      <Field label={t("settings.tabs.basic.fields.organizer")} required>
        <Form.Item
          name="organizer"
          noStyle
          rules={[{ required: true }]}
        >
          <Input size="large" />
        </Form.Item>
      </Field>

      <Field label={t("settings.tabs.basic.fields.description")} required>
        <Form.Item
          name="description"
          noStyle
          rules={[{ required: true }]}
        >
          <TextArea
            placeholder={t("settings.tabs.basic.fields.descriptionPlaceholder")}
            rows={6}
          />
        </Form.Item>
      </Field>
    </div>
  );
};