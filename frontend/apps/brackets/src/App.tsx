import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";
import "./App.css";
import { BracketFlow } from "./features/configurations/bracket-flow";
import { PlayersModal } from "./features/configurations/players-list";
import { Setting } from "./features/configurations/settings/settings";
import { EventBus } from "./helper/event-bus";
import { useTournament } from "./hook/tournament";
import { useTournamentStore } from "./store/match";
import { AntdThemeConfig } from "./components/ui/antd-config";

const queryClient = new QueryClient();
const bus = new EventBus();

interface Player {
  id: string;
  name: string;
  seed: number;
  nationality: string;
}

function App() {
  const [id, setId] = useState("");
  const { initTournamentInfo } = useTournamentStore();

  const [open, setOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Nguyễn Văn A", seed: 1, nationality: "VN", rank: "A" },
    { id: "2", name: "Trần Thị B", seed: 2, nationality: "VN", rank: "B" },
    { id: "3", name: "John Smith", seed: 3, nationality: "US", rank: "A" },
    { id: "4", name: "Nguyễn Văn A", seed: 1, nationality: "VN", rank: 'CN'},
    { id: "5", name: "Trần Thị B", seed: 2, nationality: "VN",  rank: 'CN' },
    { id: "6", name: "John Smith", seed: 3, nationality: "US" },
    { id: "7", name: "Nguyễn Văn A", seed: 1, nationality: "VN" },
    { id: "8", name: "Trần Thị B", seed: 2, nationality: "VN" },
    { id: "9", name: "John Smith", seed: 3, nationality: "US" },
  ]);

  const handleDeletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      seed: players.length + 1,
      nationality: "VN",
    };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const tournament = useTournament(id);

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
        <AntdThemeConfig>
          <>
            <PlayersModal              
              onClose={() => setOpen(false)}
              onPlayersChange={setPlayers}
              onAddPlayer={handleAddPlayer}
            />
          </>
        </AntdThemeConfig>
        {/* <RoundSelect />
        <PlayerMatchHistory />
        <GamingCommandMenu /> */}
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
