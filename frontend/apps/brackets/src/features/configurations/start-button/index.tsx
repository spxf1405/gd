import { AntdThemeConfig } from "@/components/ui/antd-config";
import { QButton } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import { COLORS } from "../settings/consts/color";


//TODO: Chỉ có thể mở đăng ký khi đã config đúng rounds với số lượng người chơi
export const StartButton = () => {
  return (
    <AntdThemeConfig>
      <QButton
        icon={<SquarePen size={16} style={{ color: COLORS.green }} />}
        size="large"
        style={{
          height: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 20px",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 13,
          color: "#ffffff",
          border: `1px solid ${COLORS.border}`,
          background: "linear-gradient(135deg, #1a1d27, #22263a)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        Mở đăng ký
      </QButton>
    </AntdThemeConfig>
  );
};
