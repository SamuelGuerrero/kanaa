import { env } from "@/env";

/**
 * Whether the current deployment is the tracking-only sandbox.
 *
 * When this returns `true`, code paths that would otherwise hit Hostaway or
 * send guest-facing emails should short-circuit with a mocked response so the
 * tracking team can validate Purchase / revenue events without touching the
 * production calendar.
 */
export const isSandboxMode = (): boolean => {
  const raw = env.KANAA_SANDBOX_MODE?.toLowerCase();
  return raw === "1" || raw === "true";
};

/**
 * Returns a fake numeric reservation id that won't collide with real Hostaway
 * IDs (we prefix with a high constant so it's obvious in logs and dashboards).
 */
export const fakeSandboxReservationId = (): number => {
  return 9_990_000_000 + Math.floor(Math.random() * 1_000_000);
};
