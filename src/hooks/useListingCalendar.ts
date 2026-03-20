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
  cacheTtlMs?: number;
};

type CacheEntry = {
  timestamp: number;
  result: CalendarDay[];
};

const memoryCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<CalendarDay[]>>();

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
  day.status === "reserved" ||
  day.status === "blocked" ||
  day.isAvailable === 0;

export function useListingCalendar(
  id: string,
  options: ListingCalendarOptions = {},
) {
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheTtlMs = options.cacheTtlMs ?? 60 * 60 * 1000;

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const startDate = options.startDate ?? formatDateKeyLocal(new Date());
    const endDate =
      options.endDate ?? formatDateKeyLocal(addDays(new Date(), 365));
    const cacheKey = `listing-calendar:${id}:${startDate}:${endDate}`;

    const readCache = (): CacheEntry | null => {
      const mem = memoryCache.get(cacheKey);
      if (mem && Date.now() - mem.timestamp < cacheTtlMs) {
        return mem;
      }
      try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CacheEntry;
        if (
          parsed?.timestamp &&
          Array.isArray(parsed.result) &&
          Date.now() - parsed.timestamp < cacheTtlMs
        ) {
          memoryCache.set(cacheKey, parsed);
          return parsed;
        }
      } catch {}
      return null;
    };

    const writeCache = (entry: CacheEntry) => {
      memoryCache.set(cacheKey, entry);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch {}
    };

    const fetchCalendar = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({ startDate, endDate });
        const url = `/api/hostaway/listings/${id}/calendar?${params.toString()}`;
        let request = inFlight.get(cacheKey);
        if (!request) {
          request = fetch(url)
            .then(async (response) => {
              if (!response.ok) {
                throw new Error("Error al cargar calendario del listing");
              }
              const data = (await response.json()) as ListingCalendarResponse;
              return Array.isArray(data.result) ? data.result : [];
            })
            .finally(() => {
              inFlight.delete(cacheKey);
            });
          inFlight.set(cacheKey, request);
        }

        const nextDays = await request;
        setCalendarDays(nextDays);

        writeCache({ timestamp: Date.now(), result: nextDays });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        setCalendarDays([]);
      } finally {
        setIsLoading(false);
      }
    };

    const cached = readCache();
    if (cached) {
      setCalendarDays(cached.result);
      setIsLoading(false);
      return;
    }

    void fetchCalendar();
  }, [cacheTtlMs, id, options.endDate, options.startDate]);

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
