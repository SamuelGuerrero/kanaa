"use client";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { X } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import { Text } from "@/components/atoms";

import type { BookingData } from "@/components/molecules";

interface BookingPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData;
}

function PaymentForm({
  bookingData,
  onSuccess,
}: {
  bookingData: BookingData;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmation`,
        },
      });

      if (error) {
        setMessage(error.message ?? "Ocurrió un error al procesar el pago");
      } else {
        onSuccess();
      }
    } catch (err) {
      setMessage("Error inesperado al procesar el pago");
      console.error("Error en confirmSetup:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return date.toLocaleDateString("es-MX", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg bg-gray-50 p-4">
        <Text font="gilroy" size="lg" weight="bold" className="mb-3">
          Resumen de tu reserva
        </Text>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Llegada:</span>
            <span className="font-medium">
              {formatDate(bookingData.startDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Salida:</span>
            <span className="font-medium">
              {formatDate(bookingData.endDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">
              {bookingData.totalNights}{" "}
              {bookingData.totalNights === 1 ? "noche" : "noches"}
            </span>
            <span className="font-medium">
              $
              {new Intl.NumberFormat("es-MX").format(
                bookingData.totalPrice / bookingData.totalNights,
              )}{" "}
              MXN
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Huéspedes:</span>
            <span className="font-medium">
              {bookingData.guests.adults} adultos
              {bookingData.guests.children > 0 &&
                `, ${bookingData.guests.children} niños`}
              {bookingData.guests.infants > 0 &&
                `, ${bookingData.guests.infants} bebés`}
            </span>
          </div>
          <div className="mt-3 flex justify-between border-t border-gray-300 pt-3">
            <Text font="gilroy" weight="bold" size="lg">
              Total:
            </Text>
            <Text font="gilroy" weight="bold" size="lg">
              ${new Intl.NumberFormat("es-MX").format(bookingData.totalPrice)}{" "}
              MXN
            </Text>
          </div>
        </div>
      </div>

      <div>
        <Text font="gilroy" size="lg" weight="bold" className="mb-3">
          Método de pago
        </Text>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <PaymentElement />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="bg-green-normal w-full rounded-lg py-3 font-semibold text-white transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Procesando..." : "Confirmar reserva"}
      </button>

      {message && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <Text font="gilroy" size="sm" className="text-center text-gray-600">
          Al confirmar, aceptas nuestros términos y condiciones
        </Text>
        <Text font="gilroy" size="sm" className="text-center text-gray-500">
          Pago seguro procesado por Stripe
        </Text>
      </div>
    </form>
  );
}

export const BookingPaymentModal = ({
  isOpen,
  onClose,
  bookingData,
}: BookingPaymentModalProps) => {
  const [stripePromise, setStripePromise] = useState<ReturnType<
    typeof loadStripe
  > | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initializeStripe = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const keyResponse = await fetch(
        `/api/hostaway/stripe/get-publishable-key?listingMapId=${bookingData.listingMapId}`,
      );
      console.log("Respuesta", keyResponse);
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
          body: JSON.stringify({ listingMapId: bookingData.listingMapId }),
        },
      );

      if (!intentResponse.ok) {
        const errorData = (await intentResponse.json()) as { error?: string };
        throw new Error(errorData.error ?? "Error creando el setup intent");
      }

      const { clientSecret: secret } = (await intentResponse.json()) as {
        clientSecret: string;
      };

      if (!secret) {
        throw new Error("No se recibió el client secret");
      }

      setClientSecret(secret);
      setIsInitialized(true);
    } catch (err) {
      console.error("Error inicializando Stripe:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, [bookingData.listingMapId]);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      void initializeStripe();
    }
  }, [initializeStripe, isInitialized, isOpen]);

  if (!isOpen) return null;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#10b981",
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "Gilroy, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <Text font="gilroy" size="2xl" weight="bold">
            Completa tu reserva
          </Text>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <Text font="gilroy" size="sm" className="text-red-700">
              {error}
            </Text>
            <button
              onClick={() => {
                setError("");
                setIsInitialized(false);
                void initializeStripe();
              }}
              className="mt-2 text-sm font-semibold text-red-700 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {isLoading || !isInitialized ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="border-t-green-normal h-12 w-12 animate-spin rounded-full border-4 border-gray-200" />
            <Text font="gilroy" size="sm" className="mt-4 text-gray-600">
              Cargando información de pago...
            </Text>
          </div>
        ) : (
          stripePromise &&
          clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm
                bookingData={bookingData}
                onSuccess={() => {
                  console.log("Pago exitoso");
                  onClose();
                }}
              />
            </Elements>
          )
        )}
      </div>
    </div>
  );
};
