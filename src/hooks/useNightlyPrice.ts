import { useMemo } from "react";

import { usePriceDetails } from "./usePriceDetails";

export function useNightlyPrice(listingId: string, fallback: number) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  const { priceDetails, isLoading } = usePriceDetails(listingId, today, tomorrow, 1);

  return {
    price: priceDetails?.totalPrice ?? fallback,
    isLoading: isLoading && priceDetails === null,
  };
}
