import { useEffect, useRef, useState } from "react";

export type PriceComponent = {
  title: string;
  name: string;
  type: string;
  value: number;
  total: number;
  isIncludedInTotalPrice: number;
};

export type PriceDetails = {
  totalPrice: number;
  components: PriceComponent[];
};

type PriceDetailsState = {
  priceDetails: PriceDetails | null;
  isLoading: boolean;
  error: string | null;
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const cache = new Map<string, { timestamp: number; result: PriceDetails }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function usePriceDetails(
  listingId: string,
  startDate: Date | null,
  endDate: Date | null,
  numberOfGuests: number,
  reservationCouponId?: number | null,
): PriceDetailsState {
  const [state, setState] = useState<PriceDetailsState>({
    priceDetails: null,
    isLoading: false,
    error: null,
  });
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!listingId || !startDate || !endDate || numberOfGuests < 1) {
      setState({ priceDetails: null, isLoading: false, error: null });
      return;
    }

    const startKey = formatDateKey(startDate);
    const endKey = formatDateKey(endDate);
    const cacheKey = `${listingId}:${startKey}:${endKey}:${numberOfGuests}:${reservationCouponId ?? ""}`;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setState({ priceDetails: cached.result, isLoading: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      fetch(`/api/hostaway/listings/${listingId}/price-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: startKey,
          endDate: endKey,
          numberOfGuests,
          ...(reservationCouponId != null && { reservationCouponId }),
        }),
        signal: controller.signal,
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = (await res.json().catch(() => ({}))) as {
              error?: string;
            };
            throw new Error(data.error ?? `HTTP ${res.status}`);
          }
          return res.json() as Promise<{ result: PriceDetails }>;
        })
        .then((data) => {
          if (controller.signal.aborted) return;
          const result = data.result;
          cache.set(cacheKey, { timestamp: Date.now(), result });
          setState({ priceDetails: result, isLoading: false, error: null });
        })
        .catch((err: unknown) => {
          if (err instanceof Error && err.name === "AbortError") return;
          setState({
            priceDetails: null,
            isLoading: false,
            error: err instanceof Error ? err.message : "Error desconocido",
          });
        });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [listingId, startDate, endDate, numberOfGuests, reservationCouponId]);

  return state;
}
