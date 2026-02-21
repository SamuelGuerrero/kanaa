import { type NextRequest, NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

import type { Property, ApiResponse } from "@/types/property";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";
const CACHE_TTL_MS = 60 * 1000;
const CACHE_STALE_MS = 5 * 60 * 1000;

type CacheEntry = {
  data: ApiResponse<Property[]>;
  expiresAt: number;
  staleAt: number;
  refreshing?: Promise<ApiResponse<Property[]>> | null;
};

const listingsCache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const hostawayParams = new URLSearchParams();

    const limit = searchParams.get("limit") ?? "16";
    hostawayParams.append("limit", limit);

    if (searchParams.get("offset")) {
      hostawayParams.append("offset", searchParams.get("offset")!);
    }

    if (searchParams.get("city")) {
      hostawayParams.append("city", searchParams.get("city")!);
    }

    if (searchParams.get("match")) {
      hostawayParams.append("match", searchParams.get("match")!);
    }

    if (searchParams.get("country")) {
      hostawayParams.append("country", searchParams.get("country")!);
    }

    if (searchParams.get("availabilityDateStart")) {
      hostawayParams.append(
        "availabilityDateStart",
        searchParams.get("availabilityDateStart")!,
      );
    }

    if (searchParams.get("availabilityDateEnd")) {
      hostawayParams.append(
        "availabilityDateEnd",
        searchParams.get("availabilityDateEnd")!,
      );
    }

    if (searchParams.get("availabilityGuestNumber")) {
      hostawayParams.append(
        "availabilityGuestNumber",
        searchParams.get("availabilityGuestNumber")!,
      );
    }

    const cacheKey = hostawayParams.toString();
    const now = Date.now();
    const cached = listingsCache.get(cacheKey);

    const fetchFromHostaway = async () => {
      const authorization = await getHostawayAuthorizationHeader();
      const response = await fetch(
        `${HOSTAWAY_API_URL}/listings?${hostawayParams.toString()}`,
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

      return (await response.json()) as ApiResponse<Property[]>;
    };

    if (cached) {
      if (now < cached.expiresAt) {
        return NextResponse.json(cached.data);
      }

      if (now < cached.staleAt) {
        cached.refreshing ??= fetchFromHostaway()
          .then((data) => {
            listingsCache.set(cacheKey, {
              data,
              expiresAt: Date.now() + CACHE_TTL_MS,
              staleAt: Date.now() + CACHE_STALE_MS,
              refreshing: null,
            });
            return data;
          })
          .catch(() => {
            cached.refreshing = null;
            return cached.data;
          });
        return NextResponse.json(cached.data);
      }
    }

    const data = await fetchFromHostaway();
    listingsCache.set(cacheKey, {
      data,
      expiresAt: now + CACHE_TTL_MS,
      staleAt: now + CACHE_STALE_MS,
      refreshing: null,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener listings:", error);
    return NextResponse.json(
      { error: "Error al cargar propiedades" },
      { status: 500 },
    );
  }
}
