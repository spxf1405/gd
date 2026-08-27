import { COLORS } from "@/features/configurations/settings/consts/color";
import { Tooltip, type TooltipProps } from "antd";

const tooltipStyles = {
  container: {
    background: COLORS.surfaceAlt,
    border: `1px solid ${COLORS.border}`,
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 11,
    fontWeight: 500,
    color: COLORS.textPrimary,
  },
};

export function QTooltip({ styles, ...props }: TooltipProps) {
  return (
    <Tooltip
      {...props}
      styles={{
        ...styles,
        container: {
          ...tooltipStyles.container,
          ...styles?.container,
        },
      }}
    />
  );
}