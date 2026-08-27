import { QSelect } from "@/components/ui/select";
import { ConfigProvider, Form, InputNumber, Slider, Switch } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { useTranslation } from "react-i18next";
import { Field } from "../../field/field";

export const RANKING_CLASSES = [
  "K",
  "I",
  "H",
  "G",
  "F",
  "E",
  "D",
  "C",
  "B",
  "A",
  "PRO",
];

const RANKING_MARKS = Object.fromEntries(
  RANKING_CLASSES.map((rank, index) => [index, rank]),
);

export const PlayersTab = () => {
  const form = useFormInstance();
  const { t } = useTranslation();

  const hasRanking = Form.useWatch("hasRanking", form);
  const maxRankingClass = Form.useWatch("maxRankingClass", form);

  const genderOptions = [
    t("settings.options.gender.all"),
    t("settings.options.gender.male"),
    t("settings.options.gender.female"),
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#60A5FA",
          colorInfo: "#60A5FA",
        },
      }}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("settings.players.gender")} required>
            <Form.Item name="gender" noStyle>
              <QSelect
                className="w-full"
                size="large"
                options={genderOptions.map((e) => ({
                  key: e,
                  value: e,
                }))}
              />
            </Form.Item>
          </Field>

          <Field label={t("settings.players.maxAge")} required>
            <Form.Item
              name="maxAge"
              noStyle
              normalize={(value) => (value === 0 ? undefined : value)}
            >
              <InputNumber
                size="large"
                className="!w-full"
                min={0}
                controls={false}
              />
            </Form.Item>
          </Field>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {t("settings.players.ranking.title")}
            </span>

            <Form.Item
              name="hasRanking"
              valuePropName="checked"
              noStyle
            >
              <Switch />
            </Form.Item>
          </div>
        </div>

        <div
          className={`
            overflow-hidden rounded-xl border transition-all duration-300
            ${
              hasRanking
                ? "border-blue-400/40 bg-blue-500/5"
                : "[border-color:rgba(255,255,255,0.2)]"
            }
          `}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {hasRanking
                  ? t("settings.players.ranking.descriptionOn")
                  : t("settings.players.ranking.descriptionOff")}
              </p>
            </div>
          </div>

          {hasRanking && (
            <div className="animate-in slide-in-from-top-1 fade-in px-4 pb-4 duration-200">
              <div className="mb-4 h-px bg-blue-200/60" />

              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {t("settings.players.ranking.rankLimit")}
              </p>

              <div className="space-y-3">
                <Form.Item
                  name="maxRankingClass"
                  noStyle
                  normalize={(value) =>
                    RANKING_CLASSES[value] ?? RANKING_CLASSES[0]
                  }
                  getValueProps={(value) => ({
                    value: Math.max(
                      0,
                      RANKING_CLASSES.indexOf(
                        value ?? RANKING_CLASSES[0],
                      ),
                    ),
                  })}
                >
                  <Slider
                    min={0}
                    max={RANKING_CLASSES.length - 1}
                    step={1}
                    marks={RANKING_MARKS}
                    tooltip={{
                      formatter: (value) =>
                        RANKING_CLASSES[value ?? 0],
                    }}
                  />
                </Form.Item>

                {maxRankingClass && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-500">
                    <span>≤</span>
                    <span>{maxRankingClass}</span>
                    <span className="font-normal text-blue-400">
                      rank required
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-xs italic">
          (*) Cài đặt tuổi tối đa đặc biệt hữu ích nếu bạn đang tổ chức một
          giải đấu junior!
        </div>
      </div>
    </ConfigProvider>
  );
};