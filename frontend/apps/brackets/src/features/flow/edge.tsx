import type { EdgeProps } from "@xyflow/react";
import {
  NODE_HEIGHT,
  NODE_VERTICAL_SPACING,
  NODE_WIDTH,
  ROUND_WIDTH,
} from "./consts";

// Đường nối vào trận Chung Kết - dùng gold để nổi bật
export const FinalMatchEdge = ({ sourceX, sourceY, data }: EdgeProps) => {
  const midY = sourceY + (NODE_HEIGHT + NODE_VERTICAL_SPACING) / 2;
  const offsetX = ROUND_WIDTH - NODE_WIDTH;

  const path = data?.fromLeft
    ? `M ${sourceX} ${midY} L ${sourceX + offsetX} ${midY}`
    : `M ${sourceX} ${midY} L ${sourceX - offsetX} ${midY}`;

  return (
    <g>
      {/* Glow mờ phía dưới */}
      <path
        d={path}
        stroke="#fbbf24"
        strokeWidth={4}
        fill="none"
        opacity={0.25}
        strokeLinecap="round"
        className="blur-[2px]"
      />
      {/* Đường nét đứt chính - amber/gold */}
      <path
        d={path}
        stroke="#fcd34d"
        strokeWidth={2}
        fill="none"
        strokeDasharray="6 4"
        strokeLinecap="round"
        className="animated-dash drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]"
      />
    </g>
  );
};

// Đường nối bracket thông thường - blue, đồng bộ với viền CustomNode
export const BracketEdge = (info: EdgeProps) => {
  const { sourceX, sourceY, targetX, targetY, source } = info;

  const mergePointX = (sourceX + targetX) / 2;
  const offset = source.endsWith("1")
    ? (NODE_HEIGHT + NODE_VERTICAL_SPACING) / 2
    : -(NODE_HEIGHT + NODE_VERTICAL_SPACING) / 2;

  const path = `
    M ${sourceX} ${sourceY} 
    L ${(sourceX + mergePointX) / 2} ${sourceY}
    L ${(sourceX + mergePointX) / 2} ${sourceY + offset}
    L ${mergePointX} ${sourceY + offset}
    L ${mergePointX} ${targetY}
    L ${targetX} ${targetY} 
  `;

  return (
    <g>
      {/* 1. Lớp Aura/Glow mờ phía dưới tạo hiệu ứng Neon */}
      <path
        d={path}
        stroke="#3b82f6"
        strokeWidth={4}
        fill="none"
        opacity={0.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="blur-[2px]"
      />

      {/* 2. Đường nét đứt chính màu Blue sáng có animation */}
      <path
        d={path}
        stroke="#60a5fa"
        strokeWidth={1.5}
        fill="none"
        strokeDasharray="6 4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animated-dash drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]"
      />
    </g>
  );
};