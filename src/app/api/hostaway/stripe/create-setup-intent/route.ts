import { NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

interface HostawaySetupIntentResponse {
  result?: {
    clientSecret?: string;
  };
  status?: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { listingMapId?: string };
    const { listingMapId } = body;

    if (!listingMapId) {
      return NextResponse.json(
        { error: "listingMapId es requerido" },
        { status: 400 },
      );
    }

    const authorization = await getHostawayAuthorizationHeader();

    const response = await fetch(
      `${HOSTAWAY_API_URL}/stripe/createSetupIntent/${listingMapId}`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Hostaway API error: ${response.status}`);
    }

    const data = (await response.json()) as HostawaySetupIntentResponse;

    return NextResponse.json({
      clientSecret: data?.result?.clientSecret ?? null,
    });
  } catch (error) {
    console.error("Error creando setup intent:", error);
    return NextResponse.json(
      {
        error: "Error creando setup intent",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
