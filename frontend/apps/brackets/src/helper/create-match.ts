import { getParticipantsInfo } from "@/features/flow/helper/player";
import { createWbFlowParticipant } from "@/features/flow/helper/winner1";
import type { TournamentParticipant } from "@gd/proto/participant/v1/participant_pb";
import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";

export const createMatchesFromParticipants = ({
  participantsRaw,
  tournament,
}: {
  participantsRaw: TournamentParticipant[];
  tournament: Tournament;
}) => {
  const wbRounds = tournament.brackets
    .filter((bracket) => bracket.side === "winner")
    .flatMap((bracket) => bracket.rounds);

  const wbRoundCount = wbRounds.length;

  const bracketInfo = getParticipantsInfo({
    participants: participantsRaw,
  });

  const {
    wbParticipants,
    wbParticipantsForCreateMatch,
    wbParticipantCount,
    wbTotalBracketSlots,
  } = bracketInfo;

  console.log("wbParticipants", wbParticipants);

  const { matches, nodes } = createWbFlowParticipant({
    participants: wbParticipants,
    participantsForCreateMatch: wbParticipantsForCreateMatch,
    participantCount: wbParticipantCount,
    totalBracketSlots: wbTotalBracketSlots,
    roundCount: wbRoundCount,
    rounds: wbRounds,
  });

  return { matches, nodes };
};
