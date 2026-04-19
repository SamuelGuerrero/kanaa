import { NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

interface LookupBody {
  reservationId: number;
  email: string;
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

  if (!reservationId || typeof reservationId !== "number") {
    return NextResponse.json(
      { error: "El número de reservación es requerido" },
      { status: 400 },
    );
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "El correo electrónico es requerido" },
      { status: 400 },
    );
  }

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

  let response: Response;
  try {
    response = await fetch(
      `${HOSTAWAY_API_URL}/reservations/${reservationId}`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    );
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

  const reservation = data.result;

  if (!reservation) {
    return NextResponse.json(
      { error: "No se encontró la reservación" },
      { status: 404 },
    );
  }

  // Validate email matches (case-insensitive)
  if (reservation.guestEmail?.toLowerCase() !== email.toLowerCase()) {
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
