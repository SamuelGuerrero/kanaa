"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Text } from "@/components/atoms";
import { CheckoutHero } from "@/components/molecules";
import { CheckoutPaymentForm } from "@/components/organisms";
import { useListingCalendar } from "@/hooks/useListingCalendar";
import { usePriceDetails } from "@/hooks/usePriceDetails";

import type { BookingData } from "@/components/molecules";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.propertyId as string;
  const locale = (params?.locale as string) ?? "es";
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isPaymentIntentLoading, setIsPaymentIntentLoading] = useState(false);
  const [addBillingData, setAddBillingData] = useState(false);
  const [billingData, setBillingData] = useState({
    rfc: "",
    razonSocial: "",
    regimenFiscal: "",
    codigoPostal: "",
    usoCFDI: "",
    direccion: "",
    emailFacturacion: "",
  });
  const [billingTouched, setBillingTouched] = useState<Record<string, boolean>>(
    {},
  );
  const { occupiedDates } = useListingCalendar(propertyId);
  const requestKeyRef = useRef<string | null>(null);

  const numberOfGuests = bookingData
    ? bookingData.guests.adults + bookingData.guests.children
    : 1;

  const { priceDetails, isLoading: isPriceLoading } = usePriceDetails(
    propertyId,
    bookingData?.startDate ?? null,
    bookingData?.endDate ?? null,
    Math.max(1, numberOfGuests),
  );

  useEffect(() => {
    if (!priceDetails || !bookingData) return;

    const updated = {
      ...bookingData,
      totalPrice: priceDetails.totalPrice,
      priceBreakdown: priceDetails,
    };

    sessionStorage.setItem("bookingData", JSON.stringify(updated));
    setBookingData(updated);
  }, [priceDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const savedBookingData = sessionStorage.getItem("bookingData");
    if (!savedBookingData) {
      router.push(`/${locale}/properties/${propertyId}`);
      return;
    }

    const parsedData = JSON.parse(savedBookingData) as BookingData;
    const bookingDataWithDates: BookingData = {
      ...parsedData,
      startDate: parsedData.startDate ? new Date(parsedData.startDate) : null,
      endDate: parsedData.endDate ? new Date(parsedData.endDate) : null,
    };

    setBookingData(bookingDataWithDates);
    setIsBootstrapping(false);
  }, [propertyId, router, locale]);

  const paymentIntentRequestKey = useMemo(() => {
    if (
      !bookingData?.startDate ||
      !bookingData?.endDate ||
      !bookingData?.totalPrice
    ) {
      return null;
    }

    return JSON.stringify({
      listingMapId: bookingData.listingMapId,
      startDate: bookingData.startDate.toISOString(),
      endDate: bookingData.endDate.toISOString(),
      totalPrice: bookingData.totalPrice,
      guests: bookingData.guests.adults + bookingData.guests.children,
    });
  }, [bookingData]);

  useEffect(() => {
    if (!bookingData || !paymentIntentRequestKey || isPriceLoading) {
      return;
    }

    if (!stripePromise) {
      setError("Falta configurar NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
      return;
    }

    if (requestKeyRef.current === paymentIntentRequestKey) {
      return;
    }

    const startDate = bookingData.startDate;
    const endDate = bookingData.endDate;

    if (!startDate || !endDate) {
      return;
    }

    let cancelled = false;

    const createPaymentIntent = async () => {
      setIsPaymentIntentLoading(true);
      setError("");
      setClientSecret(null);

      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: bookingData.totalPrice,
            currency: "mxn",
            listingId: bookingData.listingMapId,
            arrivalDate: startDate.toISOString().slice(0, 10),
            departureDate: endDate.toISOString().slice(0, 10),
            numberOfGuests:
              bookingData.guests.adults + bookingData.guests.children,
          }),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as { error?: string };
          throw new Error(
            errorData.error ?? "Error creando la intención de pago",
          );
        }

        const data = (await response.json()) as {
          clientSecret: string;
          paymentIntentId: string;
        };

        if (cancelled) return;

        requestKeyRef.current = paymentIntentRequestKey;
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err) {
        if (cancelled) return;
        console.error("Error creando PaymentIntent:", err);
        setClientSecret(null);
        setPaymentIntentId(null);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        if (!cancelled) {
          setIsPaymentIntentLoading(false);
        }
      }
    };

    void createPaymentIntent();

    return () => {
      cancelled = true;
    };
  }, [bookingData, isPriceLoading, paymentIntentRequestKey]);

  const handleDatesChange = (startDate: Date | null, endDate: Date | null) => {
    if (!bookingData) return;
    const totalNights =
      startDate && endDate
        ? Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          )
        : bookingData.totalNights;

    const updated = {
      ...bookingData,
      startDate,
      endDate,
      totalNights,
    };
    sessionStorage.setItem("bookingData", JSON.stringify(updated));
    setBookingData(updated);
  };

  const handleGuestsChange = (guests: BookingData["guests"]) => {
    if (!bookingData) return;
    const updated = { ...bookingData, guests };
    sessionStorage.setItem("bookingData", JSON.stringify(updated));
    setBookingData(updated);
  };

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!clientSecret || !stripePromise) return undefined;
    return {
      clientSecret,
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#10b981",
          colorBackground: "#ffffff",
          colorText: "#1f2937",
          colorDanger: "#ef4444",
          fontFamily:
            "'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          spacingUnit: "4px",
          borderRadius: "12px",
        },
      },
    };
  }, [clientSecret]);

  const isLoading = isBootstrapping || isPaymentIntentLoading;

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-12">
        <CheckoutHero />

        {error && (
          <div className="mx-auto mb-6 max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4">
            <Text font="gilroy" size="base" className="text-red-700">
              {error}
            </Text>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="border-t-green-normal h-16 w-16 animate-spin rounded-full border-4 border-gray-200" />
            <Text font="gilroy" size="lg" className="mt-6 text-gray-600">
              Preparando tu reserva...
            </Text>
          </div>
        ) : bookingData && stripePromise && options ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutPaymentForm
              bookingData={bookingData}
              occupiedDates={occupiedDates}
              onDatesChange={handleDatesChange}
              onGuestsChange={handleGuestsChange}
              priceBreakdown={priceDetails}
              isPriceLoading={isPriceLoading}
              paymentIntentId={paymentIntentId}
              addBillingData={addBillingData}
              onAddBillingDataChange={setAddBillingData}
              billingData={billingData}
              onBillingDataChange={setBillingData}
              billingTouched={billingTouched}
              onBillingTouchedChange={setBillingTouched}
            />
          </Elements>
        ) : (
          <div className="mx-auto max-w-3xl rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
            <Text font="gilroy" size="base" className="text-yellow-800">
              No se encontraron datos de reserva. Por favor, vuelve a la
              propiedad y selecciona tus fechas.
            </Text>
          </div>
        )}
      </main>
    </div>
  );
}
