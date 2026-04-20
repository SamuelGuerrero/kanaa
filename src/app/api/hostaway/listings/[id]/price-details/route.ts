import { type NextRequest, NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

interface PriceDetailsBody {
  startDate: string;
  endDate: string;
  numberOfGuests: number;
}

interface HostawayPriceDetailsResponse {
  status: string;
  result?: {
    totalPrice?: number;
    components?: unknown[];
    [key: string]: unknown;
  };
  message?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as PriceDetailsBody;
    const { startDate, endDate, numberOfGuests } = body;

    if (!startDate || !endDate || !numberOfGuests) {
      return NextResponse.json(
        { error: "startDate, endDate y numberOfGuests son requeridos" },
        { status: 400 },
      );
    }

    const authorization = await getHostawayAuthorizationHeader();

    const response = await fetch(
      `${HOSTAWAY_API_URL}/listings/${id}/calendar/priceDetails`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          startingDate: startDate,
          endingDate: endDate,
          numberOfGuests,
        }),
      },
    );

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      console.error("Hostaway priceDetails error:", response.status, errorData);
      return NextResponse.json(
        {
          error: "Error obteniendo detalles de precio",
          details: errorData.message ?? `HTTP ${response.status}`,
        },
        { status: response.status },
      );
    }

    const data = (await response.json()) as HostawayPriceDetailsResponse;

    return NextResponse.json({
      status: "success",
      result: data.result ?? null,
    });
  } catch (error) {
    console.error("Error al obtener detalles de precio:", error);
    return NextResponse.json(
      {
        error: "Error al obtener detalles de precio",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
