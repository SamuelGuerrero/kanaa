import { useEffect, useMemo, useState } from "react";

export type CalendarDay = {
  date: string;
  status?: string;
  price?: number;
  minimumStay?: number;
  maximumStay?: number;
  isAvailable?: number;
};

interface ListingCalendarResponse {
  status: string;
  result: CalendarDay[];
  metadata?: {
    listingId: string;
    startDate: string;
    endDate?: string;
    totalDays?: number;
  };
}

type ListingCalendarOptions = {
  startDate?: string;
  endDate?: string;
};

const formatDateKeyLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const isOccupiedDay = (day: CalendarDay) =>
  day.status === "reserved" || day.status === "blocked" || day.isAvailable === 0;

export function useListingCalendar(
  id: string,
  options: ListingCalendarOptions = {},
) {
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchCalendar = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const startDate =
          options.startDate ?? formatDateKeyLocal(new Date());
        const endDate =
          options.endDate ?? formatDateKeyLocal(addDays(new Date(), 365));

        const params = new URLSearchParams({ startDate, endDate });
        const response = await fetch(
          `/api/hostaway/listings/${id}/calendar?${params.toString()}`,
        );

        if (!response.ok) {
          throw new Error("Error al cargar calendario del listing");
        }

        const data = (await response.json()) as ListingCalendarResponse;
        setCalendarDays(Array.isArray(data.result) ? data.result : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setCalendarDays([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCalendar();
  }, [id, options.endDate, options.startDate]);

  const occupiedDates = useMemo(
    () =>
      calendarDays
        .filter((day) => isOccupiedDay(day))
        .map((day) => new Date(`${day.date}T00:00:00`)),
    [calendarDays],
  );

  const priceByDate = useMemo(() => {
    const map: Record<string, number> = {};
    calendarDays.forEach((day) => {
      if (typeof day.price === "number") {
        map[day.date] = day.price;
      }
    });
    return map;
  }, [calendarDays]);

  return { calendarDays, occupiedDates, priceByDate, isLoading, error };
}
