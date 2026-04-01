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
  setupIntentId?: string;
}

interface HostawayReservationResponse {
  status: string;
  result?: {
    id?: number;
    hostaway_reservation_id?: number;
    [key: string]: unknown;
  };
  message?: string;
}

interface GuestCharge {
  id: number;
  status: string;
  name?: string;
  type?: string;
  amount?: number;
  [key: string]: unknown;
}

interface HostawayChargesResponse {
  status: string;
  result?: GuestCharge[];
  message?: string;
}

async function checkChargeStatus(
  reservationId: number,
  authorization: string,
): Promise<{ paid: boolean; chargeStatus: string; errorMessage?: string }> {
  // Wait for Hostaway to process the auto-charge
  await new Promise((resolve) => setTimeout(resolve, 4000));

  try {
    const response = await fetch(
      `${HOSTAWAY_API_URL}/reservations/${reservationId}/guestCharges`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    );

    if (!response.ok) {
      return { paid: false, chargeStatus: "unknown" };
    }

    const data = (await response.json()) as HostawayChargesResponse;
    const charges = data.result ?? [];

    // Find the "Reservation Payment" charge (the auto-charge)
    const reservationCharge = charges.find(
      (c) => c.type === "charge" || c.name === "Reservation Payment",
    );

    if (!reservationCharge) {
      return { paid: false, chargeStatus: "no_charge_found" };
    }

    const status = (reservationCharge.status ?? "").toLowerCase();

    if (status === "paid" || status === "succeeded" || status === "completed") {
      return { paid: true, chargeStatus: status };
    }

    if (status === "cancelled" || status === "failed") {
      return {
        paid: false,
        chargeStatus: status,
        errorMessage:
          "El cobro fue rechazado. Verifica que tu tarjeta tenga fondos suficientes.",
      };
    }

    // "due" or "pending" - charge was created but not yet processed
    return { paid: false, chargeStatus: status };
  } catch {
    return { paid: false, chargeStatus: "error" };
  }
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
      isPaid: null,
      source: "kanaa-website",
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

    if (!reservationId) {
      return NextResponse.json({
        success: true,
        reservationId: null,
        reservation: data.result ?? null,
        paymentStatus: "unknown",
      });
    }

    // Check if the auto-charge succeeded
    const chargeResult = await checkChargeStatus(reservationId, authorization);

    if (chargeResult.paid) {
      return NextResponse.json({
        success: true,
        reservationId,
        reservation: data.result ?? null,
        paymentStatus: "paid",
      });
    }

    if (
      chargeResult.chargeStatus === "cancelled" ||
      chargeResult.chargeStatus === "failed"
    ) {
      // Cancel the reservation since payment failed
      try {
        await fetch(
          `${HOSTAWAY_API_URL}/reservations/${reservationId}/statuses/cancelled`,
          {
            method: "PUT",
            headers: {
              Authorization: authorization,
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            body: JSON.stringify({ cancelledBy: "guest" }),
          },
        );
      } catch {
        console.error(
          "Failed to cancel reservation after payment failure:",
          reservationId,
        );
      }

      return NextResponse.json(
        {
          error:
            chargeResult.errorMessage ??
            "El cobro no pudo procesarse. La reservación ha sido cancelada.",
          paymentStatus: chargeResult.chargeStatus,
          reservationId,
        },
        { status: 402 },
      );
    }

    // Charge is "due" or "pending" - payment hasn't been processed yet
    return NextResponse.json({
      success: true,
      reservationId,
      reservation: data.result ?? null,
      paymentStatus: chargeResult.chargeStatus,
      paymentPending: true,
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
