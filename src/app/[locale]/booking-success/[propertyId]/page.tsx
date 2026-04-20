"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { CircleButton, Text } from "@/components/atoms";
import { Button, Input, PhoneInput } from "@/components/molecules";

import type { BookingData } from "@/components/molecules";

type GuestData = {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  country: string;
};

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (amount: number) =>
  `$${new Intl.NumberFormat("es-MX").format(amount)} MXN`;

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-grey-normal flex items-center justify-between rounded-[10px] border bg-white px-5 py-4">
      <div>
        <Text
          font="gilroy"
          size="base"
          weight="bold"
          className="text-green-darker"
        >
          {label}
        </Text>
        <Text font="gilroy" size="sm" className="text-grey-darker mt-0.5">
          {value}
        </Text>
      </div>
    </div>
  );
}

function BookingSuccessInner() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent") ?? "";
  const reservationId = searchParams.get("reservation_id") ?? "";
  const bookingNumber = reservationId
    ? `#${reservationId}`
    : paymentIntentId
      ? `#${paymentIntentId.slice(-8).toUpperCase()}`
      : "#—";

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [guestData, setGuestData] = useState<GuestData>({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    country: "",
  });
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const handleCancelReservation = async () => {
    if (!reservationId) return;

    const confirmed = window.confirm(
      "¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.",
    );
    if (!confirmed) return;

    setIsCancelling(true);
    setCancelError("");

    try {
      const response = await fetch("/api/hostaway/reservations/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: Number(reservationId),
          paymentIntentId: paymentIntentId || undefined,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
        details?: string;
      };

      if (!response.ok || !data.success) {
        setCancelError(
          data.error ?? "Error al cancelar la reservación",
        );
        return;
      }

      setIsCancelled(true);
      sessionStorage.removeItem("bookingData");
      sessionStorage.removeItem("guestData");
      sessionStorage.removeItem("reservationResult");
    } catch {
      setCancelError("Error inesperado al cancelar la reservación");
    } finally {
      setIsCancelling(false);
    }
  };

  useEffect(() => {
    setPaymentDate(new Date().toLocaleString("es-MX"));
    const raw = sessionStorage.getItem("bookingData");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as BookingData;
        setBookingData({
          ...parsed,
          startDate: parsed.startDate ? new Date(parsed.startDate) : null,
          endDate: parsed.endDate ? new Date(parsed.endDate) : null,
        });
      } catch {}
    }
    const guestRaw = sessionStorage.getItem("guestData");
    if (guestRaw) {
      try {
        setGuestData(JSON.parse(guestRaw) as GuestData);
      } catch {}
    }
  }, []);

  const totalGuests = bookingData
    ? bookingData.guests.adults + bookingData.guests.children
    : 0;

  return (
    <div className="min-h-screen bg-[#F2F0EA] p-5">
      <section className="rounded-2xl bg-white px-16 pt-36 pb-16">
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
            className={
              isCancelled ? "text-red-600" : "text-green-normal"
            }
          >
            {isCancelled
              ? "Reserva cancelada"
              : "¡Reserva confirmada!"}
          </Text>

          <div className="flex items-center gap-2">
            <Text font="gilroy" size="2xl" className="text-green-normal">
              Número de la reserva:
            </Text>
            <Text
              font="gilroy"
              size="2xl"
              weight="bold"
              className="text-green-normal"
            >
              {bookingNumber}
            </Text>
          </div>

          <Text
            font="gilroy"
            size="lg"
            className="text-green-normal"
          >
            Hemos enviado los detalles de tu reserva a{" "}
            <span className="font-bold">
              {guestData.email || "tu correo"}
            </span>
          </Text>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_480px]">
          <div className="space-y-5">
            <div className="border-grey-normal rounded-2xl border bg-white p-8">
              <Text
                font="gilroy"
                size="xl"
                weight="bold"
                className="text-green-normal mb-4"
              >
                Información personal
              </Text>

              <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <Input
                  label="Nombre (s)"
                  value={guestData.firstName}
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable
                />
                <Input
                  label="Apellidos"
                  value={guestData.lastName}
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable
                />
                <Input
                  label="Correo electrónico"
                  value={guestData.email}
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable
                />
                <Input
                  label="Confirma tu correo electrónico"
                  value={guestData.confirmEmail}
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable
                />
                <PhoneInput
                  label="Número de teléfono"
                  value={guestData.phone}
                  nonEditable
                />
                <Input
                  label="País de residencia"
                  value={guestData.country}
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable
                />
              </div>
            </div>

            <div className="border-grey-normal rounded-2xl border bg-white p-8">
              <Text
                font="gilroy"
                size="xl"
                weight="medium"
                className="text-green-normal mb-5"
              >
                Información del pago
              </Text>

              <div className="flex gap-12">
                <div className="flex-1 space-y-3">
                  {bookingData && (
                    <div className="flex items-center justify-between">
                      <Text
                        font="gilroy"
                        size="base"
                        className="text-green-darker"
                      >
                        Reserva por {bookingData.totalNights}{" "}
                        {bookingData.totalNights === 1 ? "día" : "días"}
                      </Text>
                      <Text
                        font="gilroy"
                        size="base"
                        weight="medium"
                        className="text-green-darker"
                      >
                        {formatPrice(bookingData.totalPrice)}
                      </Text>
                    </div>
                  )}
                  <div className="bg-grey-normal h-px w-full" />
                  <div className="flex items-center justify-between">
                    <Text
                      font="gilroy"
                      size="base"
                      weight="bold"
                      className="text-green-darker"
                    >
                      Total
                    </Text>
                    <Text
                      font="gilroy"
                      size="base"
                      weight="bold"
                      className="text-green-normal"
                    >
                      {bookingData ? formatPrice(bookingData.totalPrice) : "—"}
                    </Text>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <Text font="gilroy" size="sm" className="text-grey-darker">
                      Fecha
                    </Text>
                    <Text
                      font="gilroy"
                      size="sm"
                      weight="medium"
                      className="text-green-darker"
                    >
                      {paymentDate || "—"}
                    </Text>
                  </div>
                  <div>
                    <Text font="gilroy" size="sm" className="text-grey-darker">
                      Método de pago
                    </Text>
                    <div className="flex items-center gap-2">
                      <Text
                        font="gilroy"
                        size="sm"
                        weight="medium"
                        className="text-green-darker"
                      >
                        ****{paymentIntentId.slice(-4) || "····"}
                      </Text>
                      <span className="rounded bg-[#0457A0] px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
                        VISA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Text font="gilroy" size="xs" className="mt-5 text-[#4C4D4C]">
                Política de cancelación — 100% reembolsable hasta 14 días antes
                de la llegada — 50% reembolsable hasta 7 días antes de la
                llegada
              </Text>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border-grey-normal rounded-2xl border bg-white p-5">
              <div className="flex gap-5">
                {bookingData?.propertyImage ? (
                  <div className="relative h-38 w-38 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={bookingData.propertyImage}
                      alt={bookingData.propertyName ?? "Propiedad"}
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
                    {bookingData?.propertyName ?? "Propiedad"}
                  </Text>
                  {bookingData?.propertyCity && (
                    <Text
                      font="gilroy"
                      size="base"
                      className="text-grey-darker"
                    >
                      {bookingData.propertyCity}, México
                    </Text>
                  )}
                  {bookingData?.propertyRating !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-[#A59973]">★</span>
                      <Text
                        font="gilroy"
                        size="sm"
                        weight="medium"
                        className="text-green-darker"
                      >
                        {bookingData.propertyRating.toFixed(2)}
                      </Text>
                    </div>
                  )}
                  {bookingData && (
                    <Text
                      font="gilroy"
                      size="base"
                      weight="bold"
                      className="text-green-darker mt-1"
                    >
                      {formatPrice(bookingData.totalPrice)}
                    </Text>
                  )}
                </div>
              </div>
            </div>

            <InfoRow
              label="Fechas"
              value={
                bookingData
                  ? `${formatDate(bookingData.startDate)} – ${formatDate(bookingData.endDate)}`
                  : "—"
              }
            />
            <InfoRow
              label="Huéspedes"
              value={
                totalGuests
                  ? `${totalGuests} ${totalGuests === 1 ? "Adulto" : "Adultos"}`
                  : "—"
              }
            />
            <div className="border-grey-normal flex items-center justify-between rounded-[10px] border bg-white px-5 py-4">
              <div>
                <Text
                  font="gilroy"
                  size="base"
                  weight="bold"
                  className="text-green-darker"
                >
                  Detalle del precio
                </Text>
                {bookingData && (
                  <Text
                    font="gilroy"
                    size="sm"
                    className="text-grey-darker mt-0.5"
                  >
                    {bookingData.totalNights}{" "}
                    {bookingData.totalNights === 1 ? "noche" : "noches"} ×{" "}
                    {formatPrice(bookingData.pricePerNight ?? 0)}
                  </Text>
                )}
              </div>
              <Text
                font="gilroy"
                size="base"
                weight="bold"
                className="text-green-darker"
              >
                {bookingData ? formatPrice(bookingData.totalPrice) : "—"}
              </Text>
            </div>

            {cancelError && (
              <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <Text font="gilroy" size="sm" className="text-red-700">
                  {cancelError}
                </Text>
              </div>
            )}

            <Button
              type="button"
              variant="secondary"
              className="mt-2 h-14.5 w-full justify-center"
              textWeight="medium"
              textClassName={isCancelled ? "text-gray-400" : "text-[#7C7356]"}
              disabled={isCancelling || isCancelled || !reservationId}
              onClick={handleCancelReservation}
              icon={
                isCancelling ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#7C7356] border-t-transparent" />
                ) : (
                  <CircleButton className="bg-[#E3DFD4]!">
                    <ArrowRight className="h-6 w-6 text-[#958A68] drop-shadow-[0_0_0.5px_currentColor]" />
                  </CircleButton>
                )
              }
            >
              {isCancelling
                ? "Cancelando..."
                : isCancelled
                  ? "Reserva cancelada"
                  : "Cancelar reserva"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense>
      <BookingSuccessInner />
    </Suspense>
  );
}
