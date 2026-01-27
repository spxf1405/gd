import { useMatchesStore } from "@/store/match";
import { AlignVerticalDistributeCenter, ChevronDownIcon } from "lucide-react";
import { Select } from "radix-ui";
import { useState } from "react";

const RoundSelect = () => {
  const orderByOptions = [
    "Vòng loại: Nhánh thắng",
    "Vòng loại: Nhánh thua",
    "Last 128 - 1/64",
    "Last 64 - 1/32",
    "Last 32 - 1/16",
    "Last 16",
    "Quarter Final - Tứ kết",
    "Semi Final - Bán kết",
    "Final - Chung kết",
  ];

  const [orderByVal, setOrderByVal] = useState("");
  const { updateCurrentRound } = useMatchesStore();

  const handleChangeRound = (round: string) => {
    console.log("round", round)
    setOrderByVal(round);
    updateCurrentRound(round);
  };

  return (
    <Select.Root value={orderByVal} onValueChange={handleChangeRound}>
      <Select.Trigger className="inline-flex !bg-darker-surface items-center gap-2 border border-accent-blue/20 rounded-lg px-3 py-2 text-white !text-sm">
        <AlignVerticalDistributeCenter className="h-4 w-4" />
        <Select.Value placeholder="Chọn vòng đấu" />
        <Select.Icon>
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={5}
          className="bg-darker-surface rounded-lg shadow-lg z-200 cursor-pointer !w-[--radix-select-trigger-width]"
        >
          <Select.Viewport>
            {orderByOptions.map((option, index) => (
              <Select.Item
                key={index}
                value={option}
                className="px-3 py-2 text-white text-sm rounded-md cursor-pointer border border-transparent hover:bg-dark-blue hover:border-accent-blue/40 focus:bg-dark-blue focus:border-accent-blue/60 transition-colors duration-200 outline-none"
              >
                <Select.ItemText>{option}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default RoundSelect;
