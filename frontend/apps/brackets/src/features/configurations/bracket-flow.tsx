import { useEffect, useMemo } from "react";

import { EventBus } from "@/helper/event-bus";
import { useTournament } from "@/hook/tournament";
import { useDimensionStore } from "@/store/dismension";
import { useTournamentStore } from "@/store/match";
import {
  Background,
  Controls,
  getNodesBounds,
  MiniMap,
  PanOnScrollMode,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BracketEdge, FinalMatchEdge } from "../flow/edge";
import { CustomNode, FinalNode, FinalOfFinalNode } from "../flow/nodes";
import { useParticipantsByTournamentID } from "./players/hooks";
import { useFlow } from "./use-bracket";

import { type Node } from "@xyflow/react";
import { useRef } from "react";

const ZOOM = 0.8;
const MARGIN = 24;

function InitialViewport({ nodes }: { nodes: Node[] }) {
  const { setViewport } = useReactFlow();

  const hasSet = useRef(false);

  useEffect(() => {
    const target = nodes[0];
    if (hasSet.current || !target) return;
    setViewport({
      x: -target.position.x * ZOOM + MARGIN,
      y: -target.position.y * ZOOM + MARGIN,
      zoom: ZOOM,
    });
    hasSet.current = true;
  }, [nodes, setViewport]);

  return null;
}

const edgeTypes = {
  bracket: BracketEdge,
  final: FinalMatchEdge,
};

const nodeTypes = {
  final: FinalNode,
  custom: CustomNode,
  finalOfFinal: FinalOfFinalNode,
};

const bus = new EventBus();

function BracketFlow() {
  const reactFlowInstance = useReactFlow();

  const { initTourInfo2, tourInfo, id } = useTournamentStore();

  const { data: tournament } = useTournament(id);

  const { data } = useParticipantsByTournamentID({ tournamentId: id });

  const participants = data?.tournamentParticipants ?? [];

  const { width, height, setSize } = useDimensionStore();

  const { currentRound, matches } = tourInfo;

  const { edges } = useMemo(() => {
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
      // nodes: [...wbFlow.nodes, ...lbFlow.nodes],
      nodes: [...wbFlow.nodes],
      // edges: [...wbFlow.edges, ...lbFlow.edges],
    };
  }, [tourInfo]);

  const { nodes } = useFlow({ tournament });

  console.log("nodes", nodes);

  const PADDING = 1000;

  const translateExtent = useMemo<[[number, number], [number, number]]>(() => {
    if (!nodes.length)
      return [
        [-Infinity, -Infinity],
        [Infinity, Infinity],
      ];

    const { x, y, width, height } = getNodesBounds(nodes);

    return [
      [x - PADDING, y - PADDING],
      [x + width + PADDING, y + height + PADDING],
    ];
  }, [nodes]);

  useEffect(() => {
    if (participants.length && tournament?.brackets) {
      initTourInfo2({ participantsRaw: participants, tournament });
    }
  }, [initTourInfo2, participants, tournament]);

  useEffect(() => {
    bus.on("CONTAINER_SIZE", (data) => {
      setSize(data.width, data.height);
    });
  }, [setSize]);

  useEffect(() => {
    if (currentRound === "Last 16") {
      reactFlowInstance.fitView({ duration: 400 });
    }
  }, [reactFlowInstance, matches, currentRound]);

  return (
    <div style={{ width: width, height: height - 120 }}>
      <ReactFlow
        colorMode="dark"
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        translateExtent={translateExtent}
        panOnScroll
        panOnDrag
        panOnScrollMode={PanOnScrollMode.Free}
        zoomOnScroll={false}
        zoomOnPinch
        zoomActivationKeyCode="Alt"
        nodesDraggable={false}
        minZoom={0.1}
        edgesReconnectable={true}
        onlyRenderVisibleElements={true}
        // panOnScroll
        // fitView
        // fitViewOptions={{
        //   padding: 0.1,
        //   minZoom: 0.1,
        //   maxZoom: 1,
        // }}
      >
        <InitialViewport nodes={nodes} />
        <MiniMap />
        <Controls showZoom showFitView position="bottom-left" />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export { BracketFlow };
