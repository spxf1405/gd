import { Select, type SelectProps } from "antd";
import { ChevronDown, XCircle } from "lucide-react";

export const ClearIcon = () => (
  <div className="!-ml-[6px] !-mt-[3px]">
    <XCircle fill="currentColor" stroke="#ffffff" size={16} />
  </div>
);

export function QSelect(props: SelectProps) {
  const { allowClear, styles, style, ...rest } = props;

  return (
    <Select
      allowClear={
        allowClear === false
          ? false
          : {
              clearIcon: <ClearIcon />,
              ...(typeof allowClear === "object" ? allowClear : {}),
            }
      }
      suffixIcon={<ChevronDown size={15} />}
      style={{
        fontSize: 13,
        ...style,
      }}
      styles={{
        popup: {
          listItem: {
            margin: 2,
          },
        },
        ...styles,
      }}
      {...rest}
    />
  );
}
