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
import {
  Button,
  CheckoutBookingSummary,
  Input,
  PhoneInput,
  StripePoweredBy,
} from "@/components/molecules";
import { useI18n } from "@/i18n";

import type { BookingData, GuestCounts } from "@/components/molecules";
import type { PriceDetails } from "@/hooks/usePriceDetails";

const formatDateForApi = (date: Date | null): string => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const makeCheckoutSchema = (en: boolean) =>
  z
    .object({
      firstName: z.string().min(1, en ? "First name is required" : "El nombre es requerido"),
      lastName: z.string().min(1, en ? "Last name is required" : "Los apellidos son requeridos"),
      email: z.string().email(en ? "Invalid email address" : "Correo electrónico inválido"),
      confirmEmail: z.string().email(en ? "Invalid email address" : "Correo electrónico inválido"),
      phone: z.string().min(7, en ? "Invalid phone number" : "Número de teléfono inválido"),
      country: z.string().min(1, en ? "Select a country" : "Selecciona un país"),
      acceptedTerms: z.literal(true, {
        errorMap: () => ({
          message: en
            ? "You must accept the terms and conditions and the cancellation policy"
            : "Debes aceptar los términos y condiciones y la política de cancelación",
        }),
      }),
    })
    .refine((data) => data.email === data.confirmEmail, {
      message: en ? "Emails do not match" : "Los correos no coinciden",
      path: ["confirmEmail"],
    });

type CheckoutFormValues = z.infer<ReturnType<typeof makeCheckoutSchema>>;

type BillingData = {
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  codigoPostal: string;
  usoCFDI: string;
  direccion: string;
  emailFacturacion: string;
};

export type { BillingData };

type CheckoutPaymentFormProps = {
  bookingData: BookingData;
  occupiedDates?: Date[];
  onDatesChange?: (startDate: Date | null, endDate: Date | null) => void;
  onGuestsChange?: (guests: GuestCounts) => void;
  priceBreakdown?: PriceDetails | null;
  isPriceLoading?: boolean;
  paymentIntentId?: string | null;
  addBillingData: boolean;
  onAddBillingDataChange: (value: boolean) => void;
  billingData: BillingData;
  onBillingDataChange: (data: BillingData) => void;
  billingTouched: Record<string, boolean>;
  onBillingTouchedChange: (touched: Record<string, boolean>) => void;
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
  priceBreakdown,
  isPriceLoading,
  paymentIntentId,
  addBillingData,
  onAddBillingDataChange,
  billingData,
  onBillingDataChange,
  billingTouched,
  onBillingTouchedChange,
}: CheckoutPaymentFormProps) => {
  const { t, locale } = useI18n();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState("");

  const getBillingErrors = () => {
    const errors: Record<string, string> = {};
    if (!billingData?.rfc?.trim())
      errors.rfc = locale === "en" ? "RFC required" : "RFC requerido";
    if (!billingData?.razonSocial?.trim())
      errors.razonSocial =
        locale === "en" ? "Name or company name required" : "Nombre o razón social requerido";
    if (!billingData?.regimenFiscal?.trim())
      errors.regimenFiscal =
        locale === "en" ? "Tax regime required" : "Régimen fiscal requerido";
    if (!billingData?.codigoPostal?.trim())
      errors.codigoPostal =
        locale === "en" ? "Zip code required" : "Código postal requerido";
    if (!billingData?.usoCFDI?.trim())
      errors.usoCFDI =
        locale === "en" ? "CFDI use required" : "Uso de CFDI requerido";
    if (!billingData?.direccion?.trim())
      errors.direccion =
        locale === "en" ? "Address required" : "Dirección requerida";
    if (!billingData?.emailFacturacion?.trim()) {
      errors.emailFacturacion =
        locale === "en" ? "Billing email required" : "Correo de facturación requerido";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingData.emailFacturacion)
    ) {
      errors.emailFacturacion =
        locale === "en" ? "Invalid email address" : "Correo electrónico inválido";
    }
    return errors;
  };

  const billingErrors = getBillingErrors();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(makeCheckoutSchema(locale === "en")),
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

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!stripe || !elements) return;

    if (addBillingData) {
      const errors = getBillingErrors();
      if (Object.keys(errors).length > 0) {
        const allTouched = Object.fromEntries(
          Object.keys(billingData).map((k) => [k, true]),
        );
        onBillingTouchedChange(allTouched);
        return;
      }
    }

    setIsLoading(true);
    setStripeError("");

    const guestData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      confirmEmail: values.confirmEmail,
      phone: values.phone,
      country: values.country,
    };
    sessionStorage.setItem("guestData", JSON.stringify(guestData));

    try {
      // 1. Charge the card via PaymentIntent
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: `${values.firstName} ${values.lastName}`.trim(),
              email: values.email,
              phone: values.phone,
              address: { country: values.country },
            },
          },
          return_url: `${window.location.origin}/${window.location.pathname.split("/")[1]}/booking-success/${bookingData.listingMapId}`,
        },
      });

      if (error) {
        setStripeError(error.message ?? "Ocurrió un error al procesar el pago");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setStripeError("No se pudo confirmar el pago");
        return;
      }

      // 2. Payment succeeded — now create reservation in Hostaway
      const reservationResponse = await fetch(
        "/api/hostaway/reservations/confirm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingMapId: Number(bookingData.listingMapId),
            guestFirstName: values.firstName,
            guestLastName: values.lastName,
            guestEmail: values.email,
            phone: values.phone,
            guestCountry: values.country,
            arrivalDate: formatDateForApi(bookingData.startDate),
            departureDate: formatDateForApi(bookingData.endDate),
            numberOfGuests:
              bookingData.guests.adults +
              bookingData.guests.children +
              bookingData.guests.infants,
            adults: bookingData.guests.adults,
            children: bookingData.guests.children || null,
            infants: bookingData.guests.infants || null,
            totalPrice: bookingData.totalPrice,
            paymentIntentId: paymentIntentId ?? paymentIntent.id,
            propertyName: bookingData.propertyName ?? undefined,
              locale,
          }),
        },
      );

      const reservationData = (await reservationResponse.json()) as {
        success?: boolean;
        reservationId?: number;
        error?: string;
        details?: string;
      };

      if (!reservationResponse.ok || !reservationData.success) {
        setStripeError(
          reservationData.error ??
            "Error al crear la reservación. Tu pago fue procesado, contacta soporte.",
        );
        return;
      }

      // 3. Save reservation info and redirect to success
      sessionStorage.setItem(
        "reservationResult",
        JSON.stringify({
          reservationId: reservationData.reservationId,
          paymentIntentId: paymentIntent.id,
        }),
      );

      // 4. Send billing request email if requested
      if (addBillingData) {
        try {
          await fetch("/api/billing/send-invoice-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              billing: billingData,
              guest: {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phone: values.phone,
              },
              reservation: {
                propertyName: bookingData.propertyName ?? "Propiedad Kanaa",
                arrivalDate: formatDateForApi(bookingData.startDate),
                departureDate: formatDateForApi(bookingData.endDate),
                totalNights: bookingData.totalNights,
                totalPrice: bookingData.totalPrice,
                guests: bookingData.guests,
                reservationId: reservationData.reservationId,
              },
            }),
          });
        } catch {
          // Non-blocking — reservation already confirmed
        }
      }

      window.location.href = `/${window.location.pathname.split("/")[1]}/booking-success/${bookingData.listingMapId}?payment_intent=${paymentIntent.id}&reservation_id=${reservationData.reservationId}`;
    } catch (err) {
      setStripeError(
        err instanceof Error
          ? err.message
          : "Error inesperado al procesar el pago",
      );
      console.error("Error en checkout:", err);
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
                          placeholder="Nombre"
                          labelSize="base"
                          labelWeight="bold"
                          labelClassName="text-green-darker leading-5"
                          className="font-gilroy text-green-darker text-base leading-4.75 font-medium placeholder-[#6a6a6acd] transition-colors duration-150"
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
                          placeholder="Apellidos"
                          labelSize="base"
                          labelWeight="bold"
                          labelClassName="text-green-darker leading-5"
                          className="font-gilroy text-green-darker text-base leading-4.75 font-medium placeholder-[#6a6a6acd] transition-colors duration-150"
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
                          placeholder="correo@ejemplo.com"
                          labelSize="base"
                          labelWeight="bold"
                          labelClassName="text-green-darker leading-5"
                          className="font-gilroy text-green-darker text-base leading-4.75 font-medium placeholder-[#6a6a6acd] transition-colors duration-150"
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
                          placeholder="correo@ejemplo.com"
                          labelSize="base"
                          labelWeight="bold"
                          labelClassName="text-green-darker leading-5"
                          className="font-gilroy text-green-darker text-base leading-4.75 font-medium placeholder-[#6a6a6acd] transition-colors duration-150"
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

                <div>
                  <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                    <Text
                      font="gilroy"
                      size="base"
                      weight="bold"
                      className="text-green-darker leading-5"
                    >
                      {locale === "en" ? "Country of residence" : "País de residencia"}
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
                            {locale === "en" ? "Select a country" : "Selecciona un país"}
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
                onChange={(e) => {
                  onAddBillingDataChange(e.target.checked);
                  if (!e.target.checked) onBillingTouchedChange({});
                }}
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
              {locale === "en" ? "Add your billing information" : "Añadir tus datos para facturación"}
            </Text>
          </label>

          {addBillingData && (
            <section>
              <Text
                font="gilroy"
                size="xl"
                weight="bold"
                className="text-green-normal mb-4"
              >
                {locale === "en" ? "Billing information" : "Datos de facturación"}
              </Text>
              <div className="border-grey-normal rounded-2xl border bg-white p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* RFC */}
                  <div>
                    <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className="text-green-darker leading-5"
                      >
                        RFC
                      </Text>
                      <input
                        type="text"
                        value={billingData.rfc}
                        onChange={(e) =>
                          onBillingDataChange({
                            ...billingData,
                            rfc: e.target.value.toUpperCase(),
                          })
                        }
                        onBlur={() =>
                          onBillingTouchedChange({
                            ...billingTouched,
                            rfc: true,
                          })
                        }
                        placeholder="XAXX010101000"
                        maxLength={13}
                        className="font-gilroy text-green-darker w-full bg-transparent text-base font-medium placeholder-[#6a6a6acd] outline-none"
                      />
                    </div>
                    {billingTouched.rfc && billingErrors.rfc && (
                      <Text
                        font="gilroy"
                        size="xs"
                        className="mt-1 ml-1 text-red-500"
                      >
                        {billingErrors.rfc}
                      </Text>
                    )}
                  </div>

                  {/* Razón social */}
                  <div>
                    <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className="text-green-darker leading-5"
                      >
                        {locale === "en" ? "Full name or company name" : "Nombre completo o razón social"}
                      </Text>
                      <input
                        type="text"
                        value={billingData.razonSocial}
                        onChange={(e) =>
                          onBillingDataChange({
                            ...billingData,
                            razonSocial: e.target.value,
                          })
                        }
                        onBlur={() =>
                          onBillingTouchedChange({
                            ...billingTouched,
                            razonSocial: true,
                          })
                        }
                        placeholder="Kanaa S.A. de C.V."
                        className="font-gilroy text-green-darker w-full bg-transparent text-base font-medium placeholder-[#6a6a6acd] outline-none"
                      />
                    </div>
                    {billingTouched.razonSocial &&
                      billingErrors.razonSocial && (
                        <Text
                          font="gilroy"
                          size="xs"
                          className="mt-1 ml-1 text-red-500"
                        >
                          {billingErrors.razonSocial}
                        </Text>
                      )}
                  </div>

                  {/* Régimen fiscal */}
                  <div>
                    <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className="text-green-darker leading-5"
                      >
                        {locale === "en" ? "Tax Regime" : "Régimen Fiscal"}
                      </Text>
                      <select
                        value={billingData.regimenFiscal}
                        onChange={(e) =>
                          onBillingDataChange({
                            ...billingData,
                            regimenFiscal: e.target.value,
                          })
                        }
                        onBlur={() =>
                          onBillingTouchedChange({
                            ...billingTouched,
                            regimenFiscal: true,
                          })
                        }
                        className="font-gilroy text-green-darker w-full appearance-none bg-transparent text-base font-medium outline-none"
                      >
                        <option value="" disabled>
                          {locale === "en" ? "Select a regime" : "Selecciona un régimen"}
                        </option>
                        <option value="601">
                          601 - General de Ley Personas Morales
                        </option>
                        <option value="603">
                          603 - Personas Morales con Fines no Lucrativos
                        </option>
                        <option value="605">
                          605 - Sueldos y Salarios e Ingresos Asimilados
                        </option>
                        <option value="606">606 - Arrendamiento</option>
                        <option value="612">
                          612 - Personas Físicas con Actividades Empresariales
                        </option>
                        <option value="616">
                          616 - Sin obligaciones fiscales
                        </option>
                        <option value="621">
                          621 - Régimen de Incorporación Fiscal
                        </option>
                        <option value="625">
                          625 - Ingresos a través de Plataformas Tecnológicas
                        </option>
                        <option value="626">
                          626 - Régimen Simplificado de Confianza (RESICO)
                        </option>
                      </select>
                    </div>
                    {billingTouched.regimenFiscal &&
                      billingErrors.regimenFiscal && (
                        <Text
                          font="gilroy"
                          size="xs"
                          className="mt-1 ml-1 text-red-500"
                        >
                          {billingErrors.regimenFiscal}
                        </Text>
                      )}
                  </div>

                  {/* Código postal */}
                  <div>
                    <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className="text-green-darker leading-5"
                      >
                        {locale === "en" ? "Address zip code" : "Código postal del domicilio"}
                      </Text>
                      <input
                        type="text"
                        value={billingData.codigoPostal}
                        onChange={(e) =>
                          onBillingDataChange({
                            ...billingData,
                            codigoPostal: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 5),
                          })
                        }
                        onBlur={() =>
                          onBillingTouchedChange({
                            ...billingTouched,
                            codigoPostal: true,
                          })
                        }
                        placeholder="06600"
                        maxLength={5}
                        className="font-gilroy text-green-darker w-full bg-transparent text-base font-medium placeholder-[#6a6a6acd] outline-none"
                      />
                    </div>
                    {billingTouched.codigoPostal &&
                      billingErrors.codigoPostal && (
                        <Text
                          font="gilroy"
                          size="xs"
                          className="mt-1 ml-1 text-red-500"
                        >
                          {billingErrors.codigoPostal}
                        </Text>
                      )}
                  </div>

                  {/* Uso de CFDI */}
                  <div>
                    <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className="text-green-darker leading-5"
                      >
                        {locale === "en" ? "CFDI Use" : "Uso de CFDI"}
                      </Text>
                      <select
                        value={billingData.usoCFDI}
                        onChange={(e) =>
                          onBillingDataChange({
                            ...billingData,
                            usoCFDI: e.target.value,
                          })
                        }
                        onBlur={() =>
                          onBillingTouchedChange({
                            ...billingTouched,
                            usoCFDI: true,
                          })
                        }
                        className="font-gilroy text-green-darker w-full appearance-none bg-transparent text-base font-medium outline-none"
                      >
                        <option value="" disabled>
                          {locale === "en" ? "Select a use" : "Selecciona un uso"}
                        </option>
                        <option value="G01">
                          G01 - Adquisición de mercancias
                        </option>
                        <option value="G03">G03 - Gastos en general</option>
                        <option value="I01">I01 - Construcciones</option>
                        <option value="D05">
                          D05 - Intereses reales por créditos hipotecarios
                        </option>
                        <option value="S01">S01 - Sin efectos fiscales</option>
                        <option value="CP01">CP01 - Pagos</option>
                        <option value="CN01">CN01 - Nómina</option>
                      </select>
                    </div>
                    {billingTouched.usoCFDI && billingErrors.usoCFDI && (
                      <Text
                        font="gilroy"
                        size="xs"
                        className="mt-1 ml-1 text-red-500"
                      >
                        {billingErrors.usoCFDI}
                      </Text>
                    )}
                  </div>

                  {/* Dirección de facturación */}
                  <div>
                    <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className="text-green-darker leading-5"
                      >
                        {locale === "en" ? "Billing address" : "Dirección de facturación"}
                      </Text>
                      <input
                        type="text"
                        value={billingData.direccion}
                        onChange={(e) =>
                          onBillingDataChange({
                            ...billingData,
                            direccion: e.target.value,
                          })
                        }
                        onBlur={() =>
                          onBillingTouchedChange({
                            ...billingTouched,
                            direccion: true,
                          })
                        }
                        placeholder={locale === "en" ? "Street, number, neighborhood, city" : "Calle, número, colonia, ciudad"}
                        className="font-gilroy text-green-darker w-full bg-transparent text-base font-medium placeholder-[#6a6a6acd] outline-none"
                      />
                    </div>
                    {billingTouched.direccion && billingErrors.direccion && (
                      <Text
                        font="gilroy"
                        size="xs"
                        className="mt-1 ml-1 text-red-500"
                      >
                        {billingErrors.direccion}
                      </Text>
                    )}
                  </div>

                  {/* Correo de facturación */}
                  <div className="sm:col-span-2">
                    <div className="border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2">
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className="text-green-darker leading-5"
                      >
                        {locale === "en" ? "Email to receive PDF and XML" : "Correo electrónico para recibir PDF y XML"}
                      </Text>
                      <input
                        type="email"
                        value={billingData.emailFacturacion}
                        onChange={(e) =>
                          onBillingDataChange({
                            ...billingData,
                            emailFacturacion: e.target.value,
                          })
                        }
                        onBlur={() =>
                          onBillingTouchedChange({
                            ...billingTouched,
                            emailFacturacion: true,
                          })
                        }
                        placeholder="facturacion@empresa.com"
                        className="font-gilroy text-green-darker w-full bg-transparent text-base font-medium placeholder-[#6a6a6acd] outline-none"
                      />
                    </div>
                    {billingTouched.emailFacturacion &&
                      billingErrors.emailFacturacion && (
                        <Text
                          font="gilroy"
                          size="xs"
                          className="mt-1 ml-1 text-red-500"
                        >
                          {billingErrors.emailFacturacion}
                        </Text>
                      )}
                  </div>
                </div>
              </div>
            </section>
          )}

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
                      {t("Acepto los")}{" "}
                      <a
                        href={`/${locale}/terms-and-conditions`}
                        className="text-gold-normal underline"
                        target="_blank"
                      >
                        {t("términos y condiciones")}
                      </a>
                      {" "}{t("y la política de cancelación")}
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
          </section>

          {stripeError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <Text font="gilroy" size="sm" className="text-red-700">
                {stripeError}
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
            priceBreakdown={priceBreakdown}
            isPriceLoading={isPriceLoading}
          />
        </div>
      </div>
    </form>
  );
};
