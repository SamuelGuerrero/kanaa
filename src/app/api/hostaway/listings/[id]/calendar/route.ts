import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

interface CalendarDay {
  date: string;
  status: string;
  price?: number;
  minimumStay?: number;
  availability?: number;
}

interface CalendarApiResponse {
  status: string;
  result: CalendarDay[];
}

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

/**
 * GET /api/hostaway/listings/[id]/calendar
 *
 * Obtiene el calendario de disponibilidad de un listing
 * Retorna solo fechas desde hoy en adelante con status "reserved"
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!env.HOSTAWAY_TOKEN) {
      return NextResponse.json(
        { error: "Token de API no configurado" },
        { status: 500 },
      );
    }

    const today = new Date();
    const startDate = today.toISOString().split("T")[0];

    const url = `${HOSTAWAY_API_URL}/listings/${id}/calendar?startDate=${startDate}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `${env.HOSTAWAY_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Error de Hostaway API: ${response.status}`);
    }

    const data = (await response.json()) as CalendarApiResponse;

    const occupiedDates = data.result
      .filter((day) => day.status === "reserved")
      .map((day) => day.date);

    return NextResponse.json({
      status: "success",
      result: occupiedDates,
      metadata: {
        listingId: id,
        startDate: startDate,
        totalOccupiedDays: occupiedDates.length,
      },
    });
  } catch (error) {
    console.error("Error al obtener calendario:", error);
    return NextResponse.json(
      {
        error: "Error al cargar calendario",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
