"use client";

import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type TouchEvent } from "react";

import { CircleButton, RatingBadge, Text } from "@/components/atoms";
import {
  Calendar,
  GuestSelector,
  formatGuestsText,
  type DateRange,
  type GuestCounts,
} from "@/components/molecules";
import { useCalendar } from "@/hooks/useCalendar";
import { useI18n } from "@/i18n";

import { Button } from "../Button";

type BookingWidgetProps = {
  price: number;
  className?: string;
  maxCapacity?: number;
  occupiedDates?: Date[];
  priceByDate?: Record<string, number>;
  listingMapId: string;
  onBookingClick?: (bookingData: BookingData) => void;
  disableCheckout?: boolean;
  sharedDateRange?: DateRange;
  onSharedDateRangeChange?: (range: DateRange) => void;
};

export type BookingData = {
  startDate: Date | null;
  endDate: Date | null;
  guests: GuestCounts;
  totalNights: number;
  totalPrice: number;
  listingMapId: string;
  propertyName?: string;
  propertyImage?: string;
  propertyCity?: string;
  propertyRating?: number;
  pricePerNight?: number;
};

export const BookingWidget = ({
  price,
  className = "",
  maxCapacity = 10,
  occupiedDates = [],
  priceByDate,
  listingMapId,
  onBookingClick,
  disableCheckout = false,
  sharedDateRange,
  onSharedDateRangeChange,
}: BookingWidgetProps) => {
  const { locale, t } = useI18n();
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isClosingSheet, setIsClosingSheet] = useState(false);
  const [sheetDragY, setSheetDragY] = useState(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [canDragSheet, setCanDragSheet] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const sheetScrollRef = useRef<HTMLDivElement | null>(null);

  const {
    showCalendar,
    currentMonth,
    dateRange: internalDateRange,
    activeField,
    handlePrevMonth,
    handleNextMonth,
    clearDates: internalClearDates,
    openCalendar,
    closeCalendar,
    setDateRange: setInternalDateRange,
    setActiveField,
  } = useCalendar();

  // Modo controlado: usa el dateRange compartido si se pasa como prop
  const isControlled = sharedDateRange !== undefined;
  const dateRange = isControlled ? sharedDateRange : internalDateRange;

  const setDateRange = (range: DateRange) => {
    if (isControlled) {
      onSharedDateRangeChange?.(range);
    } else {
      setInternalDateRange(range);
    }
  };

  const clearDates = () => {
    internalClearDates();
    if (isControlled) {
      onSharedDateRangeChange?.({ startDate: null, endDate: null });
    }
  };

  // Handler propio que opera sobre el dateRange efectivo (interno o externo)
  const handleDateClick = (date: Date) => {
    const isOccupied = occupiedDates.some(
      (d) => d.toDateString() === date.toDateString(),
    );
    if (isOccupied) return;

    if (activeField === "checkin") {
      setDateRange({ startDate: date, endDate: null });
      setActiveField("checkout");
    } else if (activeField === "checkout") {
      if (dateRange.startDate && date <= dateRange.startDate) {
        setDateRange({ startDate: date, endDate: null });
        setActiveField("checkout");
      } else {
        setDateRange({ ...dateRange, endDate: date });
        closeCalendar();
      }
    }
  };

  const totalNights =
    dateRange.startDate && dateRange.endDate
      ? Math.ceil(
          (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 1;
  const stayNightsLabel =
    totalNights > 0
      ? locale === "en"
        ? `for ${totalNights} ${totalNights === 1 ? "night" : "nights"}`
        : `por ${totalNights} ${totalNights === 1 ? "noche" : "noches"}`
      : "";

  const formatDateKeyLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getNightlyPrice = (date: Date) => {
    const key = formatDateKeyLocal(date);
    return priceByDate?.[key] ?? price;
  };

  const totalPrice =
    dateRange.startDate && dateRange.endDate
      ? (() => {
          let total = 0;
          const current = new Date(dateRange.startDate);
          while (current < dateRange.endDate) {
            total += getNightlyPrice(current);
            current.setDate(current.getDate() + 1);
          }
          return total;
        })()
      : price;
  const totalGuests = guests.adults + guests.children + guests.infants;
  const shouldShowNoChargeText =
    !dateRange.startDate || !dateRange.endDate || totalGuests === 0;
  const showMobileSheet = showCalendar || showGuestSelector;

  const handleBookingClick = () => {
    if (disableCheckout) {
      return;
    }
    if (!dateRange.startDate || !dateRange.endDate) {
      alert(t("Por favor selecciona las fechas de tu estadía"));
      return;
    }

    const bookingData: BookingData = {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      guests,
      totalNights,
      totalPrice,
      listingMapId,
    };

    onBookingClick?.(bookingData);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return t("Añadir fecha");
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const closePanels = () => {
    closeCalendar();
    setShowGuestSelector(false);
  };

  const isMobileViewport = () =>
    typeof window !== "undefined" && window.innerWidth < 640;

  const closeMobileSheet = () => {
    if (!isMobileViewport()) {
      closePanels();
      return;
    }

    if (isClosingSheet) return;
    setIsClosingSheet(true);
    setIsSheetVisible(false);
    setSheetDragY(0);
    setTouchStartY(null);

    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      closePanels();
      setIsClosingSheet(false);
      closeTimeoutRef.current = null;
    }, 240);
  };

  const handleSheetTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const target = e.target as HTMLElement;
    const startedInScrollableArea = Boolean(
      target.closest("[data-sheet-scroll]"),
    );
    const scrollTop = sheetScrollRef.current?.scrollTop ?? 0;

    setCanDragSheet(!startedInScrollableArea || scrollTop === 0);
    setTouchStartY(touch.clientY);
  };

  const handleSheetTouchMove = (e: TouchEvent) => {
    if (touchStartY === null || !canDragSheet) return;
    const touch = e.touches[0];
    if (!touch) return;
    const delta = touch.clientY - touchStartY;
    if (delta > 0) {
      e.preventDefault();
    }
    setSheetDragY(delta > 0 ? delta : 0);
  };

  const handleSheetTouchEnd = () => {
    setCanDragSheet(false);

    if (sheetDragY > 120) {
      closeMobileSheet();
      return;
    }

    setSheetDragY(0);
    setTouchStartY(null);
  };

  useEffect(() => {
    if (!showMobileSheet || !isMobileViewport()) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showMobileSheet]);

  useEffect(() => {
    if (!showMobileSheet || !isMobileViewport()) {
      setIsSheetVisible(false);
      setSheetDragY(0);
      setTouchStartY(null);
      return;
    }

    setIsClosingSheet(false);
    setSheetDragY(0);
    const frame = window.requestAnimationFrame(() => {
      setIsSheetVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [showMobileSheet]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <figure
      className={`bg-green-normal h-auto rounded-[10px] px-6 py-10 sm:w-154 sm:px-12.5 ${className}`}
    >
      <div className="flex space-x-2.5">
        <Text size="4xl" font="gilroy" weight="bold" className="text-white">
          ${new Intl.NumberFormat("es-MX").format(totalPrice)} MXN
        </Text>
        <Text size="lg" font="gilroy" className="mt-1 text-white sm:mt-2.5">
          {stayNightsLabel}
        </Text>

        <RatingBadge
          starClassName="text-[#FACC15]!"
          ratingClassName="text-white!"
          className="mt-2 ml-4 sm:hidden"
          rating={4.5}
        />
      </div>

      <div className="relative mt-5">
        <figure className="w-full overflow-hidden rounded-[10px] border border-gray-300 bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-gray-300">
            <div
              className={`cursor-pointer p-3 text-left transition-colors ${activeField === "checkin" ? "bg-gray-200" : ""}`}
              onClick={() => {
                openCalendar("checkin");
                setShowGuestSelector(false);
              }}
            >
              <Text
                font="gilroy"
                size="xl"
                weight="bold"
                className="text-green-darker"
              >
                Llegada
              </Text>
              <Text
                font="gilroy"
                size="base"
                className="text-green-darker mt-0.5"
              >
                {formatDate(dateRange.startDate)}
              </Text>
            </div>

            <div
              className={`cursor-pointer p-3 text-left transition-colors ${activeField === "checkout" ? "bg-gray-200" : ""}`}
              onClick={() => {
                openCalendar("checkout");
                setShowGuestSelector(false);
              }}
            >
              <Text
                font="gilroy"
                size="xl"
                weight="bold"
                className="text-green-darker"
              >
                Salida
              </Text>
              <Text
                font="gilroy"
                size="base"
                className="text-green-darker mt-0.5"
              >
                {formatDate(dateRange.endDate)}
              </Text>
            </div>
          </div>

          <div className="border-t border-gray-300">
            <div
              className="flex w-full cursor-pointer items-center justify-between p-3 text-left transition-colors hover:bg-gray-50"
              onClick={() => {
                setShowGuestSelector(!showGuestSelector);
                closeCalendar();
              }}
            >
              <div>
                <Text
                  font="gilroy"
                  size="xl"
                  weight="bold"
                  className="text-green-darker"
                >
                  Huéspedes
                </Text>
                <Text
                  font="gilroy"
                  size="base"
                  className="text-green-darker mt-0.5"
                >
                  {formatGuestsText(guests, locale)}
                </Text>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-gray-600 transition-transform ${showGuestSelector ? "rotate-90" : ""}`}
              />
            </div>
          </div>
        </figure>

        {showCalendar && (
          <div className="absolute right-0 z-50 mt-2 hidden sm:block">
            <Calendar
              currentMonth={currentMonth}
              dateRange={dateRange}
              occupiedDates={occupiedDates}
              onDateClick={handleDateClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onClearDates={clearDates}
              onClose={closeCalendar}
              showTwoMonths={true}
            />
          </div>
        )}

        {showGuestSelector && (
          <div className="absolute z-50 mt-2 hidden w-full sm:block">
            <GuestSelector
              guests={guests}
              maxCapacity={maxCapacity}
              onGuestsChange={setGuests}
              onClose={closePanels}
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex w-full flex-col items-center">
        <Button
          variant="secondary"
          textClassName="text-base font-medium"
          className="w-fit"
          disabled={disableCheckout}
          onClick={handleBookingClick}
          icon={
            <CircleButton className="bg-gold-light-active!">
              <ArrowRightIcon className="text-gold-dark w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          {disableCheckout ? "Reserva proximamente" : "Reserva ahora"}
        </Button>

        {shouldShowNoChargeText && (
          <Text
            font="gilroy"
            size="sm"
            weight="medium"
            className="mt-4 text-center text-white"
          >
            Aún no se te cobrará nada
          </Text>
        )}
      </div>

      {showMobileSheet && (
        <div className="fixed inset-0 z-70 sm:hidden">
          <button
            type="button"
            aria-label={t("Cerrar")}
            className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ease-out ${isSheetVisible ? "opacity-100" : "opacity-0"}`}
            onClick={closeMobileSheet}
          />

          <div
            className={`absolute right-0 bottom-0 left-0 h-[85dvh] rounded-t-3xl bg-white shadow-2xl transition-all duration-300 ease-out ${touchStartY !== null ? "transition-none" : ""} ${isSheetVisible ? "opacity-100" : "opacity-0"}`}
            style={{
              transform: `translateY(calc(${isSheetVisible ? "0%" : "100%"} + ${sheetDragY}px))`,
            }}
            onTouchStart={handleSheetTouchStart}
            onTouchMove={handleSheetTouchMove}
            onTouchEnd={handleSheetTouchEnd}
          >
            <div className="flex h-full flex-col">
              <div className="flex cursor-grab justify-center py-2 active:cursor-grabbing">
                <span className="h-1 w-12 rounded-full bg-gray-300" />
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <Text font="gilroy" size="base" weight="semibold">
                  {showCalendar
                    ? t("Selecciona tus fechas")
                    : t("Selecciona huéspedes")}
                </Text>
                <button
                  type="button"
                  aria-label={t("Cerrar")}
                  className="rounded-full p-1.5 text-gray-700"
                  onClick={closeMobileSheet}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div
                ref={sheetScrollRef}
                data-sheet-scroll
                className="flex-1 overflow-y-auto p-4"
              >
                {showCalendar && (
                  <Calendar
                    currentMonth={currentMonth}
                    dateRange={dateRange}
                    occupiedDates={occupiedDates}
                    onDateClick={handleDateClick}
                    onPrevMonth={handlePrevMonth}
                    onNextMonth={handleNextMonth}
                    onClearDates={clearDates}
                    onClose={closeCalendar}
                    showTwoMonths={false}
                    className="mx-auto h-full max-w-full border-0 p-0 shadow-none"
                  />
                )}

                {showGuestSelector && (
                  <GuestSelector
                    guests={guests}
                    maxCapacity={maxCapacity}
                    onGuestsChange={setGuests}
                    onClose={closeMobileSheet}
                    className="mx-auto max-w-full border-0 p-0 shadow-none"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </figure>
  );
};
