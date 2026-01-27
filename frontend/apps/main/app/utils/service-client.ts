import type {
  GenService,
  GenServiceMethods,
} from "@bufbuild/protobuf/codegenv2";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { AuthService } from "@gd/proto/auth/v1/auth_service_pb";
import { MatchService } from "@gd/proto/match/v1/match_service_pb";
import { PlayerService } from "@gd/proto/player/v1/player_service_pb";
import { UserService } from "@gd/proto/user/v1/user_service_pb";


const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
  useBinaryFormat: true,
});

export const getClient = <T extends GenServiceMethods>(
  service: GenService<T>
) => {
  return createClient(service, transport);
};

export const userClient = getClient(UserService);
export const authClient = getClient(AuthService);
export const playerClient = getClient(PlayerService);
export const matchClient = getClient(MatchService);
