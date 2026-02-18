import "server-only";

import { NextResponse } from "next/server";

import { db } from "@/server/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get("codigo");

    if (!codigo) {
      return NextResponse.json(
        { error: "Missing 'codigo' query param" },
        { status: 400 }
      );
    }

    const rows = await db.cnbv.findMany({
      where: { codigo },
    });

    return NextResponse.json({ codigo, rows });
  } catch (error) {
    console.error("CNBV API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
