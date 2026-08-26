import { Button, type ButtonProps } from "antd";

export function QButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={`transition-transform duration-150 hover:scale-[1.05] active:scale-[0.98] ${props.className ?? ""}`}
    />
  );
}