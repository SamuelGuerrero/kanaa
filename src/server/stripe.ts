import Stripe from "stripe";

import { env } from "@/env";
import { isSandboxMode } from "@/server/sandbox";

const STRIPE_API_VERSION = "2026-03-25.dahlia" as const;

/**
 * Returns the right Stripe client for the current request. When the request
 * comes from a sandbox host (e.g. the Vercel-assigned alias used by the
 * marketing team) we use the test secret key so the same flow accepts
 * `4242 4242 4242 4242` and doesn't charge real money. Everywhere else we
 * stay on the live key.
 */
export const getStripeClient = async (): Promise<Stripe> => {
  const sandbox = await isSandboxMode();
  if (sandbox) {
    const testKey = env.STRIPE_SECRET_KEY_TEST;
    if (!testKey) {
      throw new Error(
        "Sandbox mode is active but STRIPE_SECRET_KEY_TEST is not configured. " +
          "Add a Stripe test secret key to the deployment environment.",
      );
    }
    return new Stripe(testKey, { apiVersion: STRIPE_API_VERSION });
  }

  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });
};
