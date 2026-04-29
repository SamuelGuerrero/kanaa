"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Text } from "@/components/atoms";
import {
  Calendar,
  GuestSelector,
  type GuestCounts,
} from "@/components/molecules";
import { useCalendar } from "@/hooks/useCalendar";
import { useI18n } from "@/i18n";

import type { BookingData } from "@/components/molecules";
import type { PriceDetails } from "@/hooks/usePriceDetails";

type CheckoutBookingSummaryProps = {
  bookingData: BookingData;
  occupiedDates?: Date[];
  onDatesChange?: (startDate: Date | null, endDate: Date | null) => void;
  onGuestsChange?: (guests: GuestCounts) => void;
  priceBreakdown?: PriceDetails | null;
  isPriceLoading?: boolean;
};

const formatDateRange = (start: Date | null, end: Date | null) => {
  if (!start || !end) return "N/A";
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const s = start.toLocaleDateString("es-MX", opts);
  const e = end.toLocaleDateString("es-MX", opts);
  return `${s} – ${e}`;
};

const formatGuests = (guests: BookingData["guests"], locale: string) => {
  const total = guests.adults + guests.children;
  if (locale === "en") return `${total} ${total === 1 ? "Guest" : "Guests"}`;
  return `${total} ${total === 1 ? "Adulto" : "Adultos"}`;
};

const COMPONENT_TITLE_TRANSLATIONS_ES: Record<string, string> = {
  "base rate": "Tarifa base",
  "cleaning fee": "Tarifa de limpieza",
  "lodging tax": "Impuesto de hospedaje",
  "sales tax": "Impuesto sobre ventas",
  "coupon discount": "Descuento con cupón",
};

const normalizeComponentTitle = (title: string) =>
  title.trim().toLowerCase().replace(/\s+/g, " ");

const translateComponentTitle = (title: string, locale: string) => {
  if (locale !== "es") return title;
  return (
    COMPONENT_TITLE_TRANSLATIONS_ES[normalizeComponentTitle(title)] ?? title
  );
};

function ModifyButton({
  onClick,
  locale,
}: {
  onClick?: () => void;
  locale: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-gilroy hover:bg-gold-light h-11.75 w-29.25 shrink-0 cursor-pointer rounded-[10px] border border-[#A59973] bg-white px-6 py-3.5 text-base font-medium text-[#A59973] transition-colors"
    >
      {locale === "en" ? "Modify" : "Modificar"}
    </button>
  );
}

export const CheckoutBookingSummary = ({
  bookingData,
  occupiedDates = [],
  onDatesChange,
  onGuestsChange,
  priceBreakdown,
  isPriceLoading,
}: CheckoutBookingSummaryProps) => {
  const { locale } = useI18n();
  const {
    propertyName,
    propertyImage,
    propertyCity,
    propertyRating,
    totalPrice,
    startDate,
    endDate,
    guests,
  } = bookingData;

  const initialized = useRef(false);
  const {
    showCalendar,
    currentMonth,
    dateRange,
    handleDateClick,
    handlePrevMonth,
    handleNextMonth,
    clearDates,
    openCalendar,
    closeCalendar,
    setDateRange,
  } = useCalendar(startDate ?? new Date());

  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [localGuests, setLocalGuests] = useState<GuestCounts>(guests);

  useEffect(() => {
    if (initialized.current) return;
    if (startDate || endDate) {
      setDateRange({ startDate: startDate ?? null, endDate: endDate ?? null });
    }
    initialized.current = true;
  }, [startDate, endDate, setDateRange]);

  useEffect(() => {
    if (!initialized.current) return;
    if (dateRange.startDate && dateRange.endDate) {
      onDatesChange?.(dateRange.startDate, dateRange.endDate);
    }
  }, [dateRange.startDate, dateRange.endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuestsChange = (updated: GuestCounts) => {
    setLocalGuests(updated);
    onGuestsChange?.(updated);
  };

  const displayedStart = dateRange.startDate ?? startDate;
  const displayedEnd = dateRange.endDate ?? endDate;
  const displayedGuests = localGuests;

  return (
    <div className="border-grey-normal relative rounded-2xl border bg-white p-6">
      <div className="mb-5 flex items-start gap-4">
        {propertyImage && (
          <div className="relative h-37.5 w-37.5 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={propertyImage}
              alt={propertyName ?? "Propiedad"}
              fill
              className="h-37.5 w-37.5 object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Text
            font="gilroy"
            size="xl"
            weight="bold"
            className="text-green-darker leading-snug"
          >
            {propertyName ?? "Propiedad"}
          </Text>
          {propertyCity && (
            <Text font="gilroy" size="xl" className="text-grey-darker mt-0.5">
              {propertyCity}, México
            </Text>
          )}
          {propertyRating !== undefined && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-sm text-[#FACC15]">★</span>
              <Text
                font="gilroy"
                size="sm"
                weight="medium"
                className="text-green-darker"
              >
                {propertyRating.toFixed(2)}
              </Text>
            </div>
          )}
        </div>
      </div>

      <section className="flex flex-col space-y-2">
        <div className="relative">
          <figure className="border-grey-normal flex w-full items-center justify-between rounded-[10px] border p-4">
            <div>
              <Text
                font="gilroy"
                size="base"
                weight="bold"
                className="text-green-darker"
              >
                Fechas
              </Text>
              <Text font="gilroy" size="sm" className="text-grey-darker mt-0.5">
                {formatDateRange(displayedStart ?? null, displayedEnd ?? null)}
              </Text>
            </div>
            <ModifyButton
              locale={locale}
              onClick={() => {
                setShowGuestSelector(false);
                if (showCalendar) closeCalendar();
                else openCalendar("checkin");
              }}
            />
          </figure>

          {showCalendar && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full">
              <Calendar
                currentMonth={currentMonth}
                dateRange={dateRange}
                occupiedDates={occupiedDates}
                onDateClick={(date) => handleDateClick(date, occupiedDates)}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onClearDates={clearDates}
                onClose={closeCalendar}
                showTwoMonths={false}
                className="mx-auto max-w-full"
              />
            </div>
          )}
        </div>

        <div className="relative">
          <figure className="border-grey-normal flex w-full items-center justify-between rounded-[10px] border p-4">
            <div>
              <Text
                font="gilroy"
                size="base"
                weight="bold"
                className="text-green-darker"
              >
                Huéspedes
              </Text>
              <Text font="gilroy" size="sm" className="text-grey-darker mt-0.5">
                {formatGuests(displayedGuests, locale)}
              </Text>
            </div>
            <ModifyButton
              locale={locale}
              onClick={() => {
                closeCalendar();
                setShowGuestSelector((prev) => !prev);
              }}
            />
          </figure>

          {showGuestSelector && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full">
              <GuestSelector
                guests={localGuests}
                maxCapacity={20}
                onGuestsChange={handleGuestsChange}
                onClose={() => setShowGuestSelector(false)}
              />
            </div>
          )}
        </div>

        <figure className="border-grey-normal w-full rounded-[10px] border p-4">
          {isPriceLoading ? (
            <div className="flex items-center justify-center py-2">
              <div className="border-t-green-normal h-5 w-5 animate-spin rounded-full border-2 border-gray-200" />
            </div>
          ) : priceBreakdown?.components &&
            priceBreakdown.components.length > 0 ? (
            <div className="space-y-2">
              {priceBreakdown.components
                .filter((c) => c.isIncludedInTotalPrice === 1)
                .map((component, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <Text font="gilroy" size="sm" className="text-grey-darker">
                      {translateComponentTitle(component.title, locale)}
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
                  className="text-green-darker"
                >
                  $
                  {new Intl.NumberFormat("es-MX", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(totalPrice)}{" "}
                  MXN
                </Text>
              </div>
            </div>
          ) : (
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
                className="text-green-darker"
              >
                ${new Intl.NumberFormat("es-MX").format(totalPrice)} MXN
              </Text>
            </div>
          )}
        </figure>
      </section>
    </div>
  );
};
