import { env } from "@/env";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 182;
const REFRESH_BUFFER_MS = 1000 * 60 * 60 * 24;

type HostawayTokenResponse = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

type HostawayTokenCache = {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  refreshAt: number;
  refreshing: Promise<string> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __hostawayTokenCache: HostawayTokenCache | undefined;
}

const getTokenCache = () => globalThis.__hostawayTokenCache;

const setTokenCache = (cache: HostawayTokenCache) => {
  globalThis.__hostawayTokenCache = cache;
};

const shouldReuseToken = (cache: HostawayTokenCache, now: number) =>
  now < cache.refreshAt && now < cache.expiresAt;

const fetchNewToken = async (): Promise<string> => {
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.HOSTAWAY_CLIENT_ID,
    client_secret: env.HOSTAWAY_CLIENT_SECRET,
    scope: env.HOSTAWAY_SCOPE ?? "general",
  });

  const response = await fetch(`${HOSTAWAY_API_URL}/accessTokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Hostaway auth error ${response.status}: ${details}`);
  }

  const data = (await response.json()) as HostawayTokenResponse;
  const now = Date.now();
  const expiresInMs = Math.max(0, data.expires_in * 1000);
  const expiresAt = now + expiresInMs;
  const refreshAt = Math.min(
    now + SIX_MONTHS_MS,
    Math.max(now, expiresAt - REFRESH_BUFFER_MS),
  );
  const authorization = `${data.token_type} ${data.access_token}`;

  setTokenCache({
    accessToken: data.access_token,
    tokenType: data.token_type,
    expiresAt,
    refreshAt,
    refreshing: null,
  });

  return authorization;
};

export async function getHostawayAuthorizationHeader() {
  const now = Date.now();
  const cache = getTokenCache();

  if (cache && shouldReuseToken(cache, now)) {
    return `${cache.tokenType} ${cache.accessToken}`;
  }

  if (cache?.refreshing) {
    return cache.refreshing;
  }

  const refreshing = fetchNewToken()
    .catch((error: unknown) => {
      const staleCache = getTokenCache();
      if (staleCache) {
        staleCache.refreshing = null;
      }
      throw error;
    })
    .finally(() => {
      const latestCache = getTokenCache();
      if (latestCache) {
        latestCache.refreshing = null;
      }
    });

  if (cache) {
    cache.refreshing = refreshing;
    setTokenCache(cache);
  } else {
    setTokenCache({
      accessToken: "",
      tokenType: "Bearer",
      expiresAt: 0,
      refreshAt: 0,
      refreshing,
    });
  }

  return refreshing;
}
