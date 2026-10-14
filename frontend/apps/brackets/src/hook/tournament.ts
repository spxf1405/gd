import { useQuery } from "@tanstack/react-query";
import { TournamentClient } from "@/helper/service-client";

const getTournamentByID = async (id: string) => {
  const res = await TournamentClient.getTournamentByID({
    id,
  });
  return res.tournament;
};

//TODO: return all the query here not only tournament
export function useTournament(id?: string) {
  return useQuery({
    queryKey: ["tournament", id],
    queryFn: async () => {
      return await getTournamentByID(id ?? "");
    },
    enabled: !!id,
  });
}
