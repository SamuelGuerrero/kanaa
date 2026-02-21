import { type NextRequest, NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

import type { Property, ApiResponse } from "@/types/property";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const authorization = await getHostawayAuthorizationHeader();

    const response = await fetch(
      `${HOSTAWAY_API_URL}/listings/${id}?includeResources=1`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(`Error de Hostaway API: ${response.status}`);
    }

    const data = (await response.json()) as ApiResponse<Property>;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    return NextResponse.json(
      { error: "Error al cargar propiedad" },
      { status: 500 },
    );
  }
}
