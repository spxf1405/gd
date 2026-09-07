import { QSelect } from "@/components/ui/select";
import { PrizeDistributionTable } from "@/features/configurations/settings/tabs/finance/prize-distributiontable";
import { ConfigProvider, Form, Input, type InputProps } from "antd";
import { Banknote, Coins, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Field } from "../../field/field";

export const CurrencyHint = ({
  value,
  unit,
}: {
  value: number;
  unit: string;
}) =>
  value > 0 ? (
    <p className="text-xs mt-1 text-indigo-500 font-medium">
      ≈ {Number(value).toLocaleString("vi-VN")} {unit}
    </p>
  ) : null;

export const CurrencyInput = ({ value, onChange, ...props }: InputProps) => {
  const { t } = useTranslation();

  const numericValue = value as unknown as number | undefined;

  const [display, setDisplay] = useState(
    numericValue !== undefined && numericValue !== null
      ? numericValue.toLocaleString("vi-VN")
      : "",
  );

  useEffect(() => {
    setDisplay(
      numericValue !== undefined && numericValue !== null
        ? Number(numericValue).toLocaleString("vi-VN")
        : "",
    );
  }, [numericValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const stripped = raw.replace(/\./g, "");
    if (!/^\d*$/.test(stripped)) {
      return;
    }

    const formatted = stripped ? Number(stripped).toLocaleString("vi-VN") : "";
    setDisplay(formatted);
    (onChange as unknown as (value: number) => void)?.(
      stripped ? Number(stripped) : 0,
    );
  };

  return (
    <Input
      size="large"
      className="!w-full"
      placeholder={t("settings.finance.totalPrizePlaceholder")}
      {...props}
      value={display}
      onChange={handleChange}
    />
  );
};

export const FinanceTab = () => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();

  const entryFee = Form.useWatch("entryFee", form);
  const totalPrize = Form.useWatch("totalPrize", form);
  const currencyUnit = Form.useWatch("currencyUnit", form) || "VND";

  const isUSD = currencyUnit === "USD";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6366f1",
        },
      }}
    >
      <div className="flex flex-col gap-6 overflow-y-auto max-h-50vh">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 rounded-xl border border-indigo-500/20 bg-slate-900/5 p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-indigo-200 font-medium text-sm mb-4">
                <Coins className="w-4 h-4 text-indigo-500" />
                <span>{t("settings.finance.prizeConfig")}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field label={t("settings.finance.totalPrize")} required>
                    <Form.Item
                      name="totalPrize"
                      rules={[
                        {
                          required: true,
                          message: t("settings.finance.totalPrizeError"),
                        },
                      ]}
                    >
                      <CurrencyInput
                        placeholder={t(
                          "settings.finance.totalPrizePlaceholder",
                        )}
                      />
                    </Form.Item>
                  </Field>
                  <CurrencyHint value={totalPrize} unit={currencyUnit} />
                </div>

                <div>
                  <Field label={t("settings.finance.entryFee")}>
                    <Form.Item
                      name="entryFee"
                      rules={[
                        {
                          required: true,
                          message: t("settings.finance.entryFeeError"),
                        },
                      ]}
                    >
                      <CurrencyInput
                        placeholder={t("settings.finance.entryFeePlaceholder")}
                      />
                    </Form.Item>
                  </Field>
                  <CurrencyHint value={entryFee} unit={currencyUnit} />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>
                {t("settings.finance.unitLabel")}{" "}
                <strong className="text-indigo-400 font-semibold">
                  {currencyUnit}
                </strong>
              </span>
              <span>{t("settings.finance.autoConvertHint")}</span>
            </div>
          </div>

          <div className="lg:col-span-1 rounded-xl border border-indigo-500/20 bg-slate-900/5 p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-200 font-medium text-sm">
                  <Globe2 className="w-4 h-4 text-indigo-500" />
                  <span>{t("settings.finance.currencyUnit")}</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 rounded-md border border-indigo-500/30">
                  {currencyUnit}
                </span>
              </div>

              <Field label={t("settings.finance.selectCurrency")}>
                <Form.Item name="currencyUnit" noStyle initialValue="VND">
                  <QSelect
                    size="large"
                    className="w-full"
                    allowClear={false}
                    options={[
                      {
                        label: t("settings.finance.currencyOptions.vnd"),
                        value: "VND",
                      },
                      {
                        label: t("settings.finance.currencyOptions.usd"),
                        value: "USD",
                      },
                    ]}
                  />
                </Form.Item>
              </Field>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-slate-950/70 border border-indigo-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300/80">
                <Banknote className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t("settings.finance.formatPreview")}</span>
              </div>
              <div className="text-sm font-semibold text-indigo-400">
                {isUSD ? "$1,000,000.00" : "10.000.000 ₫"}
              </div>
            </div>
          </div>
        </div>

        <PrizeDistributionTable />
      </div>
    </ConfigProvider>
  );
};
