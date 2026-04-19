import { NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

interface UpdateReservationBody {
  reservationId: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  phone: string | null;
  guestCountry: string | null;
  arrivalDate: string;
  departureDate: string;
  adults: number;
  children: number;
  infants: number;
}

interface HostawayUpdateReservationResponse {
  status: string;
  result?: Record<string, unknown>;
  message?: string;
}

const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export async function POST(request: Request) {
  let body: UpdateReservationBody;

  try {
    body = (await request.json()) as UpdateReservationBody;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud es inválido" },
      { status: 400 },
    );
  }

  const {
    reservationId,
    guestFirstName,
    guestLastName,
    guestEmail,
    phone,
    guestCountry,
    arrivalDate,
    departureDate,
    adults,
    children,
    infants,
  } = body;

  if (
    !reservationId ||
    !guestFirstName?.trim() ||
    !guestLastName?.trim() ||
    !guestEmail?.trim()
  ) {
    return NextResponse.json(
      { error: "Faltan campos requeridos para actualizar la reservación" },
      { status: 400 },
    );
  }

  if (
    !isValidDate(arrivalDate) ||
    !isValidDate(departureDate) ||
    new Date(departureDate) <= new Date(arrivalDate)
  ) {
    return NextResponse.json(
      { error: "Las fechas de la reservación son inválidas" },
      { status: 400 },
    );
  }

  if (adults < 1 || children < 0 || infants < 0) {
    return NextResponse.json(
      { error: "El número de huéspedes no es válido" },
      { status: 400 },
    );
  }

  const numberOfGuests = adults + children + infants;

  let authorization: string;
  try {
    authorization = await getHostawayAuthorizationHeader();
  } catch (error) {
    console.error("Error obteniendo token de Hostaway:", error);
    return NextResponse.json(
      { error: "Error de autenticación con Hostaway" },
      { status: 502 },
    );
  }

  const payload = {
    guestName: `${guestFirstName.trim()} ${guestLastName.trim()}`,
    guestFirstName: guestFirstName.trim(),
    guestLastName: guestLastName.trim(),
    guestEmail: guestEmail.trim(),
    guestCountry: guestCountry?.trim() || null,
    phone: phone?.trim() ? phone.replace(/[\s\-()]/g, "") : null,
    arrivalDate,
    departureDate,
    adults,
    children: children || null,
    infants: infants || null,
    numberOfGuests,
  };

  let response: Response;
  try {
    response = await fetch(`${HOSTAWAY_API_URL}/reservations/${reservationId}`, {
      method: "PUT",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Error de red al actualizar reservación:", error);
    return NextResponse.json(
      { error: "No se pudo conectar con Hostaway" },
      { status: 502 },
    );
  }

  let data: HostawayUpdateReservationResponse;
  try {
    data = (await response.json()) as HostawayUpdateReservationResponse;
  } catch {
    return NextResponse.json(
      { error: "Respuesta inválida al actualizar la reservación" },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "No se pudo actualizar la reservación en Hostaway",
        details: data.message ?? `HTTP ${response.status}`,
      },
      { status: response.status },
    );
  }

  return NextResponse.json({
    success: true,
    reservation: data.result ?? null,
  });
}
