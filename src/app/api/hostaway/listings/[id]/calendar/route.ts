import { type NextRequest, NextResponse } from "next/server";

import { env } from "@/env";

interface CalendarDay {
  date: string;
  status?: string;
  price?: number;
  minimumStay?: number;
  maximumStay?: number;
  isAvailable?: number;
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
 * Retorna el calendario desde la fecha solicitada con precios por día
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

    const { searchParams } = new URL(request.url);
    const today = new Date();
    const startDate =
      searchParams.get("startDate") ?? today.toISOString().split("T")[0];
    const endDate = searchParams.get("endDate");
    const includeResources = searchParams.get("includeResources");

    const hostawayParams = new URLSearchParams({ startDate });
    if (endDate) hostawayParams.append("endDate", endDate);
    if (includeResources) {
      hostawayParams.append("includeResources", includeResources);
    }

    const url = `${HOSTAWAY_API_URL}/listings/${id}/calendar?${hostawayParams.toString()}`;
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

    return NextResponse.json({
      status: "success",
      result: data.result ?? [],
      metadata: {
        listingId: id,
        startDate,
        endDate: endDate ?? undefined,
        totalDays: data.result?.length ?? 0,
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
