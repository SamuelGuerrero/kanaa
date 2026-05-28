# Sandbox / tracking-test environment

Lets the marketing & tracking team complete the full checkout flow with Stripe
test cards to validate analytics events (Purchase, revenue, Meta Pixel, etc.)
**without** touching production Stripe, Hostaway or guest emails.

## How it works

A single server-side flag, `KANAA_SANDBOX_MODE`, toggles the behaviour. When
it's set to `1` or `true`:

- `POST /api/hostaway/reservations/confirm` returns a fake reservation id
  prefixed with `9_990_000_000` instead of calling Hostaway. No real
  reservation is created. No confirmation email is sent through Resend.
- `POST /api/hostaway/reservations/cancel` still issues a Stripe refund (so
  the test PaymentIntent is refunded) but skips the Hostaway cancellation
  call.
- Every other route behaves identically to production.

The flag is read once from `process.env.KANAA_SANDBOX_MODE` via `src/env.js`
and exposed through `isSandboxMode()` in `src/server/sandbox.ts`.

## Activating on Vercel

Create a dedicated environment (Preview or Production-target alias such as
`tracking.kanaa.house`) with the following env vars:

```
KANAA_SANDBOX_MODE=1
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

All other env vars (Hostaway, Resend, Payload, etc.) stay the same as
production — they simply won't be called from the booking flow while
`KANAA_SANDBOX_MODE` is on.

## Stripe test cards

Use any of the standard Stripe test cards on the checkout form:

- `4242 4242 4242 4242` — succeeds
- `4000 0027 6000 3184` — requires 3DS (Authentication Required)
- `4000 0000 0000 9995` — declined (insufficient funds)

Any future expiration (e.g. `12 / 30`), any CVC (`123`), any postal code.

## Tracking the GTM container

Production and sandbox can share the same GTM container, but it's recommended
to use a **dedicated container** (`GTM-...-SANDBOX`) on the sandbox env so
test traffic doesn't pollute production GA4 / Meta Pixel data.

Set:

```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX-SANDBOX
```

## Verifying

1. Open the sandbox URL → start a booking on any property.
2. Use card `4242 4242 4242 4242` at checkout.
3. After payment the browser lands on
   `/es/booking-success/[propertyId]?payment_intent=pi_test_xxx&reservation_id=99900...`.
4. In the Stripe dashboard (test mode) you'll see the PaymentIntent.
5. In GTM Preview / Tag Assistant you'll see the `Page View` + `Purchase`
   events firing.
6. Hostaway production dashboard remains untouched.

## What this sandbox does NOT cover

- The Hostaway side of the integration. If you need to test Hostaway calendar
  changes, channel sync or guest emails, use a real reservation and cancel
  it. There's no public Hostaway sandbox.
- Resend deliverability. Confirmation emails are skipped in sandbox.
