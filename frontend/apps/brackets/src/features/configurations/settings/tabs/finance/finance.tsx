import { DollarSign } from "lucide-react";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../consts/color";
import { CurrencyHint, Field, LInput } from "../../consts/input";
import { SectionHeader } from "../../header/tab-header";
import { PrizeDistributionTable } from "@/features/configurations/settings/tabs/finance/finance-distributiontable";
import {
  Controller,
  type Control,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";

export const FinanceTab = ({
  control,
  register,
  watch,
}: {
  control: Control<Tournament, any, Tournament>;
  register: UseFormRegister<Tournament>;
  watch: UseFormWatch<Tournament>;
}) => {
  const { t } = useTranslation();
  const totalPrize = watch("totalPrize");
  const entryFee = watch("entryFee");
  const prizes = watch("prizes") ?? [];

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        icon={<DollarSign size={18} />}
        title={t("settings.finance.title")}
        accent={COLORS.indigo}
      />

      <Field label={t("settings.finance.totalPrize")} required>
        <div className="relative">
          <DollarSign
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: COLORS.indigo }}
          />
          <LInput
            type="number"
            {...register("totalPrize", { valueAsNumber: true })}
            placeholder={t("settings.finance.totalPrizePlaceholder")}
            className="!pl-10 h-11 text-base"
          />
        </div>
        <CurrencyHint value={totalPrize} />
      </Field>

      <Field label={t("settings.finance.entryFee")}>
        <LInput
          type="number"
          {...register("entryFee", { valueAsNumber: true })}
          placeholder={t("settings.finance.entryFeePlaceholder")}
          className="h-11 text-base"
        />
        <CurrencyHint value={entryFee} />
      </Field>

      {(totalPrize > 0 || prizes.length > 0) && (
        <Controller
          name="prizes"
          control={control}
          render={({ field }) => (
            <PrizeDistributionTable
              totalPrize={totalPrize || 0}
              value={field.value ?? []}
              onChange={field.onChange}
            />
          )}
        />
      )}
    </div>
  );
};
