/**
 * Thin wrapper around `window.dataLayer.push`. The GTM bootloader (see
 * `src/components/atoms/GoogleTagManager`) creates the array if it doesn't
 * exist, so consumers don't need to handle that case — they just need to be
 * SSR-safe.
 *
 * One event shape per exported function keeps the tracking surface auditable
 * and lets the marketing team map each one to GA4 / Meta Pixel via GTM tags
 * without having to coordinate code changes.
 */

type DataLayerEvent = Record<string, unknown> & { event: string };

const push = (payload: DataLayerEvent): void => {
  if (typeof window === "undefined") return;
  // GTM creates window.dataLayer on init; using a typed cast keeps callers
  // from having to widen their types just to access it.
  const win = window as Window & { dataLayer?: unknown[] };
  win.dataLayer = win.dataLayer ?? [];
  win.dataLayer.push(payload);
};

/* ── Purchase ─────────────────────────────────────────────────────────── */

export type PurchasePayload = {
  /** Stripe PaymentIntent id — primary dedupe key */
  transactionId: string;
  /** Hostaway reservation id (or sandbox fake) — secondary dedupe */
  reservationId?: string | number;
  /** Total amount paid by the guest */
  value: number;
  /** ISO 4217 code — Kanaa is MXN today */
  currency: string;
  /** Property id used for both listing id and analytics item id */
  propertyId: string;
  /** Property display name */
  propertyName?: string;
  /** Number of nights in the booking */
  nights?: number;
  /** Number of guests (adults + children + infants) */
  guests?: number;
  /** Marks the event as coming from the tracking sandbox URL */
  sandbox?: boolean;
};

/**
 * Pushes the standard GA4 `purchase` event to the dataLayer. GTM maps the
 * same event to:
 * - GA4 → ecommerce purchase
 * - Meta Pixel → `Purchase` (server + browser via CAPI)
 *
 * Safe to call multiple times: GTM will fire its trigger as many times as
 * the event lands on the dataLayer. Call sites are responsible for guarding
 * against double-fires (the booking-success page uses a ref + transaction id).
 */
export const pushPurchase = (payload: PurchasePayload): void => {
  push({
    event: "purchase",
    ecommerce: {
      transaction_id: payload.transactionId,
      reservation_id: payload.reservationId,
      value: payload.value,
      currency: payload.currency,
      items: [
        {
          item_id: payload.propertyId,
          item_name: payload.propertyName ?? `Property ${payload.propertyId}`,
          item_category: "lodging",
          price: payload.value,
          quantity: 1,
        },
      ],
    },
    booking: {
      nights: payload.nights,
      guests: payload.guests,
    },
    sandbox: payload.sandbox ?? false,
  });
};
