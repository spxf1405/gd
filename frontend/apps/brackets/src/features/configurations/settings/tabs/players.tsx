import { type Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { Trophy, Users } from "lucide-react";
import { Controller, type Control, type UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  LInput,
  LSelect,
  LSelectItem,
  OPTIONS_MAXPLAYERS,
  RANKING_CLASSES,
  SwitchComp,
} from "../consts/input";

export const PlayersTab = ({
  control,
  watch,
}: {
  control: Control<Tournament, any, Tournament>;
  watch: UseFormWatch<Tournament>;
}) => {
  const { t } = useTranslation();
  const hasRanking = watch("hasRanking");

  const genderOptions = [
    t("settings.options.gender.all"),
    t("settings.options.gender.male"),
    t("settings.options.gender.female"),
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500">
          <Users size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground leading-none">
            {t("settings.players.title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("settings.players.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="group rounded-xl p-3.5 hover:border-blue-300/50 transition-all duration-200">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("settings.players.maxPlayers")}{" "}
            <span className="text-rose-400">*</span>
          </label>
          <Controller
            name="maxPlayers"
            control={control}
            render={({ field }) => (
              <LSelect
                value={String(field.value)}
                onValueChange={(v) => field.onChange(+v)}
              >
                {OPTIONS_MAXPLAYERS.map((n) => (
                  <LSelectItem key={n} value={String(n)}>
                    {n} {t("settings.players.maxPlayersUnit")}
                  </LSelectItem>
                ))}
              </LSelect>
            )}
          />
        </div>

        <div className="group rounded-xl p-3.5 hover:border-blue-300/50 transition-all duration-200">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {t("settings.players.gender")}
          </label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <LSelect value={field.value} onValueChange={field.onChange}>
                {genderOptions.map((v) => (
                  <LSelectItem key={v} value={v}>
                    {v}
                  </LSelectItem>
                ))}
              </LSelect>
            )}
          />
        </div>
      </div>

      <div className="rounded-xl p-3.5 transition-all duration-200">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          {t("settings.players.maxAge")}
        </label>
        <div className="relative max-w-[160px]">
          <Controller
            name="maxAge"
            control={control}
            render={({ field }) => (
              <LInput
                type="number"
                value={field.value ? String(field.value) : ""}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  field.onChange(num === 0 ? undefined : num);
                }}
              />
            )}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            {t("settings.players.maxAgeUnit")}
          </span>
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
            <div
              className={`
                flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-300
                ${hasRanking ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}
              `}
            >
              <Trophy size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {t("settings.players.ranking.title")}
                </span>
                <span
                  className={`
                    inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                    ${hasRanking ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}
                  `}
                >
                  {hasRanking
                    ? t("settings.players.ranking.enabled")
                    : t("settings.players.ranking.disabled")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {hasRanking
                  ? t("settings.players.ranking.descriptionOn")
                  : t("settings.players.ranking.descriptionOff")}
              </p>
            </div>
          </div>

          <Controller
            name="hasRanking"
            control={control}
            render={({ field }) => (
              <SwitchComp
                checked={!!field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-blue-500"
              />
            )}
          />
        </div>

        {hasRanking && (
          <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="h-px bg-blue-200/60 mb-4" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              {t("settings.players.ranking.rankLimit")}
            </p>
            <Controller
              name="maxRankingClass"
              control={control}
              render={({ field }) => {
                const index = RANKING_CLASSES.indexOf(
                  field.value ?? RANKING_CLASSES[0]
                );
                const currentIndex = index === -1 ? 0 : index;

                return (
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={0}
                      max={RANKING_CLASSES.length - 1}
                      step={1}
                      value={currentIndex}
                      onChange={(e) =>
                        field.onChange(RANKING_CLASSES[Number(e.target.value)])
                      }
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                    <div className="flex justify-between">
                      {RANKING_CLASSES.map((v) => (
                        <span
                          key={v}
                          className={`text-[11px] font-medium transition-colors ${
                            v === field.value
                              ? "text-blue-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                    {field.value && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-500 text-xs font-semibold">
                        <span>≤</span>
                        <span>{field.value}</span>
                        <span className="text-blue-400 font-normal">
                          rank required
                        </span>
                      </div>
                    )}
                  </div>
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};