"use client";

import { ArrowRight, Search, ShieldCheck, XCircle } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CircleButton, Text } from "@/components/atoms";
import { Button, Input } from "@/components/molecules";
import { usePriceDetails } from "@/hooks/usePriceDetails";
import { useI18n } from "@/i18n";

const COMPONENT_TITLE_ES: Record<string, string> = {
  "base rate": "Tarifa base",
  "cleaning fee": "Tarifa de limpieza",
  "lodging tax": "Impuesto de hospedaje",
  "sales tax": "Impuesto sobre ventas",
};

const translateTitle = (title: string) =>
  COMPONENT_TITLE_ES[title.trim().toLowerCase().replace(/\s+/g, " ")] ?? title;

type ReservationData = {
  id: number;
  status: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestCountry: string | null;
  phone: string | null;
  numberOfGuests: number;
  adults: number;
  children: number | null;
  infants: number | null;
  arrivalDate: string;
  departureDate: string;
  totalPrice: number;
  currency: string;
  isPaid: number;
  cancelledBy: string | null;
  paymentIntentId: string | null;
  listingMapId: number;
  propertyName: string | null;
  propertyImage: string | null;
  propertyCity: string | null;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (amount: number, currency: string) =>
  `$${new Intl.NumberFormat("es-MX").format(amount)} ${currency}`;

const toDateInputValue = (dateStr: string) => dateStr.slice(0, 10);

type ReservationEditForm = {
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  phone: string;
  guestCountry: string;
  arrivalDate: string;
  departureDate: string;
  adults: string;
  children: string;
  infants: string;
};

const toEditForm = (reservation: ReservationData): ReservationEditForm => ({
  guestFirstName: reservation.guestFirstName,
  guestLastName: reservation.guestLastName,
  guestEmail: reservation.guestEmail,
  phone: reservation.phone ?? "",
  guestCountry: reservation.guestCountry ?? "",
  arrivalDate: toDateInputValue(reservation.arrivalDate),
  departureDate: toDateInputValue(reservation.departureDate),
  adults: String(reservation.adults),
  children: String(reservation.children ?? 0),
  infants: String(reservation.infants ?? 0),
});

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: {
    label: "Confirmada",
    color: "text-green-600 bg-green-50 border-green-200",
  },
  confirmed: {
    label: "Confirmada",
    color: "text-green-600 bg-green-50 border-green-200",
  },
  modified: {
    label: "Modificada",
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  cancelled: {
    label: "Cancelada",
    color: "text-red-600 bg-red-50 border-red-200",
  },
  declined: {
    label: "Rechazada",
    color: "text-red-600 bg-red-50 border-red-200",
  },
  pending: {
    label: "Pendiente",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
  },
};

function StatusBadge({ status }: { status: string }) {
  const info = STATUS_LABELS[status] ?? {
    label: status,
    color: "text-gray-600 bg-gray-50 border-gray-200",
  };
  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-medium ${info.color}`}
    >
      {info.label}
    </span>
  );
}

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

function LookupForm({
  onFound,
}: {
  onFound: (reservation: ReservationData) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialReservationId = searchParams.get("reservationId") ?? "";
  const initialEmail = searchParams.get("email") ?? "";
  const hasAutoSearched = useRef(false);

  const [reservationId, setReservationId] = useState(initialReservationId);
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const lookupReservation = useCallback(
    async ({
      rawReservationId,
      rawEmail,
    }: {
      rawReservationId: string;
      rawEmail: string;
    }) => {
      setError("");

      const normalizedReservationId = rawReservationId.replace("#", "").trim();
      const trimmedEmail = rawEmail.trim();
      const id = Number(normalizedReservationId);

      if (!id || isNaN(id)) {
        setError("Ingresa un número de reservación válido");
        return false;
      }
      if (!trimmedEmail) {
        setError("Ingresa tu correo electrónico");
        return false;
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set("reservationId", String(id));
      params.set("email", trimmedEmail);
      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });

      setIsLoading(true);

      try {
        const response = await fetch("/api/hostaway/reservations/lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservationId: id, email: trimmedEmail }),
        });

        const data = (await response.json()) as {
          success?: boolean;
          reservation?: ReservationData;
          error?: string;
        };

        if (!response.ok || !data.success || !data.reservation) {
          setError(data.error ?? "No se pudo encontrar la reservación");
          return false;
        }

        onFound(data.reservation);
        return true;
      } catch {
        setError("Error inesperado al buscar la reservación");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [onFound, pathname, router, searchParams],
  );

  useEffect(() => {
    setReservationId(initialReservationId);
    setEmail(initialEmail);
  }, [initialEmail, initialReservationId, lookupReservation]);

  useEffect(() => {
    if (hasAutoSearched.current) return;
    if (!initialReservationId || !initialEmail) return;

    hasAutoSearched.current = true;
    void lookupReservation({
      rawReservationId: initialReservationId,
      rawEmail: initialEmail,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail, initialReservationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await lookupReservation({
      rawReservationId: reservationId,
      rawEmail: email,
    });
  };

  return (
    <div className="mt-15 flex min-h-screen items-center bg-[#F2F0EA] p-5">
      <section className="mx-auto max-w-xl rounded-2xl bg-white px-8 pt-28 pb-16 md:px-16 md:pt-36">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-32.5 w-32.5 items-center justify-center rounded-full bg-[#EDEEEC]">
            <Search className="text-green-normal h-15 w-15" strokeWidth={2} />
          </div>

          <Text
            as="h1"
            size="4xl"
            weight="medium"
            className="text-green-normal"
          >
            Seguimiento de reserva
          </Text>

          <Text font="gilroy" size="lg" className="text-green-normal">
            Ingresa tu número de reserva y correo electrónico para consultar el
            estado de tu reservación
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
              placeholder="Ej: 12345678"
              className="border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
            />
          </div>

          <div>
            <Input
              label="Correo electrónico"
              labelSize="base"
              labelWeight="bold"
              labelClassName="text-green-darker leading-5"
              value={email}
              onChange={setEmail}
              placeholder="tu@correo.com"
              type="email"
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
                  <ArrowRight className="h-6 w-6 text-white drop-shadow-[0_0_0.5px_currentColor]" />
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

function ReservationDetail({
  reservation,
  onBack,
}: {
  reservation: ReservationData;
  onBack: () => void;
}) {
  const { t } = useI18n();
  const [currentReservation, setCurrentReservation] =
    useState<ReservationData>(reservation);
  const [form, setForm] = useState<ReservationEditForm>(
    toEditForm(reservation),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const arrivalDateObj = useMemo(
    () => new Date(currentReservation.arrivalDate + "T12:00:00"),
    [currentReservation.arrivalDate],
  );
  const departureDateObj = useMemo(
    () => new Date(currentReservation.departureDate + "T12:00:00"),
    [currentReservation.departureDate],
  );

  const { priceDetails, isLoading: isPriceLoading } = usePriceDetails(
    String(currentReservation.listingMapId),
    arrivalDateObj,
    departureDateObj,
    Math.max(1, currentReservation.adults + (currentReservation.children ?? 0)),
  );

  const isCancelled = currentReservation.status === "cancelled";

  const isCancellable =
    !isCancelled &&
    currentReservation.status !== "cancelled" &&
    currentReservation.status !== "declined";

  const totalGuests =
    currentReservation.adults +
    (currentReservation.children ?? 0) +
    (currentReservation.infants ?? 0);

  const nights = Math.max(
    1,
    Math.round(
      (new Date(currentReservation.departureDate + "T12:00:00").getTime() -
        new Date(currentReservation.arrivalDate + "T12:00:00").getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  const handleCancel = async () => {
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
          reservationId: currentReservation.id,
          paymentIntentId: currentReservation.paymentIntentId ?? undefined,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setCancelError(data.error ?? "Error al cancelar la reservación");
        return;
      }

      setCurrentReservation((previous) => ({
        ...previous,
        status: "cancelled",
        cancelledBy: "guest",
      }));
      setIsEditing(false);
    } catch {
      setCancelError("Error inesperado al cancelar la reservación");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSave = async () => {
    setSaveError("");
    setSaveSuccess("");

    const adults = Number(form.adults);
    const children = Number(form.children || "0");
    const infants = Number(form.infants || "0");

    if (
      !form.guestFirstName.trim() ||
      !form.guestLastName.trim() ||
      !form.guestEmail.trim()
    ) {
      setSaveError(
        "Nombre, apellidos y correo son obligatorios para actualizar la reserva",
      );
      return;
    }

    if (
      Number.isNaN(adults) ||
      Number.isNaN(children) ||
      Number.isNaN(infants) ||
      adults < 1 ||
      children < 0 ||
      infants < 0
    ) {
      setSaveError("Verifica los datos de huéspedes");
      return;
    }

    if (!form.arrivalDate || !form.departureDate) {
      setSaveError("Debes seleccionar fechas de llegada y salida");
      return;
    }

    if (new Date(form.departureDate) <= new Date(form.arrivalDate)) {
      setSaveError("La fecha de salida debe ser posterior a la de llegada");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/hostaway/reservations/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: currentReservation.id,
          guestFirstName: form.guestFirstName.trim(),
          guestLastName: form.guestLastName.trim(),
          guestEmail: form.guestEmail.trim(),
          phone: form.phone.trim() || null,
          guestCountry: form.guestCountry.trim() || null,
          arrivalDate: form.arrivalDate,
          departureDate: form.departureDate,
          adults,
          children,
          infants,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setSaveError(data.error ?? "No se pudo actualizar la reservación");
        return;
      }

      setCurrentReservation((previous) => ({
        ...previous,
        guestFirstName: form.guestFirstName.trim(),
        guestLastName: form.guestLastName.trim(),
        guestEmail: form.guestEmail.trim(),
        phone: form.phone.trim() || null,
        guestCountry: form.guestCountry.trim() || null,
        arrivalDate: form.arrivalDate,
        departureDate: form.departureDate,
        adults,
        children,
        infants,
        numberOfGuests: adults + children + infants,
        status: previous.status === "confirmed" ? "modified" : previous.status,
      }));

      setIsEditing(false);
      setSaveSuccess("Tu reservación se actualizó correctamente");
    } catch {
      setSaveError("Error inesperado al actualizar la reservación");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0EA] p-5">
      <section className="rounded-2xl bg-white px-8 pt-28 pb-16 md:px-16 md:pt-36">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-32.5 w-32.5 items-center justify-center rounded-full bg-[#EDEEEC]">
            {isCancelled ? (
              <XCircle className="h-15 w-15 text-red-500" strokeWidth={2} />
            ) : (
              <ShieldCheck
                className="text-green-normal h-15 w-15"
                strokeWidth={2}
              />
            )}
          </div>

          <Text
            as="h1"
            size="4xl"
            weight="medium"
            className={isCancelled ? "text-red-600" : "text-green-normal"}
          >
            {isCancelled ? "Reserva cancelada" : "Detalles de tu reserva"}
          </Text>

          <div className="flex items-center gap-3">
            <Text font="gilroy" size="2xl" className="text-green-normal">
              {t("Reserva #")} {currentReservation.id}
            </Text>
            <StatusBadge
              status={isCancelled ? "cancelled" : currentReservation.status}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_480px]">
          {/* Left column — guest & payment info */}
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
                  value={form.guestFirstName}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      guestFirstName: value,
                    }))
                  }
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="Apellidos"
                  value={form.guestLastName}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      guestLastName: value,
                    }))
                  }
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="Correo electrónico"
                  value={form.guestEmail}
                  onChange={(value) =>
                    setForm((previous) => ({ ...previous, guestEmail: value }))
                  }
                  type="email"
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="Teléfono"
                  value={form.phone}
                  onChange={(value) =>
                    setForm((previous) => ({ ...previous, phone: value }))
                  }
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="País de residencia"
                  value={form.guestCountry}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      guestCountry: value,
                    }))
                  }
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="Fecha de llegada"
                  value={form.arrivalDate}
                  onChange={(value) =>
                    setForm((previous) => ({ ...previous, arrivalDate: value }))
                  }
                  type="date"
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="Fecha de salida"
                  value={form.departureDate}
                  onChange={(value) =>
                    setForm((previous) => ({
                      ...previous,
                      departureDate: value,
                    }))
                  }
                  type="date"
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="Adultos"
                  value={form.adults}
                  onChange={(value) =>
                    setForm((previous) => ({ ...previous, adults: value }))
                  }
                  type="number"
                  min={1}
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="Niños"
                  value={form.children}
                  onChange={(value) =>
                    setForm((previous) => ({ ...previous, children: value }))
                  }
                  type="number"
                  min={0}
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
                />
                <Input
                  label="Bebés"
                  value={form.infants}
                  onChange={(value) =>
                    setForm((previous) => ({ ...previous, infants: value }))
                  }
                  type="number"
                  min={0}
                  labelSize="base"
                  labelWeight="bold"
                  labelClassName="text-green-darker leading-5"
                  nonEditable={!isEditing}
                  className={
                    isEditing
                      ? "border-grey-normal mt-1.5 rounded-[10px] border px-4 py-3.5"
                      : ""
                  }
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text font="gilroy" size="base" className="text-green-darker">
                    Reserva por {nights} {nights === 1 ? "noche" : "noches"}
                  </Text>
                  <Text
                    font="gilroy"
                    size="base"
                    weight="medium"
                    className="text-green-darker"
                  >
                    {formatPrice(
                      currentReservation.totalPrice,
                      currentReservation.currency,
                    )}
                  </Text>
                </div>
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
                    {formatPrice(
                      currentReservation.totalPrice,
                      currentReservation.currency,
                    )}
                  </Text>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Text font="gilroy" size="sm" className="text-grey-darker">
                    Estado de pago:
                  </Text>
                  <Text
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      true
                        ? "border-green-200 bg-green-50 text-green-600"
                        : "border-yellow-200 bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {true ? "Pagado" : "Pendiente"}
                  </Text>
                </div>
              </div>

              <Text font="gilroy" size="xs" className="mt-5 text-[#4C4D4C]">
                Política de cancelación — 100% reembolsable hasta 14 días antes
                de la llegada — 50% reembolsable hasta 7 días antes de la
                llegada
              </Text>
            </div>
          </div>

          {/* Right column — property & actions */}
          <div className="space-y-3">
            <div className="border-grey-normal rounded-2xl border bg-white p-5">
              <div className="flex gap-5">
                {currentReservation.propertyImage ? (
                  <div className="relative h-38 w-38 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={currentReservation.propertyImage}
                      alt={currentReservation.propertyName ?? "Propiedad"}
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
                    {currentReservation.propertyName ?? "Propiedad"}
                  </Text>
                  {currentReservation.propertyCity && (
                    <Text
                      font="gilroy"
                      size="base"
                      className="text-grey-darker"
                    >
                      {currentReservation.propertyCity}, México
                    </Text>
                  )}
                  <Text
                    font="gilroy"
                    size="base"
                    weight="bold"
                    className="text-green-darker mt-1"
                  >
                    {formatPrice(
                      currentReservation.totalPrice,
                      currentReservation.currency,
                    )}
                  </Text>
                </div>
              </div>
            </div>

            <InfoRow
              label="Fechas"
              value={`${formatDate(currentReservation.arrivalDate)} – ${formatDate(currentReservation.departureDate)}`}
            />
            <InfoRow
              label="Huéspedes"
              value={`${totalGuests} ${totalGuests === 1 ? "Huésped" : "Huéspedes"}`}
            />
            <InfoRow
              label="Noches"
              value={`${nights} ${nights === 1 ? "noche" : "noches"}`}
            />

            <div className="border-grey-normal rounded-[10px] border bg-white px-5 py-4">
              <Text
                font="gilroy"
                size="base"
                weight="bold"
                className="text-green-darker mb-3"
              >
                Detalle del precio
              </Text>
              {isPriceLoading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="border-t-green-normal h-5 w-5 animate-spin rounded-full border-2 border-gray-200" />
                </div>
              ) : priceDetails?.components &&
                priceDetails.components.length > 0 ? (
                <div className="space-y-2">
                  {priceDetails.components
                    .filter((c) => c.isIncludedInTotalPrice === 1)
                    .map((component, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <Text
                          font="gilroy"
                          size="sm"
                          className="text-grey-darker"
                        >
                          {translateTitle(component.title)}
                        </Text>
                        <Text
                          font="gilroy"
                          size="sm"
                          className={
                            component.total < 0
                              ? "text-green-600"
                              : "text-grey-darker"
                          }
                        >
                          {component.total < 0 ? "-" : ""}$
                          {new Intl.NumberFormat("es-MX").format(
                            Math.abs(component.total),
                          )}{" "}
                          MXN
                        </Text>
                      </div>
                    ))}
                  <div className="border-grey-normal my-1 border-t" />
                  <div className="flex items-center justify-between">
                    <Text
                      font="gilroy"
                      size="sm"
                      weight="bold"
                      className="text-green-darker"
                    >
                      Total
                    </Text>
                    <Text
                      font="gilroy"
                      size="sm"
                      weight="bold"
                      className="text-green-darker"
                    >
                      $
                      {new Intl.NumberFormat("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(priceDetails.totalPrice)}{" "}
                      MXN
                    </Text>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <Text font="gilroy" size="sm" className="text-grey-darker">
                    Total
                  </Text>
                  <Text
                    font="gilroy"
                    size="sm"
                    weight="bold"
                    className="text-green-darker"
                  >
                    {formatPrice(
                      currentReservation.totalPrice,
                      currentReservation.currency,
                    )}
                  </Text>
                </div>
              )}
            </div>

            {saveError && (
              <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <Text font="gilroy" size="sm" className="text-red-700">
                  {saveError}
                </Text>
              </div>
            )}

            {saveSuccess && (
              <div className="mt-2 rounded-xl border border-green-200 bg-green-50 p-3">
                <Text font="gilroy" size="sm" className="text-green-700">
                  {saveSuccess}
                </Text>
              </div>
            )}

            {cancelError && (
              <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-3">
                <Text font="gilroy" size="sm" className="text-red-700">
                  {cancelError}
                </Text>
              </div>
            )}

            {isEditing && (
              <Button
                type="button"
                variant="primary"
                className="h-14.5 w-full justify-center"
                textWeight="bold"
                textClassName="text-gold-dark"
                disabled={isSaving}
                onClick={handleSave}
                icon={
                  isSaving ? (
                    <div className="border-gold-normal h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
                  ) : (
                    <CircleButton>
                      <ArrowRight className="text-gold-normal-hover h-6 w-6 drop-shadow-[0_0_0.5px_currentColor]" />
                    </CircleButton>
                  )
                }
              >
                {isSaving ? "Guardando cambios..." : "Guardar cambios"}
              </Button>
            )}

            {isEditing && (
              <Button
                type="button"
                variant="secondary"
                className="h-14.5 w-full justify-center"
                textWeight="medium"
                textClassName="text-green-normal"
                onClick={() => {
                  setForm(toEditForm(currentReservation));
                  setIsEditing(false);
                  setSaveError("");
                  setSaveSuccess("");
                }}
                icon={
                  <CircleButton className="bg-[#EDEEEC]!">
                    <ArrowRight className="text-green-normal h-6 w-6 rotate-180 drop-shadow-[0_0_0.5px_currentColor]" />
                  </CircleButton>
                }
                iconPosition="left"
              >
                Cancelar edición
              </Button>
            )}

            {isCancellable && (
              <Button
                type="button"
                variant="secondary"
                className="mt-2 h-14.5 w-full justify-center border-[#7C7356] bg-[#E3DFD4]! hover:bg-[#E3DFD4] focus:bg-[#E3DFD4]"
                textWeight="medium"
                textClassName="text-[#7C7356]"
                disabled={isCancelling || isEditing || isSaving}
                onClick={handleCancel}
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
                {isCancelling ? "Cancelando..." : "Cancelar reserva"}
              </Button>
            )}

            <Button
              type="button"
              variant="secondary"
              className="mt-2 h-14.5 w-full justify-center border border-[#7C7356]"
              textWeight="medium"
              textClassName="text-green-normal"
              onClick={onBack}
              disabled={isSaving}
              icon={
                <CircleButton className="bg-[#EDEEEC]!">
                  <ArrowRight className="text-green-normal h-6 w-6 rotate-180 drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
              }
              iconPosition="left"
            >
              Buscar otra reserva
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ReservationTrackingPage() {
  const [reservation, setReservation] = useState<ReservationData | null>(null);

  if (reservation) {
    return (
      <ReservationDetail
        reservation={reservation}
        onBack={() => setReservation(null)}
      />
    );
  }

  return <LookupForm onFound={setReservation} />;
}
