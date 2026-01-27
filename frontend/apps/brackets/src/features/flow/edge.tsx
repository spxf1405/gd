import type { EdgeProps } from "@xyflow/react";
import {
  NODE_HEIGHT,
  NODE_VERTICAL_SPACING,
  NODE_WIDTH,
  ROUND_WIDTH,
} from "./consts";

export const FinalMatchEdge = ({
  sourceX,
  sourceY,
  data,
}: EdgeProps) => {
  const midY = sourceY + (NODE_HEIGHT + NODE_VERTICAL_SPACING) / 2;
  const offsetX = ROUND_WIDTH - NODE_WIDTH;

  const path = data?.fromLeft
    ? `M ${sourceX} ${midY} L ${sourceX + offsetX} ${midY}`
    : `M ${sourceX} ${midY} L ${sourceX - offsetX} ${midY}`;

  return (
    <path
      d={path}
      stroke="#a855f7"
      strokeWidth={2}
      fill="none"
      strokeDasharray="6 4"
      className="animated-dash"
    />
  );
};

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
    <path
      d={path}
      stroke="#a855f7"
      strokeWidth={2}
      fill="none"
      strokeDasharray="6 4"
      className="animated-dash"
    />
  );
};
