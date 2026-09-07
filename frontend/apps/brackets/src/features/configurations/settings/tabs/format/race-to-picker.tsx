import { ConfigProvider, InputNumber, Segmented } from "antd";

const RACE_TO_OPTIONS = [3, 5, 7, 9, 11, 13, 15];

export function RaceToPicker({
  isLoser,
  value,
  onChange,
  accent,
}: {
  isLoser: boolean;
  value: number;
  onChange: (value: number) => void;
  accent: "emerald" | "rose";
}) {
  const isCustom = !RACE_TO_OPTIONS.includes(value);

  const accentColor = accent === "emerald" ? "#34D399" : "#FB7185";

  const displayValue = isCustom ? Math.min(value, 99) : null;

  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemColor: "#71717A",
            itemHoverColor: "#E4E4E7",

            itemSelectedBg: isLoser ? "#FB7185" : "#059669",
            trackPadding: 0,
            borderRadius: 6,
            controlPaddingHorizontal: 8,
            fontSize: 13,
          },

          InputNumber: {
            borderRadiusSM: 6,

            activeBorderColor: accentColor,
            hoverBorderColor: accentColor,

            colorBgContainer: isCustom ? `${accentColor}1A` : "transparent",

            colorText: isCustom ? accentColor : "#71717A",
            colorTextPlaceholder: "#52525B",

            activeShadow: `0 0 0 1px ${accentColor}33`,
          },
        },
      }}
    >
      <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950/50 p-0.5">
        <Segmented
          size="small"
          value={isCustom ? undefined : value}
          options={RACE_TO_OPTIONS}
          onChange={(value) => onChange(Number(value))}
          styles={{
            item: {
              padding: 4,
              borderRadius: 8,
              margin: 1,
              fontWeight: "bolder",
              color: "white",
            },
            root: {
              borderRadius: 8,
            },
          }}
        />

        <div className="mx-0.5 h-4 w-px bg-zinc-800" />

        <InputNumber
          size="middle"
          classNames={{
            input: "!py-1.5 !text-center",
            root: "!max-w-[42px]",
          }}
          min={0}
          max={99}
          precision={0}
          controls={false}
          value={displayValue}
          placeholder="…"
          onChange={(value) => {
            onChange(Math.min(value ?? 0, 99));
          }}
        />
      </div>
    </ConfigProvider>
  );
}
