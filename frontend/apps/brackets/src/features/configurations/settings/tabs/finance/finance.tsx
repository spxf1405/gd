import { PrizeDistributionTable } from "@/features/configurations/settings/tabs/finance/prize-distributiontable";
import { Form, Input } from "antd";
import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../consts/color";
import { CurrencyHint, Field } from "../../consts/input";
import { SectionHeader } from "../../header/tab-header";
import { useTournamentStore } from "@/store/match";

export const FinanceTab = () => {
  const { t } = useTranslation();

  const tournament = useTournamentStore();

  const form = Form.useFormInstance();
  const totalPrize = Form.useWatch("totalPrize", form);
  const entryFee = Form.useWatch("entryFee", form);
  const prizeDistributions = Form.useWatch("prizeDistributions") ?? [];

  console.log("tournament", tournament);
  console.log("prizeDistributions", prizeDistributions);

  const totalPrizeInNumber =
    typeof totalPrize === "number" ? totalPrize : parseFloat(totalPrize || "0");

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        icon={<DollarSign size={18} />}
        title={t("settings.finance.title")}
        accent={COLORS.indigo}
      />

      <DollarSign
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: COLORS.indigo }}
      />
      <Field label={t("settings.finance.totalPrize")} required>
        <Form.Item
          name="name"
          noStyle
          rules={[
            { required: true, message: t("settings.tabs.basic.fields.name") },
          ]}
        >
          <Input
            size="large"
            placeholder={t("settings.finance.totalPrizePlaceholder")}
          />
        </Form.Item>
      </Field>
      <CurrencyHint value={totalPrize} />

      <Field label={t("settings.finance.entryFee")}>
        {/* <LInput
          type="number"
          {...register("entryFee", { valueAsNumber: true })}
          placeholder={t("settings.finance.entryFeePlaceholder")}
          className="h-11 text-base"
        /> */}
        <CurrencyHint value={entryFee} />
      </Field>

      <Form.Item name="prizeDistributions">
        <PrizeDistributionTable
          totalPrize={totalPrizeInNumber}
          value={prizeDistributions}
          onChange={() => console.log("1", 1)}
        />
      </Form.Item>
    </div>
  );
};
