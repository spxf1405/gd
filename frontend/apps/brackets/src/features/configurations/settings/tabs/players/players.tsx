import { ConfigProvider, Form, InputNumber, Select, Slider, Switch } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { useTranslation } from "react-i18next";
import { Field, RANKING_CLASSES } from "../../consts/input";

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

  const currentIndex = Math.max(
    0,
    RANKING_CLASSES.indexOf(maxRankingClass ?? RANKING_CLASSES[0]),
  );

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
          <div className="group rounded-xl hover:border-blue-300/50 transition-all duration-200">
            <Field label={t("settings.players.gender")} required>
              <Form.Item name="gender" noStyle>
                <Select className="w-full" size="large">
                  {genderOptions.map((v) => (
                    <Select.Option key={v} value={v}>
                      {v}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Field>
          </div>
          <div className="rounded-xl transition-all duration-200">
            <Field label={t("settings.players.maxAge")} required>
              <div className="relative max-w-[160px]">
                <Form.Item
                  name="maxAge"
                  noStyle
                  normalize={(value) => (value === 0 ? undefined : value)}
                >
                  <InputNumber
                    size="large"
                    className="w-full"
                    min={0}
                    controls={false}
                  />
                </Form.Item>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  {t("settings.players.maxAgeUnit")}
                </span>
              </div>
            </Field>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {t("settings.players.ranking.title")}
            </span>
            <Form.Item name="hasRanking" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>
        </div>

        <div
          className={`
          rounded-xl border transition-all duration-300 overflow-hidden
          ${
            hasRanking
              ? "border-blue-400/40 bg-blue-500/5"
              : "[border-color:rgba(255,255,255,0.2)]"
          }
        `}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {hasRanking
                  ? t("settings.players.ranking.descriptionOn")
                  : t("settings.players.ranking.descriptionOff")}
              </p>
            </div>
          </div>

          {hasRanking && (
            <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="h-px bg-blue-200/60 mb-4" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
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
                      RANKING_CLASSES.indexOf(value ?? RANKING_CLASSES[0]),
                    ),
                  })}
                >
                  <Slider
                    min={0}
                    max={RANKING_CLASSES.length - 1}
                    step={1}
                    tooltip={{ formatter: (i) => RANKING_CLASSES[i ?? 0] }}
                  />
                </Form.Item>

                <div className="flex justify-between">
                  {RANKING_CLASSES.map((v, i) => (
                    <span
                      key={v}
                      className={`text-[11px] font-medium transition-colors cursor-pointer ${
                        i === currentIndex
                          ? "text-blue-500"
                          : "text-muted-foreground"
                      }`}
                      onClick={() => form.setFieldValue("maxRankingClass", v)}
                    >
                      {v}
                    </span>
                  ))}
                </div>

                {maxRankingClass && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-500 text-xs font-semibold">
                    <span>≤</span>
                    <span>{maxRankingClass}</span>
                    <span className="text-blue-400 font-normal">
                      rank required
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
};
