import { NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

interface CreateReservationBody {
  listingMapId: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  phone: string;
  guestCountry: string;
  arrivalDate: string;
  departureDate: string;
  numberOfGuests: number;
  adults: number;
  children: number | null;
  infants: number | null;
  totalPrice: number;
  paymentIntentId?: string;
}

interface HostawayReservationResponse {
  status: string;
  result?: {
    id?: number;
    [key: string]: unknown;
  };
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateReservationBody;

    const {
      listingMapId,
      guestFirstName,
      guestLastName,
      guestEmail,
      phone,
      guestCountry,
      arrivalDate,
      departureDate,
      numberOfGuests,
      adults,
      children,
      infants,
      totalPrice,
      paymentIntentId,
    } = body;

    if (
      !listingMapId ||
      !guestFirstName ||
      !guestLastName ||
      !guestEmail ||
      !arrivalDate ||
      !departureDate ||
      !totalPrice
    ) {
      return NextResponse.json(
        { error: "Faltan campos requeridos para crear la reservación" },
        { status: 400 },
      );
    }

    const authorization = await getHostawayAuthorizationHeader();

    const reservationData = {
      channelId: 2000,
      listingMapId,
      isManuallyChecked: 0,
      isInitial: 0,
      guestName: `${guestFirstName} ${guestLastName}`,
      guestFirstName,
      guestLastName,
      guestEmail,
      guestCountry: guestCountry || null,
      phone: phone ? phone.replace(/[\s\-()]/g, "") : null,
      numberOfGuests,
      adults,
      children: children || null,
      infants: infants || null,
      arrivalDate,
      departureDate,
      totalPrice,
      currency: "MXN",
      isPaid: 1,
      source: "kanaa-website",
      comment: paymentIntentId
        ? `Stripe PaymentIntent: ${paymentIntentId}`
        : undefined,
    };

    const response = await fetch(`${HOSTAWAY_API_URL}/reservations`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    });

    const data = (await response.json()) as HostawayReservationResponse;

    if (!response.ok) {
      console.error("Hostaway reservation error:", data);
      return NextResponse.json(
        {
          error: "Error creando la reservación en Hostaway",
          details: data.message ?? `HTTP ${response.status}`,
        },
        { status: response.status },
      );
    }

    const reservationId = data.result?.id;

    // Register the Stripe payment as an offline charge so Hostaway marks it as paid
    if (reservationId) {
      try {
        await fetch(
          `${HOSTAWAY_API_URL}/guestPayments/charges/${reservationId}`,
          {
            method: "POST",
            headers: {
              Authorization: authorization,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "Pago con tarjeta — Stripe",
              description: paymentIntentId
                ? `Stripe PaymentIntent: ${paymentIntentId}`
                : "Pago procesado via Stripe desde kanaa.house",
              amount: totalPrice,
              paymentMethod: "credit_card",
              status: "paid",
              scheduledDate: new Date().toISOString().slice(0, 19).replace("T", " "),
            }),
          },
        );
      } catch (chargeError) {
        console.error(
          "Failed to register charge in Hostaway (reservation still created):",
          chargeError,
        );
      }
    }

    return NextResponse.json({
      success: true,
      reservationId: reservationId ?? null,
      reservation: data.result ?? null,
    });
  } catch (error) {
    console.error("Error creando reservación:", error);
    return NextResponse.json(
      {
        error: "Error interno al crear la reservación",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
