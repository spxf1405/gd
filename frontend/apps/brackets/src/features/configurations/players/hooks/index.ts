import { ParticipantClient } from "@/helper/service-client";
import { create } from "@bufbuild/protobuf";
import { GetParticipantsByTournamentIDRequestSchema } from "@gd/proto/participant/v1/participant_service_pb";
import { useQuery } from "@tanstack/react-query";

const getParticipantsByTournamentID = async (tournamentId?: string) => {
  const rq = create(GetParticipantsByTournamentIDRequestSchema, {
    tournamentId: tournamentId,
  });
  return await ParticipantClient.getParticipantsByTournamentID(rq);
};

export const useParticipantsByTournamentID = ({
  tournamentId,
}: {
  tournamentId?: string;
}) => {
  return useQuery({
    queryKey: ["tournament"],
    queryFn: async () => {
      return await getParticipantsByTournamentID(tournamentId);
    },
    enabled: !!tournamentId,
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};
