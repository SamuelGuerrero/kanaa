import { NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

interface LookupBody {
  // Accepts either Hostaway's internal numeric id (e.g. 41234567) or a
  // channel reservation code (e.g. Airbnb's "HMJ3SXMCDX"). The frontend
  // sends whatever the guest types — the backend decides how to query
  // Hostaway based on the shape of the value.
  reservationId: string | number;
  // Optional. When present we verify it matches the guest's email on
  // the Hostaway reservation (used by /reservation-tracking, where the
  // guest is managing their own booking). The invoice form
  // (/facturacion) omits it — Airbnb guests don't always remember which
  // email they used when they booked, and the page that follows is
  // billing-only (no booking actions exposed).
  email?: string;
}

interface HostawayReservationListResponse {
  status: string;
  result?: HostawayReservation[];
  message?: string;
}

interface HostawayReservation {
  id: number;
  listingMapId: number;
  status: string;
  guestName: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestCountry: string | null;
  phone: string | null;
  numberOfGuests: number;
  adults: number;
  children: number | null;
  infants: number | null;
  arrivalDate: string;
  departureDate: string;
  totalPrice: number;
  currency: string;
  isPaid: number;
  cancelledBy: string | null;
  comment: string | null;
  source: string | null;
  channelId: number;
}

interface HostawayReservationResponse {
  status: string;
  result?: HostawayReservation;
  message?: string;
}

export async function POST(request: Request) {
  let body: LookupBody;

  try {
    body = (await request.json()) as LookupBody;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud es inválido" },
      { status: 400 },
    );
  }

  const { reservationId, email } = body;

  const rawId =
    typeof reservationId === "number"
      ? String(reservationId)
      : typeof reservationId === "string"
        ? reservationId.trim().replace(/^#/, "")
        : "";

  if (!rawId) {
    return NextResponse.json(
      { error: "El número de reservación es requerido" },
      { status: 400 },
    );
  }

  const normalizedEmail =
    typeof email === "string" && email.trim() ? email.trim() : null;

  let authorization: string;
  try {
    authorization = await getHostawayAuthorizationHeader();
  } catch (error) {
    console.error("Error obteniendo token de Hostaway:", error);
    return NextResponse.json(
      { error: "Error de autenticación con el servicio" },
      { status: 502 },
    );
  }

  // All-digits → Hostaway internal id, lookup directly.
  // Anything else → channel reservation code (Airbnb's "HMJ...", Booking,
  // Vrbo, etc.), search the list endpoint by channelReservationId.
  const isNumericId = /^\d+$/.test(rawId);

  let reservation: HostawayReservation | undefined;

  if (isNumericId) {
    let response: Response;
    try {
      response = await fetch(`${HOSTAWAY_API_URL}/reservations/${rawId}`, {
        method: "GET",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
    } catch (error) {
      console.error("Error de red al buscar reservación:", error);
      return NextResponse.json(
        { error: "No se pudo conectar con el servicio" },
        { status: 502 },
      );
    }

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "No se encontró la reservación" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { error: "Error al buscar la reservación" },
        { status: response.status },
      );
    }

    let data: HostawayReservationResponse;
    try {
      data = (await response.json()) as HostawayReservationResponse;
    } catch {
      return NextResponse.json(
        { error: "Respuesta inválida del servicio" },
        { status: 502 },
      );
    }

    reservation = data.result;
  } else {
    // Hostaway exposes a `channelReservationId` filter on the listing
    // endpoint; one channel code maps to exactly one reservation in
    // practice, so we take the first hit.
    const url = new URL(`${HOSTAWAY_API_URL}/reservations`);
    url.searchParams.set("channelReservationId", rawId);
    url.searchParams.set("limit", "1");

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
    } catch (error) {
      console.error("Error de red al buscar reservación por canal:", error);
      return NextResponse.json(
        { error: "No se pudo conectar con el servicio" },
        { status: 502 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al buscar la reservación" },
        { status: response.status },
      );
    }

    let data: HostawayReservationListResponse;
    try {
      data = (await response.json()) as HostawayReservationListResponse;
    } catch {
      return NextResponse.json(
        { error: "Respuesta inválida del servicio" },
        { status: 502 },
      );
    }

    reservation = data.result?.[0];
  }

  if (!reservation) {
    return NextResponse.json(
      { error: "No se encontró la reservación" },
      { status: 404 },
    );
  }

  // Email is optional. When the caller provides it (reservation-tracking)
  // we verify the guest owns the booking. The invoice form omits it on
  // purpose (Airbnb guests don't remember which email they used).
  if (
    normalizedEmail &&
    reservation.guestEmail?.toLowerCase() !== normalizedEmail.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "El correo electrónico no coincide con la reservación" },
      { status: 403 },
    );
  }

  // Extract Stripe PaymentIntent ID from comment if available
  let paymentIntentId: string | null = null;
  if (reservation.comment) {
    const match = /Stripe PaymentIntent:\s*(pi_\w+)/.exec(reservation.comment);
    if (match?.[1]) {
      paymentIntentId = match[1];
    }
  }

  // Fetch listing info for property name and image
  let listingName: string | null = null;
  let listingImage: string | null = null;
  let listingCity: string | null = null;

  try {
    const listingResponse = await fetch(
      `${HOSTAWAY_API_URL}/listings/${reservation.listingMapId}?includeResources=1`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
      },
    );

    if (listingResponse.ok) {
      const listingData = (await listingResponse.json()) as {
        result?: {
          name?: string;
          city?: string;
          listingImages?: { url: string }[];
        };
      };
      listingName = listingData.result?.name ?? null;
      listingCity = listingData.result?.city ?? null;
      listingImage = listingData.result?.listingImages?.[0]?.url ?? null;
    }
  } catch {
    // Non-critical — continue without listing details
  }

  return NextResponse.json({
    success: true,
    reservation: {
      id: reservation.id,
      status: reservation.status,
      guestFirstName: reservation.guestFirstName,
      guestLastName: reservation.guestLastName,
      guestEmail: reservation.guestEmail,
      guestCountry: reservation.guestCountry,
      phone: reservation.phone,
      numberOfGuests: reservation.numberOfGuests,
      adults: reservation.adults,
      children: reservation.children,
      infants: reservation.infants,
      arrivalDate: reservation.arrivalDate,
      departureDate: reservation.departureDate,
      totalPrice: reservation.totalPrice,
      currency: reservation.currency,
      isPaid: reservation.isPaid,
      cancelledBy: reservation.cancelledBy,
      paymentIntentId,
      listingMapId: reservation.listingMapId,
      propertyName: listingName,
      propertyImage: listingImage,
      propertyCity: listingCity,
    },
  });
}
