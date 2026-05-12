import type {
  GenService,
  GenServiceMethods,
} from "@bufbuild/protobuf/codegenv2";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { AuthService } from "@gd/proto/auth/v1/auth_service_pb";
import { MatchService } from "@gd/proto/match/v1/match_service_pb";
import { PlayerService } from "@gd/proto/player/v1/player_service_pb";
import { TournamentService } from "@gd/proto/tournament/v1/tournament_service_pb";
import { UserService } from "@gd/proto/user/v1/user_service_pb";

const BASE_URL = "http://localhost:5000"

const transport = createConnectTransport({
  baseUrl: BASE_URL,
  useBinaryFormat: true
});

const privateTransport = createConnectTransport({
  baseUrl: BASE_URL,
  useBinaryFormat: true,
  fetch: (input, init) =>
    globalThis.fetch(input, { ...init, credentials: "include" }),
});

export const getClient = <T extends GenServiceMethods>(
  service: GenService<T>,
) => {
  return createClient(service, transport);
};

export const getPrivateClient = <T extends GenServiceMethods>(
  service: GenService<T>,
) => {
  return createClient(service, privateTransport);
};

export const userClient = getClient(UserService);
export const AuthClient = getPrivateClient(AuthService);
export const playerClient = getClient(PlayerService);
export const matchClient = getClient(MatchService);
export const tournamentClient = getClient(TournamentService);
