import { NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

interface CancelReservationBody {
  reservationId: number;
}

interface HostawayCancelResponse {
  status: string;
  result?: Record<string, unknown>;
  message?: string;
}

export async function POST(request: Request) {
  let reservationId: number | undefined;

  try {
    const body = (await request.json()) as CancelReservationBody;
    reservationId = body.reservationId;
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud es inválido" },
      { status: 400 },
    );
  }

  if (!reservationId || typeof reservationId !== "number") {
    return NextResponse.json(
      { error: "reservationId es requerido y debe ser un número" },
      { status: 400 },
    );
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
  });
}
