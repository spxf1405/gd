import { useEffect, useMemo, useState } from "react";

export const usePlayers = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const playerCount = players.length;

  const wbTotalBracketSlots = 2 ** Math.ceil(Math.log2(playerCount));
  const wbTotalRounds = Math.log2(wbTotalBracketSlots);

  const wbPlayers = useMemo(() => {
    function addByeToPlayerList() {
      const byes = wbTotalBracketSlots - playerCount;
      return [
        ...players.slice(0, playerCount - byes),
        ...players
          .slice(playerCount - byes, playerCount)
          .map((player) => [player, "BYE"])
          .flat(),
      ];
    }
    return addByeToPlayerList();
  }, [players, wbTotalBracketSlots, playerCount]);

  const wbPlayerCount = wbPlayers.length;

  const lbTotalRounds = 2 * (Math.log2(playerCount) - 1);

  useEffect(() => {
    const getPlayers = () => {
      return [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        // "19","20","21","22","23","24","25","26","27","28",
        // "29","30","31","32","33","34","35","36","37","38",
        // "39","40","41","42","43","44","45","46","47","48"
      ];
    };

    setPlayers(getPlayers());
  }, []);

  return {
    players,
    playerCount,
    wbPlayers,
    wbPlayersForCreateMatch: structuredClone(wbPlayers),
    wbPlayerCount,
    wbTotalBracketSlots,
    wbTotalRounds,
    lbTotalRounds,
  };
};
