import type {
  GenService,
  GenServiceMethods,
} from "@bufbuild/protobuf/codegenv2";
import {
  Code,
  ConnectError,
  createClient,
  type Interceptor,
} from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { AuthService } from "@gd/proto/auth/v1/auth_service_pb";
import { MatchService } from "@gd/proto/match/v1/match_service_pb";
import { PlayerService } from "@gd/proto/player/v1/player_service_pb";
import { TournamentService } from "@gd/proto/tournament/v1/tournament_service_pb";
import { UserService } from "@gd/proto/user/v1/user_service_pb";
import { RoundService } from "@gd/proto/round/v1/round_service_pb";
import { ParticipantService } from "@gd/proto/participant/v1/participant_service_pb";

const BASE_URL = "http://localhost:5000";

let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const withCredentials = (input: RequestInfo | URL, init?: RequestInit) =>
  globalThis.fetch(input, { ...init, credentials: "include" });

const publicTransport = createConnectTransport({
  baseUrl: BASE_URL,
  useBinaryFormat: true,
  fetch: withCredentials,
});

export const PublicAuthClient = createClient(AuthService, publicTransport);

const refreshOnce = (): Promise<void> => {
  refreshPromise ??= PublicAuthClient.refreshToken({})
    .then((res) => setAccessToken(res.accessToken))
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
};

const authInterceptor: Interceptor = (next) => async (req) => {
  if (accessToken) {
    req.header.set("Authorization", `Bearer ${accessToken}`);
  }

  try {
    return await next(req);
  } catch (err) {
    if (!(err instanceof ConnectError) || err.code !== Code.Unauthenticated) {
      throw err;
    }

    if (req.url.endsWith("RefreshToken")) {
      throw err;
    }

    try {
      await refreshOnce();
    } catch {
      setAccessToken(null);
      window.location.href = "/login";
      throw err;
    }

    req.header.set("Authorization", `Bearer ${accessToken}`);

    return await next(req);
  }
};

const privateTransport = createConnectTransport({
  baseUrl: BASE_URL,
  useBinaryFormat: true,
  interceptors: [authInterceptor],
  fetch: withCredentials,
});

const getPublicClient = <T extends GenServiceMethods>(service: GenService<T>) =>
  createClient(service, publicTransport);

const getPrivateClient = <T extends GenServiceMethods>(
  service: GenService<T>,
) => createClient(service, privateTransport);

export const AuthClient = getPublicClient(AuthService);
export const UserClient = getPrivateClient(UserService);
export const PlayerClient = getPrivateClient(PlayerService);
export const MatchClient = getPrivateClient(MatchService);
export const TournamentClient = getPrivateClient(TournamentService);
export const RoundClient = getPrivateClient(RoundService);
export const ParticipantClient = getPrivateClient(ParticipantService);
