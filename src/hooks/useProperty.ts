import { useEffect, useState } from "react";

import type { ApiResponse, Property } from "@/types/property";

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/hostaway/listings/${id}`);

        if (!response.ok) {
          throw new Error("Error al cargar la propiedad");
        }

        const data = (await response.json()) as ApiResponse<Property>;
        setProperty(data.result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProperty();
  }, [id]);

  return { property, isLoading, error };
}
