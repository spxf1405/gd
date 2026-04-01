import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BracketFlow } from "./features/configurations/bracket-flow";
import { PlayerMatchHistory } from "./features/configurations/player-history";
import { PlayersDialog } from "./features/configurations/players";
import RoundSelect from "./features/configurations/round-select";
import GamingCommandMenu from "./features/configurations/search-form";
import { EventBus } from "./helper/event-bus";
import { tournamentClient } from "./helper/service-client";
import { useTournamentStore } from "./store/match";

import "@xyflow/react/dist/style.css";
import "./App.css";
import { Setting } from "./features/configurations/settings/settings";

const queryClient = new QueryClient();
const bus = new EventBus();

function App() {
  const [id, setId] = useState("");
  const { initTournamentInfo } = useTournamentStore();

  const getTournamentByID = async () => {
    const res = await tournamentClient.getTournamentByID({
      id: id,
    });
    console.log("res.tournament", res.tournament)
    return res.tournament;
  };

  const { data: tournament } = useQuery({
    queryKey: ["tournament", id],
    queryFn: getTournamentByID,
    enabled: !!id,
  });

  useEffect(() => {
    initTournamentInfo(tournament);
  }, [tournament, initTournamentInfo]);

  useEffect(() => {
    bus.emitToParent("READY");

    bus.on("TOURNAMENT_ID", (id) => {
      setId(id);
    });
  }, []);

  return (
    <div className="bg-black w-full h-full">
      <div className="p-2 flex gap-2">
        <Setting />
        <PlayersDialog />
        <RoundSelect />
        <PlayerMatchHistory />
        <GamingCommandMenu />
      </div>
      <BracketFlow />
    </div>
  );
}

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
