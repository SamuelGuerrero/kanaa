"use client";

import { useEffect, useState } from "react";

import { type SearchFilters } from "@/components/organisms";
import { PropertyListTemplate } from "@/components/templates";

import type { ApiResponse, Property } from "@/types/property";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchProperties();
  }, []);

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

      if (filters?.guests) {
        params.append("availabilityGuestNumber", filters.guests);
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

  const handleSearch = (filters: SearchFilters) => {
    void fetchProperties(filters);
  };

  return (
    <main className="flex flex-col space-y-6">
      <PropertyListTemplate
        properties={properties}
        isLoading={isLoading}
        error={error}
        fetchProperties={fetchProperties}
        handleSearch={handleSearch}
      />
    </main>
  );
}
