import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";
import { isSandboxMode } from "@/server/sandbox";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

interface CancelReservationBody {
  reservationId: number;
  paymentIntentId?: string;
}

interface HostawayCancelResponse {
  status: string;
  result?: Record<string, unknown>;
  message?: string;
}

export async function POST(request: Request) {
  let body: CancelReservationBody;

  try {
    body = (await request.json()) as CancelReservationBody;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud es inválido" },
      { status: 400 },
    );
  }

  const { reservationId, paymentIntentId } = body;

  if (!reservationId || typeof reservationId !== "number") {
    return NextResponse.json(
      { error: "reservationId es requerido y debe ser un número" },
      { status: 400 },
    );
  }

  // 1. Refund via Stripe if paymentIntentId is provided
  let refundId: string | null = null;
  if (paymentIntentId) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      refundId = refund.id;
    } catch (error) {
      console.error("Error creating Stripe refund:", error);
      return NextResponse.json(
        {
          error: "No se pudo procesar el reembolso en Stripe",
          details: error instanceof Error ? error.message : "Error desconocido",
        },
        { status: 502 },
      );
    }
  }

  // 2. Cancel reservation in Hostaway — skipped in sandbox mode since the
  //    reservation never existed in the first place. The Stripe refund above
  //    already succeeded against the test PaymentIntent.
  if (isSandboxMode()) {
    console.info("[sandbox] mocked Hostaway cancellation:", reservationId);
    return NextResponse.json({
      success: true,
      sandbox: true,
      reservation: { id: reservationId, status: "cancelled" },
      refundId,
    });
  }

  let authorization: string;
  try {
    authorization = await getHostawayAuthorizationHeader();
  } catch (error) {
    console.error("Error obteniendo token de Hostaway:", error);
    return NextResponse.json(
      {
        error: "Error de autenticación con Hostaway",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 502 },
    );
  }

  let response: Response;
  try {
    response = await fetch(
      `${HOSTAWAY_API_URL}/reservations/${reservationId}/statuses/cancelled`,
      {
        method: "PUT",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          cancelledBy: "guest",
        }),
      },
    );
  } catch (error) {
    console.error("Error de red al cancelar reservación:", error);
    return NextResponse.json(
      {
        error: "No se pudo conectar con Hostaway",
        details: error instanceof Error ? error.message : "Error de red",
      },
      { status: 502 },
    );
  }

  let data: HostawayCancelResponse;
  try {
    data = (await response.json()) as HostawayCancelResponse;
  } catch {
    console.error("Respuesta no válida de Hostaway, status:", response.status);
    return NextResponse.json(
      {
        error: "Respuesta inválida de Hostaway",
        details: `HTTP ${response.status}`,
      },
      { status: 502 },
    );
  }

  if (!response.ok) {
    console.error("Hostaway cancel error:", data);
    return NextResponse.json(
      {
        error: "Error cancelando la reservación en Hostaway",
        details: data.message ?? `HTTP ${response.status}`,
      },
      { status: response.status },
    );
  }

  return NextResponse.json({
    success: true,
    reservation: data.result ?? null,
    refundId,
  });
}
