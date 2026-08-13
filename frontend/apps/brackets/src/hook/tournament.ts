import {
    useQuery
} from "@tanstack/react-query";
import { TournamentClient } from "@/helper/service-client";

 const getTournamentByID = async (id: string) => {
    const res = await TournamentClient.getTournamentByID({
      id,
    });
    return res.tournament;
  };


export function useTournament(id: string) {
  const { data: tournament } = useQuery({
    queryKey: ["tournament", id],
    queryFn: () => getTournamentByID(id),
    enabled: !!id,
  });

  return tournament;
}
