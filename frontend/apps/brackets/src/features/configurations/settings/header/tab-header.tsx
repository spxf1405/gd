import { COLORS } from "../consts/color";

export const SectionHeader = ({
  icon,
  title,
  accent = COLORS.green,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: string;
}) => (
  <div
    className="flex items-center gap-3 pb-3 mb-1"
    style={{ borderBottom: `1px solid ${COLORS.borderFaint}` }}
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: `${accent}18`,
        border: `1px solid ${accent}30`,
        color: accent,
      }}
    >
      {icon}
    </div>
    <h3
      className="text-[17px] font-bold text-white"
      style={{ letterSpacing: "-0.02em" }}
    >
      {title}
    </h3>
  </div>
);
