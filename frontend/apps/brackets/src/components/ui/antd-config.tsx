import { ConfigProvider, theme } from "antd";
import React from "react";

const BG_DARKER_BLUE = "#13151F";
const BG_DARKER_BLUE_TRANSPARENT = "rgba(19, 21, 31, 0.95)";

const FONT_FAMILY = `'Google Sans', 'Google Sans Text', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif`;

export const AntdThemeConfig = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgBase: BG_DARKER_BLUE,
          colorBgContainer: BG_DARKER_BLUE,
          colorBgElevated: BG_DARKER_BLUE,
          colorBgLayout: "#0B0C12",

          colorPrimary: "#10B981",

          colorBorder: "rgba(255, 255, 255, 0.08)",
          colorBorderSecondary: "rgba(255, 255, 255, 0.05)",

          colorText: "#F8FAFC",
          colorTextSecondary: "#94A3B8",
          colorTextPlaceholder: "#475569",

          borderRadius: 10,
          fontSize: 13,

          fontFamily: FONT_FAMILY,
        },
        components: {
          Input: {
            inputFontSizeLG: 13
          },
          Modal: {
            contentBg: BG_DARKER_BLUE_TRANSPARENT,
            headerBg: "transparent",
            titleColor: "#FFFFFF",
            borderRadiusLG: 16,
            controlPaddingHorizontal: 0, 
            paddingContentVertical: 0,
            padding: 100,
          },
          Card: {
            colorBgContainer: BG_DARKER_BLUE,
          },
          Table: {
            colorBgContainer: BG_DARKER_BLUE,
            headerBg: "rgba(255, 255, 255, 0.03)",
            headerColor: "#94A3B8",
            rowHoverBg: "rgba(255, 255, 255, 0.04)",
          },
          Select: {          
            selectorBg: 'transparent',
            fontFamily: FONT_FAMILY,
          },
          Tabs: {
            colorBgContainer: "#ffffff",
            itemColor: "#94A3B8",
            itemSelectedColor: "#10B981",
            itemHoverColor: "#34D399",
            inkBarColor: "#10B981",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
