import { create } from "@bufbuild/protobuf";
import { type Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { UpdateTournamentRequestSchema } from "@gd/proto/tournament/v1/tournament_service_pb";
import {
  Button,
  ConfigProvider,
  Divider,
  Modal,
  Tabs,
  Tooltip,
  theme,
} from "antd";
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
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { TournamentClient } from "@/helper/service-client";
import { useTournamentStore } from "@/store/match";

import { COLORS } from "./consts/color";
import { FormatTab } from "./tabs/format";
import { BasicTab, FinanceTab, PlayersTab, ScheduleTab } from "./tabs/tabs";
import { AntdThemeConfig } from "@/components/ui/antd-config";

// Cấu hình danh sách tab cùng với icon & màu accent
const getTabConfig = (t: (key: string) => string) => [
  {
    key: "basic",
    label: t("settings.tabs.basic.label"),
    sub: t("settings.tabs.basic.sub"),
    icon: Info,
    accent: COLORS.green,
  },
  {
    key: "format",
    label: t("settings.tabs.format.label"),
    sub: t("settings.tabs.format.sub"),
    icon: Grid2X2,
    accent: COLORS.bronze,
  },
  {
    key: "schedule",
    label: t("settings.tabs.schedule.label"),
    sub: t("settings.tabs.schedule.sub"),
    icon: Calendar,
    accent: COLORS.amber,
  },
  {
    key: "finance",
    label: t("settings.tabs.finance.label"),
    sub: t("settings.tabs.finance.sub"),
    icon: DollarSign,
    accent: COLORS.indigo,
  },
  {
    key: "players",
    label: t("settings.tabs.players.label"),
    sub: t("settings.tabs.players.sub"),
    icon: Users,
    accent: COLORS.blue,
  },
  {
    key: "media",
    label: t("settings.tabs.media.label"),
    sub: t("settings.tabs.media.sub"),
    icon: ImageIcon,
    accent: COLORS.red,
  },
];

// Sub-component render Custom Sidebar Tab Item cho Antd Tabs
const CustomTabLabel = ({
  tab,
  isActive,
}: {
  tab: ReturnType<typeof getTabConfig>[number];
  isActive: boolean;
}) => {
  const Icon = tab.icon;

  return (
    <div
      className={`group relative w-[290px] text-left outline-none cursor-pointer transition-all duration-200 ${
        isActive ? "is-active" : ""
      }`}
    >
      {/* Indicator thanh dọc bên trái khi Active */}
      <div
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-200 ${
          isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
        }`}
        style={{
          background: `linear-gradient(180deg, ${tab.accent}, ${tab.accent}70)`,
          boxShadow: `2px 0 10px ${tab.accent}70`,
        }}
      />

      <div className="relative flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 overflow-hidden hover:bg-white/[0.04]">
        {/* Active background glow */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-200 rounded-2xl ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: `linear-gradient(135deg, ${tab.accent}16 0%, ${tab.accent}08 100%)`,
          }}
        />

        {/* Active border glow */}
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-200 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
          style={{ boxShadow: `inset 0 0 0 1px ${tab.accent}35` }}
        />

        {/* Icon wrapper */}
        <div
          className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            isActive
              ? "bg-transparent"
              : "bg-white/[0.05] group-hover:bg-white/[0.08]"
          }`}
        >
          {isActive && (
            <div
              className="absolute inset-0 rounded-xl transition-opacity duration-200"
              style={{
                background: `linear-gradient(135deg, ${tab.accent}38, ${tab.accent}18)`,
                boxShadow: `0 0 18px ${tab.accent}50, inset 0 1px 0 ${tab.accent}30`,
              }}
            />
          )}
          <Icon
            size={19}
            color={isActive ? tab.accent : COLORS.iconGray}
            className="relative z-10 transition-colors duration-200"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="min-w-0 flex-1 relative z-10">
          <p
            className={`text-[13.5px] font-semibold leading-tight transition-colors duration-200 ${
              isActive
                ? "text-white"
                : "text-[#9aa3b0] group-hover:text-[#ccd3db]"
            }`}
          >
            {tab.label}
          </p>
          <p
            className="text-[11px] leading-tight mt-0.5 transition-colors duration-200"
            style={{ color: isActive ? tab.accent : "#7a8494" }}
          >
            {tab.sub}
          </p>
        </div>

        {/* Active Glowing Dot */}
        <div className="relative z-10 flex-shrink-0 w-4 flex items-center justify-center">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              isActive ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{
              background: tab.accent,
              boxShadow: `0 0 10px ${tab.accent}, 0 0 4px ${tab.accent}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const Setting = () => {
  const { t } = useTranslation();
  const { tournament } = useTournamentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("basic");

  const { control, register, watch, reset, handleSubmit } = useForm<Tournament>(
    {
      defaultValues: {} as Tournament,
    },
  );

  useEffect(() => {
    if (tournament) {
      reset(tournament);
    }
  }, [tournament, reset]);

  const onSubmit = async (data: Tournament) => {
    try {
      const request = create(UpdateTournamentRequestSchema, {
        tournament: { ...tournament, ...data },
      });

      const response = await TournamentClient.updateTournament(request);
      console.log("Updated successfully:", response);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update tournament:", error);
    }
  };

  const tabsConfig = useMemo(() => getTabConfig(t), [t]);

  const tabItems = useMemo(() => {
    const renderContent = (key: string) => {
      switch (key) {
        case "basic":
          return <BasicTab />;
        case "format":
          return <FormatTab control={control} register={register} />;
        case "schedule":
          return <ScheduleTab />;
        case "finance":
          return (
            <FinanceTab control={control} register={register} watch={watch} />
          );
        case "players":
          return <PlayersTab control={control} watch={watch} />;
        default:
          return <div className="text-gray-400">Content coming soon...</div>;
      }
    };

    return tabsConfig.map((tab) => ({
      key: tab.key,
      label: <CustomTabLabel tab={tab} isActive={activeTabKey === tab.key} />,
      children: (
        <div className="p-8 sys-scroll overflow-y-auto max-h-[calc(82vh-130px)]">
          {renderContent(tab.key)}
        </div>
      ),
    }));
  }, [tabsConfig, activeTabKey, control, register, watch]);

  return (
    <AntdThemeConfig>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white cursor-pointer border-0 transition-all duration-200 hover:brightness-125"
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
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        closable={false}
        width="74vw"
        centered
        styles={{
          content: {
            height: "82vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `1px solid ${COLORS.border}`,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,0,0,0.4)",
          },
        }}
      >
        {/* Top Glow Border */}
        <div
          className="absolute top-0 left-[20%] right-[20%] h-px pointer-events-none z-20"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",
          }}
        />

        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-6">
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

            <Divider
              type="vertical"
              className="h-5 my-0"
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
                <h3
                  className="text-[14px] font-bold text-white m-0 leading-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {t("settings.title")}
                </h3>
                <p
                  className="text-[10px] m-0 mt-0.5 leading-tight"
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

          <Tooltip title={t("settings.close")}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-0 transition-all duration-150 hover:bg-[rgba(239,68,68,0.15)] hover:text-[#ef4444]"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: COLORS.closeBtnColor,
              }}
            >
              <X size={13} />
            </button>
          </Tooltip>
        </div>

        {/* Modal Body with Antd Tabs */}
        <div className="flex-1 flex overflow-hidden">
          <Tabs
            tabPosition="left"
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            items={tabItems}
            className="w-full custom-antd-settings-tabs"
          />
        </div>

        {/* Modal Footer */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-3.5 z-10"
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
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg text-[12px] font-medium cursor-pointer transition-all duration-150 hover:bg-white/[0.09]"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: COLORS.cancelText,
                border: `1px solid ${COLORS.borderFaint}`,
              }}
            >
              {t("settings.cancel")}
            </button>

            <Tooltip title={t("settings.saveTooltip")}>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="px-5 py-2 rounded-lg text-[12px] font-semibold text-white cursor-pointer border-0 transition-all duration-150"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.greenDark})`,
                  boxShadow: `0 0 20px ${COLORS.green}40, 0 4px 12px rgba(0,0,0,0.3)`,
                }}
              >
                {t("settings.save")}
              </button>
            </Tooltip>
          </div>
        </div>
      </Modal>

      {/* CSS override ẩn thanh gạch mặc định của Antd Tabs & style sidebar scroll */}
      <style>{`
        .custom-antd-settings-tabs .ant-tabs-nav {
          width: 330px !important;
          background: ${COLORS.overlayBg};
          padding: 20px 16px;
          border-right: 1px solid ${COLORS.borderSubtle};
          margin: 0 !important;
        }
        .custom-antd-settings-tabs .ant-tabs-ink-bar {
          display: none !important;
        }
        .custom-antd-settings-tabs .ant-tabs-content-holder {
          background: ${COLORS.surface};
        }
        .custom-antd-settings-tabs .ant-tabs-tab {
          padding: 0 !important;
          margin-bottom: 8px !important;
        }
      `}</style>
    </AntdThemeConfig>
  );
};
