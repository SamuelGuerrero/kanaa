import { NextResponse } from "next/server";

import { getStripeClient } from "@/server/stripe";

/**
 * Read-only endpoint that rebuilds the minimum booking data needed to fire
 * the GA4 `purchase` event from a Stripe PaymentIntent id alone. We use
 * this on `/booking-success` when `sessionStorage.bookingData` is missing
 * — for example when marketing audits the URL directly with Tag Assistant,
 * when the user refreshes after closing the tab, or when the success URL
 * is opened from the confirmation email on another device.
 *
 * Returns only what the dataLayer push needs (value, currency, listing id,
 * nights, guests). No PII, no Stripe secrets.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentIntentId: string }> },
) {
  const { paymentIntentId } = await params;

  if (!paymentIntentId || !paymentIntentId.startsWith("pi_")) {
    return NextResponse.json(
      { error: "paymentIntentId inválido" },
      { status: 400 },
    );
  }

  let stripe;
  try {
    stripe = await getStripeClient();
  } catch (error) {
    return NextResponse.json(
      {
        error: "Stripe no configurado",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }

  let intent;
  try {
    intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    return NextResponse.json(
      {
        error: "No se pudo recuperar el PaymentIntent",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 404 },
    );
  }

  const meta = intent.metadata ?? {};
  const arrival = typeof meta.arrivalDate === "string" ? meta.arrivalDate : null;
  const departure =
    typeof meta.departureDate === "string" ? meta.departureDate : null;

  // Stripe stores amount in the smallest currency unit (centavos for MXN);
  // the dataLayer expects the human-readable total.
  const value = intent.amount / 100;

  const nights =
    arrival && departure
      ? Math.max(
          1,
          Math.ceil(
            (new Date(departure).getTime() - new Date(arrival).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  return NextResponse.json({
    value,
    currency: intent.currency.toUpperCase(),
    listingId: typeof meta.listingId === "string" ? meta.listingId : null,
    nights,
    guests: meta.numberOfGuests ? Number(meta.numberOfGuests) : null,
    arrivalDate: arrival,
    departureDate: departure,
  });
}
