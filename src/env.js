import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    HOSTAWAY_CLIENT_ID: z.string().min(1),
    HOSTAWAY_CLIENT_SECRET: z.string().min(1),
    HOSTAWAY_SCOPE: z.string().default("general"),
    RESEND_API_BASE_URL: z.string().url(),
    RESEND_API_KEY: z.string().min(1),
    RESEND_FROM_EMAIL: z.string().email(),
    LEADS_TO_EMAIL: z.string().email(),
    STRIPE_SECRET_KEY: z.string().min(1),
    /**
     * Stripe test secret key — used only when the request comes from a
     * sandbox host (see `src/server/sandbox.ts`). Optional in environments
     * that aren't running the sandbox.
     */
    STRIPE_SECRET_KEY_TEST: z.string().optional(),
    /**
     * When set to "1" or "true" the booking flow skips real Hostaway calls
     * (mocked reservations) so the tracking team can validate Purchase events
     * without polluting the live calendar. Stripe keys should also be swapped
     * to test (`sk_test_*` / `pk_test_*`) in the same environment.
     */
    KANAA_SANDBOX_MODE: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    /**
     * Stripe test publishable key — bundled together with the live one so
     * the checkout page can swap at runtime based on `window.location.hostname`.
     */
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    HOSTAWAY_CLIENT_ID: process.env.HOSTAWAY_CLIENT_ID,
    HOSTAWAY_CLIENT_SECRET: process.env.HOSTAWAY_CLIENT_SECRET,
    HOSTAWAY_SCOPE: process.env.HOSTAWAY_SCOPE,
    RESEND_API_BASE_URL: process.env.RESEND_API_BASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    LEADS_TO_EMAIL: process.env.LEADS_TO_EMAIL,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_SECRET_KEY_TEST: process.env.STRIPE_SECRET_KEY_TEST,
    KANAA_SANDBOX_MODE: process.env.KANAA_SANDBOX_MODE,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
