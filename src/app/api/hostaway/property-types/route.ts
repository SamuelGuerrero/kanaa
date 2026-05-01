import { NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

import type { ApiResponse, Property } from "@/types/property";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1h — types rarely change

type PropertyType = { id: number; name: string };

type CacheEntry = {
  data: PropertyType[];
  expiresAt: number;
};

let cache: CacheEntry | null = null;

const fetchPropertyTypes = async (): Promise<PropertyType[]> => {
  const authorization = await getHostawayAuthorizationHeader();

  // Fetch the full type catalog and the active inventory in parallel, then
  // narrow the catalog down to types Kanaa actually rents — avoids overwhelming
  // the user with 60+ options most of which would yield zero results.
  const [typesResponse, listingsResponse] = await Promise.all([
    fetch(`${HOSTAWAY_API_URL}/propertyTypes`, {
      method: "GET",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      next: { revalidate: 86400 },
    }),
    fetch(`${HOSTAWAY_API_URL}/listings?limit=200&offset=0`, {
      method: "GET",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    }),
  ]);

  if (!typesResponse.ok) {
    throw new Error(`Hostaway propertyTypes error: ${typesResponse.status}`);
  }
  if (!listingsResponse.ok) {
    throw new Error(`Hostaway listings error: ${listingsResponse.status}`);
  }

  const typesData = (await typesResponse.json()) as ApiResponse<PropertyType[]>;
  const listingsData = (await listingsResponse.json()) as ApiResponse<
    Property[]
  >;

  const usedIds = new Set(
    (listingsData.result ?? [])
      .map((listing) => listing.propertyTypeId)
      .filter((id): id is number => typeof id === "number"),
  );

  return (typesData.result ?? [])
    .filter((type) => usedIds.has(type.id))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export async function GET() {
  try {
    const now = Date.now();
    if (cache && now < cache.expiresAt) {
      return NextResponse.json({ result: cache.data });
    }

    const data = await fetchPropertyTypes();
    cache = { data, expiresAt: now + CACHE_TTL_MS };
    return NextResponse.json({ result: data });
  } catch (error) {
    console.error("Error fetching property types:", error);
    return NextResponse.json(
      { error: "Error al cargar tipos de propiedad" },
      { status: 500 },
    );
  }
}
