import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import type { ICellRendererParams } from "ag-grid-community";

export const PrizeCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament>>,
      required: true,
    },
  },
  render() {
    const rawPrize = this.params.data?.totalPrize?.toString() || "";
    if (!rawPrize)
      return <div class="text-slate-300 w-full text-end px-2">---</div>;

    const isUSD = rawPrize.trim().endsWith("$");
    const numericValue = parseFloat(rawPrize.replace(/[^-0-9.]/g, ""));

    const formattedNumber = new Intl.NumberFormat("en-US").format(numericValue);

    return (
      <div class="flex h-full items-center justify-end w-full px-2 gap-1 select-all">
        {isUSD && (
          <span class="text-xs font-black text-white-950 opacity-60">$</span>
        )}

        <span class="text-base font-black text-white-950 tracking-tighter">
          {formattedNumber}
        </span>

        {!isUSD && (
          <span class="text-[10px] font-black text-white-950 opacity-60 uppercase tracking-widest">
            VND
          </span>
        )}
      </div>
    );
  },
});
