import { type NextRequest, NextResponse } from "next/server";

import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

import type { Property, ApiResponse } from "@/types/property";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";
const CACHE_TTL_MS = 60 * 1000;
const CACHE_STALE_MS = 5 * 60 * 1000;
const PRIORITY_LISTING_IDS = [448506, 488293, 396219];
const GENERAL_LISTINGS_LIMIT = 100;

type CacheEntry = {
  data: ApiResponse<Property[]>;
  expiresAt: number;
  staleAt: number;
  refreshing?: Promise<ApiResponse<Property[]>> | null;
};

const listingsCache = new Map<string, CacheEntry>();

const parsePositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

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
      const requestLimit = parsePositiveInt(searchParams.get("limit"), 16);
      const requestOffset = searchParams.get("offset") ?? "0";

      const hasFilters =
        Boolean(searchParams.get("city")) ||
        Boolean(searchParams.get("match")) ||
        Boolean(searchParams.get("country")) ||
        Boolean(searchParams.get("availabilityDateStart")) ||
        Boolean(searchParams.get("availabilityDateEnd")) ||
        Boolean(searchParams.get("availabilityGuestNumber"));

      const shouldPrioritizeListings =
        !hasFilters && requestOffset === "0" && requestLimit <= 12;

      if (!shouldPrioritizeListings) {
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
      }

      const priorityResponses = await Promise.allSettled(
        PRIORITY_LISTING_IDS.map(async (id) => {
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
            throw new Error(`Error de Hostaway API (listing ${id})`);
          }

          const listingData = (await response.json()) as ApiResponse<Property>;
          return listingData.result;
        }),
      );

      const prioritizedListings = priorityResponses
        .filter(
          (result): result is PromiseFulfilledResult<Property> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

      const generalParams = new URLSearchParams({
        limit: GENERAL_LISTINGS_LIMIT.toString(),
        offset: "0",
      });

      const generalResponse = await fetch(
        `${HOSTAWAY_API_URL}/listings?${generalParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: authorization,
            "Content-Type": "application/json",
          },
          next: { revalidate: 3600 },
        },
      );

      if (!generalResponse.ok) {
        throw new Error(`Error de Hostaway API: ${generalResponse.status}`);
      }

      const generalData = (await generalResponse.json()) as ApiResponse<
        Property[]
      >;

      const excludedIds = new Set(PRIORITY_LISTING_IDS);
      const remainingListings = (generalData.result ?? []).filter(
        (listing) => !excludedIds.has(listing.id),
      );

      const result = [...prioritizedListings, ...remainingListings].slice(
        0,
        requestLimit,
      );

      return {
        ...generalData,
        result,
        count: Number.isFinite(generalData.count)
          ? generalData.count
          : result.length,
        limit: requestLimit,
        offset: 0,
      } as ApiResponse<Property[]>;
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
