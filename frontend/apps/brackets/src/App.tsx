import { useEffect, useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AntdThemeConfig } from "./components/ui/antd-config";
import { BracketFlow } from "./features/configurations/bracket-flow";
import { Participants } from "./features/configurations/players-list";
import { SettingWrapper } from "./features/configurations/settings/settings";
import { TournamentStatusControl } from "./features/configurations/start-button";
import { LanguageSwitcher } from "./features/lang/lang";
import { EventBus } from "./helper/event-bus";
import { useTournament } from "./hook/tournament";

import "@xyflow/react/dist/style.css";
import "./App.css";
import { FirstMatchRoundSettingWrapper } from "./features/configurations/first-round-matches/first-round-matches";
import { useTournamentStore } from "./store/match";

const queryClient = new QueryClient();
const bus = new EventBus();

function App() {
  const [id, setId] = useState("");

  const { initId } = useTournamentStore();

  useTournament(id);

  useEffect(() => {
    initId(id);
  }, [id]);

  useEffect(() => {
    bus.emitToParent("READY");

    bus.on("TOURNAMENT_ID", (id) => {
      setId(id);
    });
  }, []);

  return (
    <div className="bg-black w-full h-full">
      <div className="flex justify-between items-center p-2">
        <div className="flex gap-2">
          <TournamentStatusControl />
          
        </div>

        <div className="flex gap-2">
          <AntdThemeConfig>
            <Participants />
          </AntdThemeConfig>
          <FirstMatchRoundSettingWrapper />
          <SettingWrapper />
          <LanguageSwitcher />
        </div>
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
