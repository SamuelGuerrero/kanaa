"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import { useState } from "react";

import { Text } from "@/components/atoms";
import { CheckoutBookingSummary } from "@/components/molecules/CheckoutBookingSummary";
import { StripePoweredBy } from "@/components/molecules/StripePoweredBy";

import type { BookingData } from "@/components/molecules/BookingWidget";

type CheckoutPaymentFormProps = {
  bookingData: BookingData;
};

export const CheckoutPaymentForm = ({
  bookingData,
}: CheckoutPaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
      });

      if (error) {
        setMessage(error.message ?? "Ocurrió un error al procesar el pago");
      }
    } catch (err) {
      setMessage("Error inesperado al procesar el pago");
      console.error("Error en confirmSetup:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
      <CheckoutBookingSummary bookingData={bookingData} />

      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <Text font="gilroy" size="xl" weight="bold">
            Información de pago
          </Text>
          <div className="flex items-center gap-2 text-gray-500">
            <Lock className="h-4 w-4" />
            <Text font="gilroy" size="sm">
              Pago seguro
            </Text>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <PaymentElement
            options={{
              layout: {
                type: "tabs",
                defaultCollapsed: false,
              },
            }}
          />
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="bg-green-normal mb-6 w-full rounded-xl py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Procesando...
          </span>
        ) : (
          `Pagar ${new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(bookingData.totalPrice)}`
        )}
      </button>

      <div className="space-y-2 text-center">
        <Text font="gilroy" size="sm" className="text-gray-600">
          Al confirmar, aceptas nuestros términos y condiciones
        </Text>
        <StripePoweredBy />
      </div>
    </form>
  );
};
