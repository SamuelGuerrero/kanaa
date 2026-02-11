"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type ReservationSearchInitialFilters,
  type SearchFilters,
} from "@/components/organisms";
import { PropertyListTemplate } from "@/components/templates";

import type { ApiResponse, Property } from "@/types/property";

export const PropertiesSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async (filters?: SearchFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (filters?.destination) {
        params.append("city", filters.destination);
      }

      if (filters?.checkIn) {
        params.append("availabilityDateStart", filters.checkIn);
      }

      if (filters?.checkOut) {
        params.append("availabilityDateEnd", filters.checkOut);
      }

      if (filters?.guestCounts) {
        const totalGuests =
          filters.guestCounts.adults + filters.guestCounts.children;
        params.append("availabilityGuestNumber", String(totalGuests));
      } else if (filters?.guests) {
        const numericGuests = Number.parseInt(filters.guests, 10);
        if (Number.isFinite(numericGuests)) {
          params.append("availabilityGuestNumber", String(numericGuests));
        }
      }

      const response = await fetch(
        `/api/hostaway/listings?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Error al cargar propiedades");
      }

      const data = (await response.json()) as ApiResponse<Property[]>;
      setProperties(data.result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const buildFiltersFromParams = useCallback(
    (params: URLSearchParams): SearchFilters | null => {
      const destination = params.get("destination") ?? "";
      const checkIn = params.get("checkIn") ?? "";
      const checkOut = params.get("checkOut") ?? "";
      const adults = Number(params.get("adults") ?? 1);
      const children = Number(params.get("children") ?? 0);
      const infants = Number(params.get("infants") ?? 0);

      const guestCounts = {
        adults: Number.isFinite(adults) ? adults : 1,
        children: Number.isFinite(children) ? children : 0,
        infants: Number.isFinite(infants) ? infants : 0,
      };

      const hasGuestParams =
        params.has("adults") || params.has("children") || params.has("infants");

      if (!destination && !checkIn && !checkOut && !hasGuestParams) {
        return null;
      }

      return {
        destination,
        checkIn,
        checkOut,
        guests: "",
        guestCounts,
      };
    },
    [],
  );

  const initialFilters = useMemo<
    ReservationSearchInitialFilters | undefined
  >(() => {
    const filters = buildFiltersFromParams(searchParams);
    if (!filters) return undefined;
    return {
      destination: filters.destination,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      guestCounts: filters.guestCounts,
    };
  }, [buildFiltersFromParams, searchParams]);

  useEffect(() => {
    const filters = buildFiltersFromParams(searchParams);
    if (filters) {
      void fetchProperties(filters);
      return;
    }
    void fetchProperties();
  }, [buildFiltersFromParams, searchParams]);

  const handleSearch = (filters: SearchFilters) => {
    const params = new URLSearchParams();
    if (filters.destination) params.append("destination", filters.destination);
    if (filters.checkIn) params.append("checkIn", filters.checkIn);
    if (filters.checkOut) params.append("checkOut", filters.checkOut);
    params.append("adults", String(filters.guestCounts.adults));
    params.append("children", String(filters.guestCounts.children));
    params.append("infants", String(filters.guestCounts.infants));
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <main className="flex flex-col space-y-6">
      <PropertyListTemplate
        properties={properties}
        isLoading={isLoading}
        error={error}
        fetchProperties={fetchProperties}
        handleSearch={handleSearch}
        initialFilters={initialFilters}
      />
    </main>
  );
};
