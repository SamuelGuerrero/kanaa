import { getHostawayAuthorizationHeader } from "@/server/hostaway/auth";

import type { ApiResponse, Property } from "@/types/property";

const HOSTAWAY_API_URL = "https://api.hostaway.com/v1";

const hostawayFetch = async <T>(path: string) => {
  const authorization = await getHostawayAuthorizationHeader();
  const response = await fetch(`${HOSTAWAY_API_URL}${path}`, {
    method: "GET",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Error de Hostaway API: ${response.status}`);
  }

  return (await response.json()) as T;
};

export async function getListingById(id: string) {
  const data = await hostawayFetch<ApiResponse<Property>>(
    `/listings/${id}?includeResources=1`,
  );

  return data.result;
}

export async function getListings(options?: {
  limit?: number;
  offset?: number;
}) {
  const params = new URLSearchParams();
  if (options?.limit) params.set("limit", String(options.limit));
  if (typeof options?.offset === "number")
    params.set("offset", String(options.offset));

  const query = params.toString();
  const data = await hostawayFetch<ApiResponse<Property[]>>(
    `/listings${query ? `?${query}` : ""}`,
  );

  return data.result ?? [];
}
