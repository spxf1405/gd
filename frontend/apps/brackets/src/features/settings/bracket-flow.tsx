import { useEffect, useMemo } from "react";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMatchesStore } from "@/store/match";
import { useDimensionStore } from "@/store/dismension";
import { BracketEdge, FinalMatchEdge } from "../flow/edge";
import { CustomNode, FinalNode, FinalOfFinalNode } from "../flow/nodes";

const edgeTypes = {
  bracket: BracketEdge,
  final: FinalMatchEdge,
};

const nodeTypes = {
  final: FinalNode,
  custom: CustomNode,
  finalOfFinal: FinalOfFinalNode,
};

function BracketFlow() {
  const reactFlowInstance = useReactFlow();

  const { initTourInfo, tourInfo } = useMatchesStore();
  const { width, height, setSize } = useDimensionStore();

  const { currentRound } = tourInfo;

  const { nodes, edges } = useMemo(() => {
    const {
      brackets: {
        winner: { flow: wbFlow = { nodes: [], edges: [] } } = {},
        loser: { flow: lbFlow = { nodes: [], edges: [] } } = {},
      } = {},
      currentRound,
    } = tourInfo ?? {};

    if (currentRound === "Last 16") {
      return {
        nodes: wbFlow.nodes,
        edges: wbFlow.edges,
      };
    }

    return {
      nodes: [...wbFlow.nodes, ...lbFlow.nodes],
      edges: [...wbFlow.edges, ...lbFlow.edges],
    };
  }, [tourInfo]);

  useEffect(() => {
    if (currentRound === "Last 16") {
      console.log("16");
      initTourInfo(Array.from({ length: 16 }, (_, i) => String(i + 1)));
    } else {
      initTourInfo(Array.from({ length: 17 }, (_, i) => String(i + 1)));
    }
  }, [initTourInfo, currentRound]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "CONTAINER_SIZE") {
        const { width, height } = event.data;

        setSize(width, height);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setSize]);

  useEffect(() => {
    if (currentRound === "Last 16") {
      reactFlowInstance.fitView({ duration: 400 });
    }
  }, [reactFlowInstance, nodes, currentRound]);

  return (
    <div style={{ width, height }}>
      <ReactFlow
        colorMode="dark"
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        nodesDraggable={false}
        minZoom={0.1}
        edgesReconnectable={true}
        onlyRenderVisibleElements={true}
      >
        <MiniMap />
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export { BracketFlow };
