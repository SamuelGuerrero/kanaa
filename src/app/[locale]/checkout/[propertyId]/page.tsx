"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Text } from "@/components/atoms";
import { CheckoutHeader } from "@/components/molecules/CheckoutHeader";
import { CheckoutHero } from "@/components/molecules/CheckoutHero";
import { CheckoutPaymentForm } from "@/components/organisms/CheckoutPaymentForm";

import type { BookingData } from "@/components/molecules/BookingWidget";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.propertyId as string;
  const locale = (params?.locale as string) ?? "es";
  const isCheckoutDisabled = true;

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [stripePromise, setStripePromise] = useState<ReturnType<
    typeof loadStripe
  > | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isCheckoutDisabled) {
      router.replace(`/${locale}`);
      return;
    }
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

    const initializeStripe = async () => {
      try {
        const keyResponse = await fetch(
          `/api/hostaway/stripe/get-publishable-key?listingMapId=${parsedData.listingMapId}`,
        );

        if (!keyResponse.ok) {
          const errorData = (await keyResponse.json()) as { error?: string };
          throw new Error(
            errorData.error ?? "Error obteniendo la clave de Stripe",
          );
        }

        const { publishableKey } = (await keyResponse.json()) as {
          publishableKey: string;
        };

        if (!publishableKey) {
          throw new Error("No se recibió la clave de Stripe");
        }

        const stripe = await loadStripe(publishableKey);
        setStripePromise(Promise.resolve(stripe));

        const intentResponse = await fetch(
          "/api/hostaway/stripe/create-setup-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ listingMapId: parsedData.listingMapId }),
          },
        );

        if (!intentResponse.ok) {
          const errorData = (await intentResponse.json()) as {
            error?: string;
          };
          throw new Error(errorData.error ?? "Error creando el setup intent");
        }

        const { clientSecret: secret } = (await intentResponse.json()) as {
          clientSecret: string;
        };

        if (!secret) {
          throw new Error("No se recibió el client secret");
        }

        setClientSecret(secret);
      } catch (err) {
        console.error("Error inicializando Stripe:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    void initializeStripe();
  }, [propertyId, router, isCheckoutDisabled, locale]);

  const options: StripeElementsOptions | undefined = clientSecret
    ? {
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
      }
    : undefined;

  if (isCheckoutDisabled) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-6 py-20">
        <div className="text-center">
          <Text size="3xl" weight="bold" className="text-green-normal">
            Checkout deshabilitado
          </Text>
          <Text size="lg" font="gilroy" className="mt-3 text-gray-600">
            Esta ruta está bloqueada temporalmente.
          </Text>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <CheckoutHeader onBack={() => router.back()} />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12">
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
            <CheckoutPaymentForm bookingData={bookingData} />
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
