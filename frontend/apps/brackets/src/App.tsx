import { useEffect } from "react";
import { Setting } from "./features/settings";
import { BracketFlow } from "./features/settings/bracket-flow";
import { PlayerMatchHistory } from "./features/settings/player-history";
import { PlayersDialog } from "./features/settings/players";
import RoundSelect from "./features/settings/round-select";
import GamingCommandMenu from "./features/settings/search-form";
import { useDimensionStore } from "./store/dismension";

import "@xyflow/react/dist/style.css";
import "./App.css";

export default function App() {
  const { setSize } = useDimensionStore();

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
