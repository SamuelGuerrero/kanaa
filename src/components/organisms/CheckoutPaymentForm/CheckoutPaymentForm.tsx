"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { CircleButton, Text } from "@/components/atoms";
import { Button, Input, PhoneInput } from "@/components/molecules";
import { CheckoutBookingSummary } from "@/components/molecules/CheckoutBookingSummary";
import { StripePoweredBy } from "@/components/molecules/StripePoweredBy";
import { useI18n } from "@/i18n";

import type { GuestCounts } from "@/components/molecules";
import type { BookingData } from "@/components/molecules/BookingWidget";

const checkoutSchema = z
  .object({
    firstName: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "Los apellidos son requeridos"),
    email: z.string().email("Correo electrónico inválido"),
    confirmEmail: z.string().email("Correo electrónico inválido"),
    phone: z.string().min(7, "Número de teléfono inválido"),
    country: z.string().min(1, "Selecciona un país"),
    acceptedTerms: z.literal(true, {
      errorMap: () => ({ message: "Debes aceptar los términos y condiciones" }),
    }),
    acceptedCancellation: z.literal(true, {
      errorMap: () => ({ message: "Debes aceptar la política de cancelación" }),
    }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Los correos no coinciden",
    path: ["confirmEmail"],
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type CheckoutPaymentFormProps = {
  bookingData: BookingData;
  occupiedDates?: Date[];
  onDatesChange?: (startDate: Date | null, endDate: Date | null) => void;
  onGuestsChange?: (guests: GuestCounts) => void;
};

const COUNTRIES = [
  { value: "MX", label: "México" },
  { value: "US", label: "Estados Unidos" },
  { value: "CA", label: "Canadá" },
  { value: "ES", label: "España" },
  { value: "CO", label: "Colombia" },
  { value: "AR", label: "Argentina" },
  { value: "BR", label: "Brasil" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Perú" },
  { value: "other", label: "Otro" },
];

export const CheckoutPaymentForm = ({
  bookingData,
  occupiedDates,
  onDatesChange,
  onGuestsChange,
}: CheckoutPaymentFormProps) => {
  const { t } = useI18n();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");
  const [addBillingData, setAddBillingData] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      confirmEmail: "",
      phone: "",
      country: "",
    },
  });

  const onSubmit = async () => {
    if (!stripe || !elements) return;
    setIsLoading(true);
    setStripeError("");
    try {
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
      });
      if (error)
        setStripeError(error.message ?? "Ocurrió un error al procesar el pago");
    } catch (err) {
      setStripeError("Error inesperado al procesar el pago");
      console.error("Error en confirmSetup:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_480px]">
        <div className="space-y-8">
          <section>
            <Text
              font="gilroy"
              size="xl"
              weight="bold"
              className="text-green-normal mb-4"
            >
              Información personal
            </Text>

            <div className="border-grey-normal rounded-2xl border bg-white p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Nombre (s)"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Alexander"
                          labelSize="base"
                          labelWeight="bold"
                          labelClassName="text-green-darker leading-5"
                          className="font-gilroy text-base font-medium leading-4.75 text-green-darker placeholder-[#6A6A6A] transition-colors duration-150"
                        />
                      )}
                    />
                  </div>
                  {errors.firstName && (
                    <Text
                      font="gilroy"
                      size="xs"
                      className="mt-1 ml-1 text-red-500"
                    >
                      {errors.firstName.message}
                    </Text>
                  )}
                </div>

                <div>
                  <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Apellidos"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Montes de Oca"
                          labelSize="base"
                          labelWeight="bold"
                          labelClassName="text-green-darker leading-5"
                          className="font-gilroy text-base font-medium leading-4.75 text-green-darker placeholder-[#6A6A6A] transition-colors duration-150"
                        />
                      )}
                    />
                  </div>
                  {errors.lastName && (
                    <Text
                      font="gilroy"
                      size="xs"
                      className="mt-1 ml-1 text-red-500"
                    >
                      {errors.lastName.message}
                    </Text>
                  )}
                </div>

                <div>
                  <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Correo electrónico"
                          type="email"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="alexander@tucorreo.com"
                          labelSize="base"
                          labelWeight="bold"
                          labelClassName="text-green-darker leading-5"
                          className="font-gilroy text-base font-medium leading-4.75 text-green-darker placeholder-[#6A6A6A] transition-colors duration-150"
                        />
                      )}
                    />
                  </div>
                  {errors.email && (
                    <Text
                      font="gilroy"
                      size="xs"
                      className="mt-1 ml-1 text-red-500"
                    >
                      {errors.email.message}
                    </Text>
                  )}
                </div>

                <div>
                  <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                    <Controller
                      name="confirmEmail"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Confirma tu correo electrónico"
                          type="email"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="alexander@tucorreo.com"
                          labelSize="base"
                          labelWeight="bold"
                          labelClassName="text-green-darker leading-5"
                          className="font-gilroy text-base font-medium leading-4.75 text-green-darker placeholder-[#6A6A6A] transition-colors duration-150"
                        />
                      )}
                    />
                  </div>
                  {errors.confirmEmail && (
                    <Text
                      font="gilroy"
                      size="xs"
                      className="mt-1 ml-1 text-red-500"
                    >
                      {errors.confirmEmail.message}
                    </Text>
                  )}
                </div>

                <div>
                  <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          label="Número de teléfono"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <Text
                      font="gilroy"
                      size="xs"
                      className="mt-1 ml-1 text-red-500"
                    >
                      {errors.phone.message}
                    </Text>
                  )}
                </div>

                {/* País de residencia */}
                <div>
                  <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                    <Text
                      font="gilroy"
                      size="base"
                      weight="bold"
                      className="text-green-darker leading-5"
                    >
                      País de residencia
                    </Text>
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <select
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className="font-gilroy text-green-darker w-full appearance-none bg-transparent text-base leading-4.75 font-medium outline-none"
                        >
                          <option value="" disabled>
                            Selecciona un país
                          </option>
                          {COUNTRIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                  {errors.country && (
                    <Text
                      font="gilroy"
                      size="xs"
                      className="mt-1 ml-1 text-red-500"
                    >
                      {errors.country.message}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </section>

          <label className="mt-5 flex cursor-pointer items-center gap-3">
            <div className="relative h-7.5 w-7.5 shrink-0">
              <input
                type="checkbox"
                checked={addBillingData}
                onChange={(e) => setAddBillingData(e.target.checked)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div
                className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-[#A68D6E] ${addBillingData ? "bg-green-normal" : "bg-white"}`}
              >
                {addBillingData && (
                  <Check className="h-4 w-4 text-[#A68D6E]" strokeWidth={2.5} />
                )}
              </div>
            </div>
            <Text font="gilroy" size="base" className="text-green-darker">
              Añadir tus datos para facturación
            </Text>
          </label>

          <section>
            <Text
              font="gilroy"
              size="xl"
              weight="bold"
              className="text-green-normal mb-4"
            >
              Información del pago
            </Text>
            <div className="border-grey-normal rounded-2xl border bg-white p-6">
              <PaymentElement
                options={{ layout: { type: "tabs", defaultCollapsed: false } }}
              />
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <Text
                font="gilroy"
                size="sm"
                weight="semibold"
                className="text-green-darker"
              >
                Política de cancelación
              </Text>
              <Text font="gilroy" size="sm" className="text-grey-darker">
                100% reembolsable hasta 14 días antes de la llegada
              </Text>
              <Text font="gilroy" size="sm" className="text-grey-darker">
                50% reembolsable hasta 7 días antes de la llegada
              </Text>
            </div>

            <div>
              <Controller
                name="acceptedTerms"
                control={control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-3">
                    <div className="relative mt-0.5 h-7.5 w-7.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) =>
                          field.onChange(e.target.checked || undefined)
                        }
                        onBlur={field.onBlur}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <div
                        className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-[#A68D6E] ${field.value ? "bg-green-normal" : "bg-white"}`}
                      >
                        {field.value && (
                          <Check
                            className="h-4 w-4 text-[#A68D6E]"
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                    </div>
                    <Text
                      font="gilroy"
                      size="base"
                      className="text-green-darker"
                    >
                      Acepto los{" "}
                      <a
                        href="/es/terms-and-conditions"
                        className="text-gold-normal underline"
                        target="_blank"
                      >
                        términos y condiciones
                      </a>
                    </Text>
                  </label>
                )}
              />
              {errors.acceptedTerms && (
                <Text
                  font="gilroy"
                  size="xs"
                  className="mt-1 ml-10 text-red-500"
                >
                  {errors.acceptedTerms.message}
                </Text>
              )}
            </div>

            <div>
              <Controller
                name="acceptedCancellation"
                control={control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-3">
                    <div className="relative mt-0.5 h-7.5 w-7.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={!!field.value}
                        onChange={(e) =>
                          field.onChange(e.target.checked || undefined)
                        }
                        onBlur={field.onBlur}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <div
                        className={`flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-[#A68D6E] ${field.value ? "bg-green-normal" : "bg-white"}`}
                      >
                        {field.value && (
                          <Check
                            className="h-4 w-4 text-[#A68D6E]"
                            strokeWidth={2.5}
                          />
                        )}
                      </div>
                    </div>
                    <Text
                      font="gilroy"
                      size="base"
                      className="text-green-darker"
                    >
                      Acepto la{" "}
                      <a
                        href="/es/privacy-policy"
                        className="text-gold-normal underline"
                        target="_blank"
                      >
                        políticas de cancelación
                      </a>
                    </Text>
                  </label>
                )}
              />
              {errors.acceptedCancellation && (
                <Text
                  font="gilroy"
                  size="xs"
                  className="mt-1 ml-10 text-red-500"
                >
                  {errors.acceptedCancellation.message}
                </Text>
              )}
            </div>
          </section>

          {stripeError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <Text font="gilroy" size="sm" className="text-red-700">
                {t(stripeError)}
              </Text>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={!stripe || isLoading || !isValid}
            className="h-14.5 w-full justify-center"
            textWeight="bold"
            textClassName="text-gold-dark"
            icon={
              isLoading ? (
                <div className="border-gold-normal h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
              ) : (
                <CircleButton className="bg-white!">
                  <ArrowRight className="text-gold-normal-hover h-6 w-6 drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
              )
            }
          >
            {isLoading ? t("Procesando...") : "Confirmar y pagar"}
          </Button>

          <div className="space-y-1 text-center">
            <Text font="gilroy" size="sm" className="text-grey-darker">
              Al confirmar, aceptas nuestros términos y condiciones
            </Text>
            <StripePoweredBy />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <CheckoutBookingSummary
            bookingData={bookingData}
            occupiedDates={occupiedDates}
            onDatesChange={onDatesChange}
            onGuestsChange={onGuestsChange}
          />
        </div>
      </div>
    </form>
  );
};
