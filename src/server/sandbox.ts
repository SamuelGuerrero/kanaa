import { headers } from "next/headers";

import { env } from "@/env";

/**
 * Hostnames that should always behave as the tracking sandbox regardless of
 * env vars. The Vercel-assigned alias is kept here so the marketing team can
 * test against a stable URL without us having to push env-var changes.
 */
const SANDBOX_HOSTS = new Set<string>(["kanaa-eight.vercel.app"]);

const envFlagEnabled = (): boolean => {
  const raw = env.KANAA_SANDBOX_MODE?.toLowerCase();
  return raw === "1" || raw === "true";
};

/**
 * Whether the current request should run in tracking-sandbox mode.
 *
 * Two ways to enter the sandbox:
 * 1. Request host matches one of `SANDBOX_HOSTS` (e.g. the Vercel preview alias).
 * 2. `KANAA_SANDBOX_MODE` is set on the deployment env (escape hatch for
 *    dedicated sandbox environments).
 *
 * Production (`kanaa.house`) never hits either branch unless the env flag is
 * intentionally set, so guest bookings keep flowing through Hostaway + Resend.
 */
export const isSandboxMode = async (): Promise<boolean> => {
  if (envFlagEnabled()) return true;
  try {
    const headerStore = await headers();
    const host = (
      headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? ""
    )
      .toLowerCase()
      .split(":")[0];
    return host ? SANDBOX_HOSTS.has(host) : false;
  } catch {
    // No request context (e.g. build-time analysis). Default to real mode.
    return false;
  }
};

/**
 * Returns a fake numeric reservation id that won't collide with real Hostaway
 * IDs (we prefix with a high constant so it's obvious in logs and dashboards).
 */
export const fakeSandboxReservationId = (): number => {
  return 9_990_000_000 + Math.floor(Math.random() * 1_000_000);
};
