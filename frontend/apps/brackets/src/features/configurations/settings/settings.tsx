import { TournamentClient } from "@/helper/service-client";
import { useTournamentStore } from "@/store/match";
import { create } from "@bufbuild/protobuf";
import { type Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { UpdateTournamentRequestSchema } from "@gd/proto/tournament/v1/tournament_service_pb";
import { Form, Modal } from "antd";
import {
  Calendar,
  DollarSign,
  Grid2X2,
  Image as ImageIcon,
  Info,
  Settings,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Separator, Tabs } from "radix-ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { COLORS } from "./consts/color";
import { LTooltip } from "./consts/input";
import { BasicTab, FinanceTab, PlayersTab, ScheduleTab } from "./tabs/tabs";
import { AntdThemeConfig } from "@/components/ui/antd-config";
import { RoundsList } from "./tabs/format/row";

const TAB_CONFIG = (t: (key: string) => string) => [
  {
    value: "basic",
    label: t("settings.tabs.basic.label"),
    sub: t("settings.tabs.basic.sub"),
    icon: Info,
    accent: COLORS.green,
  },
  {
    value: "format",
    label: t("settings.tabs.format.label"),
    sub: t("settings.tabs.format.sub"),
    icon: Grid2X2,
    accent: COLORS.bronze,
  },
  {
    value: "players",
    label: t("settings.tabs.players.label"),
    sub: t("settings.tabs.players.sub"),
    icon: Users,
    accent: "#60A5FA",
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
    value: "media",
    label: t("settings.tabs.media.label"),
    sub: t("settings.tabs.media.sub"),
    icon: ImageIcon,
    accent: COLORS.red,
  },
];

const SidebarTab = ({ tab }: { tab: any }) => {
  const Icon = tab.icon;
  return (
    <Tabs.Trigger
      value={tab.value}
      className="group relative w-full text-left outline-none cursor-pointer p-0 bg-transparent border-0"
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-0 transition-all duration-200 scale-y-50 group-data-[state=active]:opacity-100 group-data-[state=active]:scale-y-100"
        style={{
          background: `linear-gradient(180deg, ${tab.accent}, ${tab.accent}70)`,
          boxShadow: `2px 0 10px ${tab.accent}70`,
        }}
      />
      <div className="relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 overflow-hidden hover:bg-white/[0.04]">
        <div
          className="absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-200 group-data-[state=active]:opacity-100 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${tab.accent}16 0%, ${tab.accent}08 100%)`,
          }}
        />
        <div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none transition-opacity duration-200 group-data-[state=active]:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${tab.accent}35` }}
        />
        <div className="relative w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 bg-white/[0.05] group-hover:bg-white/[0.08] group-data-[state=active]:bg-transparent">
          <div
            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-data-[state=active]:opacity-100"
            style={{
              background: `linear-gradient(135deg, ${tab.accent}38, ${tab.accent}18)`,
              boxShadow: `0 0 18px ${tab.accent}50, inset 0 1px 0 ${tab.accent}30`,
            }}
          />
          <span className="relative z-10 group-data-[state=active]:hidden">
            <Icon size={20} color={COLORS.iconGray} />
          </span>
          <span className="relative z-10 hidden group-data-[state=active]:inline-flex">
            <Icon size={20} color={tab.accent} />
          </span>
        </div>
        <div className="min-w-0 flex-1 relative z-10">
          <p className="text-[14px] font-semibold leading-tight text-[#9aa3b0] transition-colors duration-200 group-hover:text-[#ccd3db] group-data-[state=active]:text-white">
            {tab.label}
          </p>
          <p className="text-[11px] leading-tight mt-0.5">
            <span className="text-[#7a8494] group-data-[state=active]:hidden">
              {tab.sub}
            </span>
            <span
              className="hidden group-data-[state=active]:inline"
              style={{ color: tab.accent }}
            >
              {tab.sub}
            </span>
          </p>
        </div>
        <div className="relative z-10 flex-shrink-0 w-5 flex items-center justify-center">
          <div
            className="w-2 h-2 rounded-full opacity-0 scale-50 transition-all duration-200 group-data-[state=active]:opacity-100 group-data-[state=active]:scale-100"
            style={{
              background: tab.accent,
              boxShadow: `0 0 10px ${tab.accent}, 0 0 4px ${tab.accent}`,
            }}
          />
        </div>
      </div>
    </Tabs.Trigger>
  );
};

export const Setting = () => {
  const { t } = useTranslation();
  const { tournament } = useTournamentStore();
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm<Tournament>();

  useEffect(() => {
    if (tournament) {
      form.setFieldsValue(tournament);
    }
  }, [tournament, form]);

  const onFinish = async (data: Tournament) => {
    console.log("data", { ...tournament, ...data });
    const request = create(UpdateTournamentRequestSchema, {
      tournament: { ...tournament, ...data },
    });

    const response = await TournamentClient.updateTournament(request);
    console.log("form data", data);
    console.log("response", response);
    setOpen(false);
  };

  const handleSave = () => {
    form.submit();
  };

  const tabs = TAB_CONFIG(t);

  return (
    <AntdThemeConfig>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white cursor-pointer border-0 transition-all duration-200 hover:[border-color:rgba(255,255,255,0.2)]"
        style={{
          background: "linear-gradient(135deg, #1a1d27, #22263a)",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <Settings size={14} style={{ color: COLORS.green }} />
        {t("settings.trigger")}
      </button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        closable={false}
        centered
        width="72vw"
        styles={{
          container: {
            padding: 0,
          },
        }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: `1px solid ${COLORS.borderSubtle}`,
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5">
              {[COLORS.red, COLORS.amber, COLORS.green].map((c) => (
                <div
                  key={c}
                  className="w-3 h-3 rounded-full"
                  style={{ background: c }}
                />
              ))}
            </div>

            <Separator.Root
              orientation="vertical"
              className="w-px h-5"
              style={{ background: "rgba(255,255,255,0.08)" }}
            />

            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.green}4d, ${COLORS.indigo}33)`,
                  border: `1px solid ${COLORS.green}4d`,
                }}
              >
                <Trophy size={17} style={{ color: COLORS.green }} />
              </div>
              <div>
                <h4
                  className="text-[14px] font-bold text-white m-0"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {t("settings.title")}
                </h4>
                <p
                  className="text-[10px] mt-0.5 mb-0"
                  style={{
                    color: COLORS.textSecondary,
                    letterSpacing: "0.06em",
                  }}
                >
                  {t("settings.description")}
                </p>
              </div>
            </div>
          </div>

          <LTooltip content={t("settings.close")}>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-0 transition-all duration-150 hover:bg-[rgba(239,68,68,0.15)] hover:text-[#ef4444]"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: COLORS.closeBtnColor,
              }}
            >
              <X size={13} />
            </button>
          </LTooltip>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={tournament ?? ({} as Tournament)}
        >
          <Tabs.Root
            defaultValue="basic"
            className="flex flex-1 overflow-hidden"
          >
            <div
              className="flex-shrink-0 flex flex-col overflow-y-auto"
              style={{
                width: 330,
                borderRight: `1px solid ${COLORS.borderSubtle}`,
                background: COLORS.overlayBg,
                padding: "24px 16px",
              }}
            >
              <p
                className="text-[9px] font-bold tracking-[0.2em] uppercase pl-1 mb-2.5"
                style={{ color: COLORS.closeBtnColor }}
              >
                {t("settings.navigation")}
              </p>
              <Tabs.List className="flex flex-col gap-1.5">
                {tabs.map((tab) => (
                  <SidebarTab key={tab.value} tab={tab} />
                ))}
              </Tabs.List>
              <div className="mt-auto pt-4">
                <Separator.Root
                  className="h-px mb-3.5"
                  style={{ background: COLORS.borderFaint }}
                />
                <div
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                  style={{
                    background: `${COLORS.green}0f`,
                    border: `1px solid ${COLORS.green}1f`,
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      background: COLORS.green,
                      boxShadow: `0 0 8px ${COLORS.green}`,
                    }}
                  />
                  <div>
                    <p
                      className="text-[10px] font-semibold m-0"
                      style={{ color: COLORS.green }}
                    >
                      {t("settings.systemStatus.label")}
                    </p>
                    <p
                      className="text-[9px] mt-px mb-0"
                      style={{ color: COLORS.greenMuted }}
                    >
                      {t("settings.systemStatus.uptime")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="sys-scroll flex-1 overflow-y-auto"
              style={{ background: COLORS.surface }}
            >
              <Tabs.Content
                value="basic"
                className="outline-none p-8 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <BasicTab />
              </Tabs.Content>
              <Tabs.Content
                value="format"
                className="outline-none p-8 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <RoundsList />
              </Tabs.Content>
              <Tabs.Content
                value="schedule"
                className="outline-none p-8 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <ScheduleTab />
              </Tabs.Content>
              <Tabs.Content
                value="finance"
                className="outline-none p-8 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <FinanceTab />
              </Tabs.Content>
              <Tabs.Content
                value="players"
                className="outline-none p-8 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-1 duration-200"
              >
                <PlayersTab />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </Form>

        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-3.5"
          style={{
            borderTop: `1px solid ${COLORS.borderSubtle}`,
            background: COLORS.overlayDark,
          }}
        >
          <p
            className="text-[10px] tracking-[0.06em] m-0"
            style={{ color: COLORS.closeBtnColor }}
          >
            {t("settings.lastSaved")}
          </p>
          <div className="flex gap-2.5">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded-lg text-[12px] font-medium cursor-pointer border-0 transition-all duration-150 hover:bg-white/[0.09]"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: COLORS.cancelText,
                border: `1px solid ${COLORS.borderFaint}`,
              }}
            >
              {t("settings.cancel")}
            </button>

            <LTooltip content={t("settings.saveTooltip")}>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white cursor-pointer border-0 transition-all duration-150"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.greenDark})`,
                  boxShadow: `0 0 20px ${COLORS.green}40, 0 4px 12px rgba(0,0,0,0.3)`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 28px ${COLORS.green}66, 0 4px 12px rgba(0,0,0,0.3)`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = `0 0 20px ${COLORS.green}40, 0 4px 12px rgba(0,0,0,0.3)`)
                }
              >
                {t("settings.save")}
              </button>
            </LTooltip>
          </div>
        </div>
      </Modal>
    </AntdThemeConfig>
  );
};
