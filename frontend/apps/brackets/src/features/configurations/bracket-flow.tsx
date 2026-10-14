import { useEffect, useMemo } from "react";

import { EventBus } from "@/helper/event-bus";
import { useTournament } from "@/hook/tournament";
import { useDimensionStore } from "@/store/dismension";
import { useTournamentStore } from "@/store/match";
import { create } from "@bufbuild/protobuf";
import { MatchSchema, type Match } from "@gd/proto/match/v1/match_pb";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "antd";
import { BracketEdge, FinalMatchEdge } from "../flow/edge";
import { CustomNode, FinalNode, FinalOfFinalNode } from "../flow/nodes";
import { useParticipantsByTournamentID } from "./players/hooks";
import { MatchClient } from "@/helper/service-client";
import { useFlow } from "./use-bracket";

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

  const { nodes: nodes1, edges } = useMemo(() => {
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

  console.log("tournament", tournament)

  const { nodes } = useFlow({ tournament });

  console.log("nodes", nodes)

  const addMatches = async () => {
    const rqMatches: Match[] = [];

    for (const match of matches) {
      // if (!match?.round?.id) {
      //   continue;
      // }

      if (match?.isAutoWin) {
        continue;
      }

      // const matchParticipant1 = match.participants[0];
      // const matchParticipant2 = match.participants[1];

      // console.log("players1", matchParticipant1);
      // console.log("players2", matchParticipant2);

      const foo = create(MatchSchema, {
        round: match.roundIndex,
        roundId: match.round.id,
        matchIndex: match.matchIndex,
        side: match.side,
        isAutoWin: match.isAutoWin,
        isSkipped: match.isSkipped,
        participants: [match.participants[0], match.participants[1]],
        position: {
          x: match.position.x,
          y: match.position.y,
        },
      });

      rqMatches.push(foo);
    }

    console.log("rqMatches", rqMatches);

    await MatchClient.addMatches({
      matches: rqMatches,
    });
  };

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
      <Button onClick={addMatches}>Add 123</Button>

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
