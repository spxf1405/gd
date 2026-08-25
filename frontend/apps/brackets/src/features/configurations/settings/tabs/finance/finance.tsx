import { PrizeDistributionTable } from "@/features/configurations/settings/tabs/finance/prize-distributiontable";
import { ConfigProvider, Form, Input, Select } from "antd";
import { Banknote, Coins, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CurrencyHint, Field } from "../../consts/input";
import { QSelect } from "@/components/ui/select";

function CurrencyInput({
  value,
  onChange,
}: {
  value?: number;
  onChange?: (v: number) => void;
}) {
  const { t } = useTranslation();

  const [display, setDisplay] = useState(
    value !== undefined && value !== null ? value.toLocaleString("vi-VN") : "",
  );

  useEffect(() => {
    setDisplay(
      value !== undefined && value !== null
        ? Number(value).toLocaleString("vi-VN")
        : "",
    );
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const stripped = raw.replace(/\./g, "");
    if (!/^\d*$/.test(stripped)) {
      return;
    }

    const formatted = stripped ? Number(stripped).toLocaleString("vi-VN") : "";
    setDisplay(formatted);
    onChange?.(stripped ? Number(stripped) : 0);
  };

  return (
    <Input
      size="large"
      className="!w-full"
      value={display}
      onChange={handleChange}
      placeholder={t("settings.finance.totalPrizePlaceholder")}
    />
  );
}

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
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 rounded-xl border border-indigo-500/20 bg-slate-900/5 p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-indigo-200 font-medium text-sm mb-4">
                <Coins className="w-4 h-4 text-indigo-500" />
                <span>
                  {t(
                    "settings.finance.prizeConfig",
                    "Cấu hình tiền thưởng & lệ phí",
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Field label={t("settings.finance.totalPrize")} required>
                    <Form.Item
                      name="totalPrize"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: t("settings.tabs.basic.fields.name"),
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
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: t("settings.tabs.basic.fields.name"),
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

            {/* Footer Card Trái */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>
                Đơn vị tính:{" "}
                <strong className="text-indigo-400 font-semibold">
                  {currencyUnit}
                </strong>
              </span>
              <span>
                Hệ thống tự động quy đổi bảng giải thưởng theo tổng tiền này.
              </span>
            </div>
          </div>

          {/* Card Phải (1/3 width): Currency Unit Settings */}
          <div className="lg:col-span-1 rounded-xl border border-indigo-500/20 bg-slate-900/5 p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-200 font-medium text-sm">
                  <Globe2 className="w-4 h-4 text-indigo-500" />
                  <span>
                    {t("settings.finance.currencyUnit", "Đơn vị tiền tệ")}
                  </span>
                </div>
                <span className="px-2 py-0.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 rounded-md border border-indigo-500/30">
                  {currencyUnit}
                </span>
              </div>

              <Field
                label={t(
                  "settings.finance.selectCurrency",
                  "Loại tiền tệ sử dụng",
                )}
              >
                <Form.Item name="currencyUnit" noStyle initialValue="VND">
                  <QSelect
                    size="large"
                    className="w-full"
                    options={[
                      { label: "VNĐ - Việt Nam Đồng (₫)", value: "VND" },
                      { label: "USD - US Dollar ($)", value: "USD" },
                    ]}
                  />
                </Form.Item>
              </Field>
            </div>

            {/* Format Preview Box */}
            <div className="mt-4 p-3 rounded-lg bg-slate-950/70 border border-indigo-500/20 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300/80">
                <Banknote className="w-3.5 h-3.5 text-indigo-400" />
                <span>Định dạng hiển thị mẫu</span>
              </div>
              <div className="text-sm font-semibold text-indigo-400">
                {isUSD ? "$1,000,000.00" : "10.000.000 ₫"}
              </div>
            </div>
          </div>
        </div>

        {/* Prize Distribution Table */}
        <Form.Item name="prizeDistributions" className="m-0">
          <PrizeDistributionTable onChange={() => console.log("1")} />
        </Form.Item>
      </div>
    </ConfigProvider>
  );
};
