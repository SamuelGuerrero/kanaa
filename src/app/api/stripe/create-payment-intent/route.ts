import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

interface CreatePaymentIntentBody {
  amount: number;
  currency?: string;
  listingId: string;
  arrivalDate: string;
  departureDate: string;
  numberOfGuests: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreatePaymentIntentBody;

    const { amount, currency, listingId, arrivalDate, departureDate, numberOfGuests } = body;

    if (!amount || !listingId || !arrivalDate || !departureDate) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "El monto debe ser mayor a 0" },
        { status: 400 },
      );
    }

    // Stripe expects amount in the smallest currency unit (centavos for MXN)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: (currency ?? "mxn").toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        listingId,
        arrivalDate,
        departureDate,
        numberOfGuests: String(numberOfGuests),
        source: "kanaa-website",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
    return NextResponse.json(
      {
        error: "Error creando la intención de pago",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
