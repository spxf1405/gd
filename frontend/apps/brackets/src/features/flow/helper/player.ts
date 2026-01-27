import type { BracketMatch } from "../types";

export const getPlayersInfo = (players: string[]) => {
  const playerCount = players.length;

  const wbTotalBracketSlots = 2 ** Math.ceil(Math.log2(playerCount));
  const wbTotalRounds = Math.log2(wbTotalBracketSlots);

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

  const wbPlayers = addByeToPlayerList();
  const wbPlayerCount = wbPlayers.length;

  const lbTotalRounds = 2 * (Math.log2(playerCount) - 1);

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

export const isBye = (player: string) => player === "BYE";
export const isRealPlayer = (player: string) => player && !isBye(player);
export const isRealMatch = (players: string[]) =>
  players.length === 2 &&
  (isRealPlayer(players[0]) || isRealPlayer(players[1]));

export const getNextMatch = (
  matches: BracketMatch[],
  round: number,
  matchIndex: number
) =>
  matches.find(
    (n) => n.round === round + 1 && n.matchIndex === Math.floor(matchIndex / 2)
  );
