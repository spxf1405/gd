import { TournamentClient } from "@/helper/service-client";
import { create } from "@bufbuild/protobuf";
import type { TournamentStatus } from "@gd/proto/tournament/v1/tournament_pb";
import { ChangeTournamentStatusRequestSchema } from "@gd/proto/tournament/v1/tournament_service_pb";
import { useMutation } from "@tanstack/react-query";

export const useUpdateTournamentStatusMutation = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (err: unknown) => void;
}) => {
  return useMutation({
    mutationFn: async ({
      status,
      id,
    }: {
      status: TournamentStatus;
      id: string;
    }) => {
      const request = create(ChangeTournamentStatusRequestSchema, {
        status,
        id,
      });

      return await TournamentClient.changeTournamentStatus(request);
    },
    onSuccess,
    onError,
  });
};
