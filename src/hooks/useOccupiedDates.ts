import { useListingCalendar } from "./useListingCalendar";

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
  const { occupiedDates, isLoading, error } = useListingCalendar(id);

  return { occupiedDates, isLoading, error };
}
