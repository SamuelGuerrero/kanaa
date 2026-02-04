import { useEffect, useState } from "react";

interface OccupiedDatesResponse {
  status: string;
  result: string[];
  metadata?: {
    listingId: string;
    startDate: string;
    totalOccupiedDays: number;
  };
}

/**
 * Hook para obtener las fechas ocupadas de un listing
 * 
 * @param id - ID del listing en Hostaway
 * @returns Objeto con las fechas ocupadas, estado de carga y errores
 * 
 * @example
 * ```tsx
 * const { occupiedDates, isLoading, error } = useOccupiedDates('385746');
 * 
 * <BookingWidget
 *   price={1500}
 *   maxCapacity={6}
 *   occupiedDates={occupiedDates}
 * />
 * ```
 */
export function useOccupiedDates(id: string) {
  const [occupiedDates, setOccupiedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchOccupiedDates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/hostaway/listings/${id}/calendar`);

        if (!response.ok) {
          throw new Error("Error al cargar las fechas ocupadas");
        }

        const data = (await response.json()) as OccupiedDatesResponse;

        const dates = data.result.map(dateString => new Date(dateString));
        
        setOccupiedDates(dates);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setOccupiedDates([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOccupiedDates();
  }, [id]);

  return { occupiedDates, isLoading, error };
}