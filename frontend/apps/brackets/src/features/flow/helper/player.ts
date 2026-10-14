import { create } from "@bufbuild/protobuf";
import { MatchSchema, type Match } from "@gd/proto/match/v1/match_pb";
import {
  TournamentParticipantSchema,
  type MatchParticipant,
  type TournamentParticipant,
} from "@gd/proto/participant/v1/participant_pb";
import type { BracketMatch } from "../types";

export const getPlayersInfo = (players: string[]) => {
  const m = create(MatchSchema, {});
  const matches: Match[] = [];
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
  matchIndex: number,
) =>
  matches.find(
    (n) => n.round === round + 1 && n.matchIndex === Math.floor(matchIndex / 2),
  );

// =============================================
// =============================================

export const getParticipantsInfo = ({
  participants,
}: {
  participants: TournamentParticipant[];
}) => {
  const participantsCount = participants.length;

  const wbTotalBracketSlots = 2 ** Math.ceil(Math.log2(participantsCount));
  const wbRoundCount = Math.log2(wbTotalBracketSlots);

  // console.log("wbTotalRounds1", wbRounds);
  // console.log("wbTotalRounds", wbTotalRounds);

  function addByeToParticipantsList() {
    const byes = wbTotalBracketSlots - participantsCount;
    const byeParticipant = create(TournamentParticipantSchema, {});

    return [
      ...participants.slice(0, participantsCount - byes),
      ...participants
        .slice(participantsCount - byes, participantsCount)
        .map((participant) => [participant, byeParticipant])
        .flat(),
    ];
  }

  const wbParticipants = addByeToParticipantsList();
  const wbParticipantCount = wbParticipants.length;

  const lbTotalRounds = 2 * (Math.log2(participantsCount) - 1);

  // console.log("getParticipantsInfo", {
  //   participants,
  //   participantsCount,
  //   wbParticipants,
  //   wbParticipantsForCreateMatch: structuredClone(wbParticipants),
  //   wbParticipantCount,
  //   wbTotalBracketSlots,
  //   wbTotalRounds,
  //   lbTotalRounds,
  // });

  return {
    participants,
    participantsCount,
    wbParticipants,
    wbParticipantsForCreateMatch: structuredClone(wbParticipants),
    wbParticipantCount,
    wbTotalBracketSlots,
    wbRoundCount,
    lbTotalRounds,
  };
};

//TODO: Replace with playerId
export const isTournamentParticipantBye = (participant: TournamentParticipant) =>
  !participant?.playerId;

export const isMatchParticipantBye = (participant: MatchParticipant) =>
  !participant?.playerId;


export const isRealParticipant = (participant: TournamentParticipant) =>
  participant && !isTournamentParticipantBye(participant);

export const isRealParticipantMatch = (participants: TournamentParticipant[]) =>
  participants.length === 2 &&
  (isRealParticipant(participants[0]) || isRealParticipant(participants[1]));
