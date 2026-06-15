"use client";

import { ArrowRight, FileText, Search, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CircleButton, Text } from "@/components/atoms";
import { Button, Input, PhoneInput } from "@/components/molecules";
import { useI18n } from "@/i18n";

type ReservationData = {
  id: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  phone: string | null;
  arrivalDate: string;
  departureDate: string;
  totalPrice: number;
  currency: string;
  adults: number;
  children: number | null;
  infants: number | null;
  propertyName: string | null;
  propertyImage: string | null;
  propertyCity: string | null;
};

type BillingData = {
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  codigoPostal: string;
  usoCFDI: string;
  direccion: string;
  emailFacturacion: string;
};

const EMPTY_BILLING: BillingData = {
  rfc: "",
  razonSocial: "",
  regimenFiscal: "",
  codigoPostal: "",
  usoCFDI: "",
  direccion: "",
  emailFacturacion: "",
};

const formatDate = (dateStr: string) =>
  new Date(dateStr + "T12:00:00").toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatPrice = (amount: number, currency = "MXN") =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(
    amount,
  );

const nightsBetween = (arrival: string, departure: string) =>
  Math.max(
    1,
    Math.round(
      (new Date(departure + "T12:00:00").getTime() -
        new Date(arrival + "T12:00:00").getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

const fieldBox =
  "border-grey-normal flex h-16.5 flex-col justify-center rounded-xl border bg-white px-4 py-2";
const inputCls =
  "font-gilroy text-green-darker w-full bg-transparent text-base font-medium placeholder-[#6a6a6acd] outline-none";
const selectCls =
  "font-gilroy text-green-darker w-full appearance-none bg-transparent text-base font-medium outline-none";
const labelCls = "text-green-darker leading-5";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text font="gilroy" size="xs" className="mt-1 ml-1 text-red-500">
      {message}
    </Text>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text
      font="gilroy"
      size="xl"
      weight="bold"
      className="text-green-normal mb-4"
    >
      {children}
    </Text>
  );
}

function LookupStep({
  onFound,
}: {
  onFound: (reservation: ReservationData) => void;
}) {
  const [reservationId, setReservationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Accept Hostaway's internal numeric id OR a channel reservation code
    // (Airbnb's "HMJ3SXMCDX", Booking codes, etc.). The backend decides
    // how to query Hostaway based on the shape of the value.
    const id = reservationId.replace("#", "").trim();
    if (!id) {
      setError("Ingresa un número de reservación válido");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/hostaway/reservations/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: id }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        reservation?: ReservationData;
        error?: string;
      };

      if (!res.ok || !data.success || !data.reservation) {
        setError(data.error ?? "No se pudo encontrar la reservación");
        return;
      }

      onFound(data.reservation);
    } catch {
      setError("Error inesperado al buscar la reservación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-15 flex min-h-screen items-center bg-[#F2F0EA] p-5">
      <section className="mx-auto max-w-xl rounded-2xl bg-white px-8 pt-28 pb-16 md:px-16 md:pt-36">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-32.5 w-32.5 items-center justify-center rounded-full bg-[#EDEEEC]">
            <FileText className="text-green-normal h-15 w-15" strokeWidth={2} />
          </div>
          <Text
            as="h1"
            size="4xl"
            weight="medium"
            className="text-green-normal"
          >
            Solicitud de factura
          </Text>
          <Text font="gilroy" size="lg" className="text-green-normal">
            Ingresa tu número de reserva para continuar con tu solicitud de
            facturación.
          </Text>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <Input
              label="Número de reservación"
              labelSize="base"
              labelWeight="bold"
              labelClassName="text-green-darker leading-5"
              value={reservationId}
              onChange={setReservationId}
              placeholder="Ej: 12345678 o HMXXXXXXXX"
              className="border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3">
              <Text font="gilroy" size="sm" className="text-red-700">
                {error}
              </Text>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="bg-green-normal! mt-4 h-14.5 w-full justify-center"
            textWeight="medium"
            textClassName="text-white"
            disabled={isLoading}
            icon={
              isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <CircleButton className="bg-green-dark-active!">
                  <Search className="h-5 w-5 text-white" />
                </CircleButton>
              )
            }
          >
            {isLoading ? "Buscando..." : "Buscar reservación"}
          </Button>
        </form>
      </section>
    </div>
  );
}

function getBillingErrors(data: BillingData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.rfc.trim()) errors.rfc = "RFC requerido";
  if (!data.razonSocial.trim())
    errors.razonSocial = "Nombre o razón social requerido";
  if (!data.regimenFiscal.trim())
    errors.regimenFiscal = "Régimen fiscal requerido";
  if (!data.codigoPostal.trim())
    errors.codigoPostal = "Código postal requerido";
  if (!data.usoCFDI.trim()) errors.usoCFDI = "Uso de CFDI requerido";
  if (!data.direccion.trim()) errors.direccion = "Dirección requerida";
  if (!data.emailFacturacion.trim()) {
    errors.emailFacturacion = "Correo de facturación requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailFacturacion)) {
    errors.emailFacturacion = "Correo electrónico inválido";
  }
  return errors;
}

function BillingFormStep({
  reservation,
  onBack,
  onSuccess,
}: {
  reservation: ReservationData;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [billing, setBilling] = useState<BillingData>(EMPTY_BILLING);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = getBillingErrors(billing);
  const nights = nightsBetween(
    reservation.arrivalDate,
    reservation.departureDate,
  );
  const totalGuests =
    reservation.adults +
    (reservation.children ?? 0) +
    (reservation.infants ?? 0);

  const touch = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.fromEntries(
      Object.keys(billing).map((k) => [k, true]),
    );
    setTouched(allTouched);

    if (Object.keys(getBillingErrors(billing)).length > 0) return;

    setIsLoading(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/billing/send-invoice-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing,
          guest: {
            firstName: reservation.guestFirstName,
            lastName: reservation.guestLastName,
            email: reservation.guestEmail,
            phone: reservation.phone ?? "",
          },
          reservation: {
            reservationId: reservation.id,
            propertyName: reservation.propertyName ?? "Propiedad Kanaa",
            arrivalDate: reservation.arrivalDate,
            departureDate: reservation.departureDate,
            totalNights: nights,
            totalPrice: reservation.totalPrice,
            guests: {
              adults: reservation.adults,
              children: reservation.children ?? 0,
              infants: reservation.infants ?? 0,
            },
          },
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setSubmitError(data.error ?? "Error al enviar la solicitud");
        return;
      }

      onSuccess();
    } catch {
      setSubmitError("Error inesperado. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0EA] p-5">
      <section className="rounded-2xl bg-white px-8 pt-14 pb-16 md:px-16 md:pt-20">
        <div className="mb-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-[#7C7356] hover:underline"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Buscar otra reservación
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <Text
            as="h1"
            size="3xl"
            weight="medium"
            className="text-green-normal"
          >
            Datos de facturación
          </Text>
          <Text font="gilroy" size="base" className="text-green-normal">
            Reservación #{reservation.id} —{" "}
            {reservation.propertyName ?? "Propiedad Kanaa"}
          </Text>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_480px]"
        >
          {/* ── Left: billing fields ── */}
          <div className="space-y-8">
            {/* Guest info (read-only) */}
            <section>
              <SectionTitle>Datos del huésped</SectionTitle>
              <div className="border-grey-normal rounded-2xl border bg-white p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className={fieldBox}>
                    <Input
                      label="Nombre (s)"
                      value={reservation.guestFirstName}
                      labelSize="base"
                      labelWeight="bold"
                      labelClassName={labelCls}
                      nonEditable
                    />
                  </div>
                  <div className={fieldBox}>
                    <Input
                      label="Apellidos"
                      value={reservation.guestLastName}
                      labelSize="base"
                      labelWeight="bold"
                      labelClassName={labelCls}
                      nonEditable
                    />
                  </div>
                  <div className={fieldBox}>
                    <Input
                      label="Correo electrónico"
                      value={reservation.guestEmail}
                      labelSize="base"
                      labelWeight="bold"
                      labelClassName={labelCls}
                      nonEditable
                    />
                  </div>
                  <div className={fieldBox}>
                    <PhoneInput
                      label="Número de teléfono"
                      value={reservation.phone ?? ""}
                      nonEditable
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Fiscal fields */}
            <section>
              <SectionTitle>Datos fiscales</SectionTitle>
              <div className="border-grey-normal rounded-2xl border bg-white p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* RFC */}
                  <div>
                    <div className={fieldBox}>
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className={labelCls}
                      >
                        RFC
                      </Text>
                      <input
                        type="text"
                        value={billing.rfc}
                        onChange={(e) =>
                          setBilling((p) => ({
                            ...p,
                            rfc: e.target.value.toUpperCase(),
                          }))
                        }
                        onBlur={() => touch("rfc")}
                        placeholder="XAXX010101000"
                        maxLength={13}
                        className={inputCls}
                      />
                    </div>
                    {touched.rfc && <FieldError message={errors.rfc} />}
                  </div>

                  {/* Razón social */}
                  <div>
                    <div className={fieldBox}>
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className={labelCls}
                      >
                        Nombre completo o razón social
                      </Text>
                      <input
                        type="text"
                        value={billing.razonSocial}
                        onChange={(e) =>
                          setBilling((p) => ({
                            ...p,
                            razonSocial: e.target.value,
                          }))
                        }
                        onBlur={() => touch("razonSocial")}
                        placeholder="Kanaa S.A. de C.V."
                        className={inputCls}
                      />
                    </div>
                    {touched.razonSocial && (
                      <FieldError message={errors.razonSocial} />
                    )}
                  </div>

                  {/* Régimen fiscal */}
                  <div>
                    <div className={fieldBox}>
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className={labelCls}
                      >
                        Régimen Fiscal
                      </Text>
                      <select
                        value={billing.regimenFiscal}
                        onChange={(e) =>
                          setBilling((p) => ({
                            ...p,
                            regimenFiscal: e.target.value,
                          }))
                        }
                        onBlur={() => touch("regimenFiscal")}
                        className={selectCls}
                      >
                        <option value="" disabled>
                          Selecciona un régimen
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
                    {touched.regimenFiscal && (
                      <FieldError message={errors.regimenFiscal} />
                    )}
                  </div>

                  {/* Código postal */}
                  <div>
                    <div className={fieldBox}>
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className={labelCls}
                      >
                        Código postal del domicilio
                      </Text>
                      <input
                        type="text"
                        value={billing.codigoPostal}
                        onChange={(e) =>
                          setBilling((p) => ({
                            ...p,
                            codigoPostal: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 5),
                          }))
                        }
                        onBlur={() => touch("codigoPostal")}
                        placeholder="06600"
                        maxLength={5}
                        className={inputCls}
                      />
                    </div>
                    {touched.codigoPostal && (
                      <FieldError message={errors.codigoPostal} />
                    )}
                  </div>

                  {/* Uso CFDI */}
                  <div>
                    <div className={fieldBox}>
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className={labelCls}
                      >
                        Uso de CFDI
                      </Text>
                      <select
                        value={billing.usoCFDI}
                        onChange={(e) =>
                          setBilling((p) => ({ ...p, usoCFDI: e.target.value }))
                        }
                        onBlur={() => touch("usoCFDI")}
                        className={selectCls}
                      >
                        <option value="" disabled>
                          Selecciona un uso
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
                    {touched.usoCFDI && <FieldError message={errors.usoCFDI} />}
                  </div>

                  {/* Dirección */}
                  <div>
                    <div className={fieldBox}>
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className={labelCls}
                      >
                        Dirección de facturación
                      </Text>
                      <input
                        type="text"
                        value={billing.direccion}
                        onChange={(e) =>
                          setBilling((p) => ({
                            ...p,
                            direccion: e.target.value,
                          }))
                        }
                        onBlur={() => touch("direccion")}
                        placeholder="Calle, número, colonia, ciudad"
                        className={inputCls}
                      />
                    </div>
                    {touched.direccion && (
                      <FieldError message={errors.direccion} />
                    )}
                  </div>

                  {/* Correo facturación */}
                  <div className="sm:col-span-2">
                    <div className={fieldBox}>
                      <Text
                        font="gilroy"
                        size="base"
                        weight="bold"
                        className={labelCls}
                      >
                        Correo electrónico para recibir PDF y XML
                      </Text>
                      <input
                        type="email"
                        value={billing.emailFacturacion}
                        onChange={(e) =>
                          setBilling((p) => ({
                            ...p,
                            emailFacturacion: e.target.value,
                          }))
                        }
                        onBlur={() => touch("emailFacturacion")}
                        placeholder="facturacion@empresa.com"
                        className={inputCls}
                      />
                    </div>
                    {touched.emailFacturacion && (
                      <FieldError message={errors.emailFacturacion} />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <Text font="gilroy" size="sm" className="text-red-700">
                  {submitError}
                </Text>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
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
              {isLoading
                ? "Enviando solicitud..."
                : "Enviar solicitud de factura"}
            </Button>
          </div>

          {/* ── Right: reservation summary ── */}
          <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
            <div className="border-grey-normal rounded-2xl border bg-white p-5">
              <div className="flex gap-5">
                {reservation.propertyImage ? (
                  <div className="relative h-38 w-38 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={reservation.propertyImage}
                      alt={reservation.propertyName ?? "Propiedad"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-grey-light h-38 w-38 shrink-0 rounded-xl" />
                )}
                <div className="flex flex-col gap-1.5">
                  <Text
                    font="gilroy"
                    size="lg"
                    weight="medium"
                    className="text-green-darker leading-snug"
                  >
                    {reservation.propertyName ?? "Propiedad Kanaa"}
                  </Text>
                  {reservation.propertyCity && (
                    <Text
                      font="gilroy"
                      size="base"
                      className="text-grey-darker"
                    >
                      {reservation.propertyCity}, México
                    </Text>
                  )}
                  <Text
                    font="gilroy"
                    size="base"
                    weight="bold"
                    className="text-green-darker mt-1"
                  >
                    {formatPrice(reservation.totalPrice, reservation.currency)}
                  </Text>
                </div>
              </div>
            </div>

            <div className="border-grey-normal flex items-center justify-between rounded-[10px] border bg-white px-5 py-4">
              <div>
                <Text
                  font="gilroy"
                  size="base"
                  weight="bold"
                  className="text-green-darker"
                >
                  Fechas
                </Text>
                <Text
                  font="gilroy"
                  size="sm"
                  className="text-grey-darker mt-0.5"
                >
                  {formatDate(reservation.arrivalDate)} –{" "}
                  {formatDate(reservation.departureDate)}
                </Text>
              </div>
            </div>

            <div className="border-grey-normal flex items-center justify-between rounded-[10px] border bg-white px-5 py-4">
              <div>
                <Text
                  font="gilroy"
                  size="base"
                  weight="bold"
                  className="text-green-darker"
                >
                  Huéspedes
                </Text>
                <Text
                  font="gilroy"
                  size="sm"
                  className="text-grey-darker mt-0.5"
                >
                  {totalGuests} {totalGuests === 1 ? "huésped" : "huéspedes"}
                </Text>
              </div>
            </div>

            <div className="border-grey-normal flex items-center justify-between rounded-[10px] border bg-white px-5 py-4">
              <div>
                <Text
                  font="gilroy"
                  size="base"
                  weight="bold"
                  className="text-green-darker"
                >
                  Noches
                </Text>
                <Text
                  font="gilroy"
                  size="sm"
                  className="text-grey-darker mt-0.5"
                >
                  {nights} {nights === 1 ? "noche" : "noches"}
                </Text>
              </div>
            </div>

            <div className="border-grey-normal rounded-[10px] border bg-white px-5 py-4">
              <div className="flex items-center justify-between">
                <Text
                  font="gilroy"
                  size="base"
                  weight="bold"
                  className="text-green-darker"
                >
                  Total pagado
                </Text>
                <Text
                  font="gilroy"
                  size="base"
                  weight="bold"
                  className="text-green-normal"
                >
                  {formatPrice(reservation.totalPrice, reservation.currency)}
                </Text>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function SuccessStep({ locale }: { locale: string }) {
  return (
    <div className="min-h-screen bg-[#F2F0EA] p-5">
      <section className="rounded-2xl bg-white px-8 pt-36 pb-16 md:px-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-32.5 w-32.5 items-center justify-center rounded-full bg-[#EDEEEC]">
            <ShieldCheck
              className="text-green-normal h-15 w-15"
              strokeWidth={2}
            />
          </div>
          <Text
            as="h1"
            size="4xl"
            weight="medium"
            className="text-green-normal"
          >
            ¡Solicitud enviada!
          </Text>
          <Text font="gilroy" size="lg" className="text-green-normal max-w-lg">
            Recibimos tus datos fiscales. Nuestro equipo de contabilidad
            procesará tu factura y la enviará al correo que indicaste.
          </Text>
        </div>

        <div className="mx-auto mt-10 max-w-sm">
          <Link href={`/${locale}`}>
            <Button
              type="button"
              variant="primary"
              className="h-14.5 w-full justify-center"
              textWeight="bold"
              textClassName="text-gold-dark"
              icon={
                <CircleButton className="bg-white!">
                  <ArrowRight className="text-gold-normal-hover h-6 w-6 drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
              }
            >
              Volver al inicio
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function FacturacionPage() {
  const { locale } = useI18n();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) return <SuccessStep locale={locale} />;

  if (reservation)
    return (
      <BillingFormStep
        reservation={reservation}
        onBack={() => setReservation(null)}
        onSuccess={() => setIsSuccess(true)}
      />
    );

  return <LookupStep onFound={setReservation} />;
}
