"use client";

import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { CheckCircle, ChevronRight, Tag } from "lucide-react";
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
import { useNightlyPrice } from "@/hooks/useNightlyPrice";
import { usePriceDetails, type PriceDetails } from "@/hooks/usePriceDetails";
import { useI18n } from "@/i18n";

import { Button } from "../Button";

const COMPONENT_LABEL: Record<string, { es: string; en: string }> = {
  baseRate: { es: "Tarifa base", en: "Base rate" },
  cleaningFee: { es: "Cargo de limpieza", en: "Cleaning fee" },
  lodgingTax: { es: "Impuesto de hospedaje", en: "Lodging tax" },
  salesTax: { es: "Impuesto sobre ventas", en: "Sales tax" },
};

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
  priceBreakdown?: PriceDetails;
  couponCode?: string;
  reservationCouponId?: number;
  discountPercent?: number;
};

type AppliedCoupon = {
  code: string;
  reservationCouponId: number;
  discountPercent: number;
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isClosingSheet, setIsClosingSheet] = useState(false);
  const sheetScrollRef = useRef<HTMLDivElement | null>(null);
  const [canDragSheet, setCanDragSheet] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const [sheetDragY, setSheetDragY] = useState(0);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null,
  );
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [preCouponTotal, setPreCouponTotal] = useState<number | null>(null);

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

  // Reset coupon when dates change
  useEffect(() => {
    setAppliedCoupon(null);
    setPreCouponTotal(null);
    setCouponError("");
  }, [dateRange.startDate, dateRange.endDate]);

  const toDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const handleDateClick = (date: Date) => {
    const clickedDay = toDay(date);
    const isOccupied = occupiedDates.some(
      (d) => toDay(d).getTime() === clickedDay.getTime(),
    );
    if (isOccupied) return;

    if (activeField === "checkin") {
      setDateRange({ startDate: date, endDate: null });
      setActiveField("checkout");
    } else if (activeField === "checkout") {
      if (dateRange.startDate && clickedDay <= toDay(dateRange.startDate)) {
        setDateRange({ startDate: date, endDate: null });
        setActiveField("checkout");
      } else {
        const startDay = toDay(dateRange.startDate!);
        const hasOccupiedInRange = occupiedDates.some((d) => {
          const day = toDay(d);
          return day > startDay && day < clickedDay;
        });
        if (hasOccupiedInRange) return;
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

  const nightlyPrice = useNightlyPrice(listingMapId, price);

  const nightlyTotal =
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
      : nightlyPrice.price;

  const totalGuests = guests.adults + guests.children + guests.infants;

  const { priceDetails, isLoading: isPriceLoading } = usePriceDetails(
    listingMapId,
    dateRange.startDate,
    dateRange.endDate,
    Math.max(1, guests.adults + guests.children),
    appliedCoupon?.reservationCouponId ?? null,
  );

  const totalPrice = priceDetails?.totalPrice ?? nightlyTotal;

  const discountComponent = priceDetails?.components?.find(
    (c) => c.type === "discount",
  );

  const shouldShowNoChargeText =
    !dateRange.startDate || !dateRange.endDate || totalGuests === 0;
  const showMobileSheet = showCalendar || showGuestSelector;

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (!dateRange.startDate || !dateRange.endDate) {
      setCouponError(
        locale === "en"
          ? "Select dates to apply a coupon"
          : "Selecciona fechas para aplicar un cupón",
      );
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      const response = await fetch("/api/hostaway/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponName: code,
          listingMapId: Number(listingMapId),
          startingDate: formatDateKey(dateRange.startDate),
          endingDate: formatDateKey(dateRange.endDate),
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        reservationCouponId?: number;
        couponCode?: string;
        discountPercent?: number;
        error?: string;
      };

      if (!data.success || !data.reservationCouponId) {
        setCouponError(
          data.error ??
            (locale === "en" ? "Invalid coupon" : "Cupón no válido"),
        );
        return;
      }

      // Store current total before coupon re-fetch
      setPreCouponTotal(totalPrice);
      setAppliedCoupon({
        code,
        reservationCouponId: data.reservationCouponId,
        discountPercent: data.discountPercent ?? 0,
      });
    } catch {
      setCouponError(
        locale === "en"
          ? "Error validating coupon. Try again."
          : "Error al validar el cupón. Intenta de nuevo.",
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPreCouponTotal(null);
    setCouponError("");
    setCouponInput("");
  };

  const handleBookingClick = () => {
    if (disableCheckout || isPriceLoading) return;
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
      priceBreakdown: priceDetails ?? undefined,
      couponCode: appliedCoupon?.code,
      reservationCouponId: appliedCoupon?.reservationCouponId,
      discountPercent: appliedCoupon?.discountPercent ?? undefined,
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
    if (delta > 0) e.preventDefault();
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

  const isLoadingPrice =
    (isPriceLoading && dateRange.startDate && dateRange.endDate) ??
    (nightlyPrice.isLoading && !dateRange.startDate && !dateRange.endDate);

  return (
    <figure
      className={`bg-green-normal h-auto rounded-[10px] px-6 py-10 sm:w-154 sm:px-12.5 ${className}`}
    >
      {/* Price header */}
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        {appliedCoupon && preCouponTotal && !isPriceLoading && (
          <Text
            size="2xl"
            font="gilroy"
            weight="bold"
            className="text-white/50 line-through"
          >
            ${new Intl.NumberFormat("es-MX").format(preCouponTotal)} MXN
          </Text>
        )}
        <Text size="4xl" font="gilroy" weight="bold" className="text-white">
          {isLoadingPrice ? (
            <span className="inline-block h-8 w-32 animate-pulse rounded bg-white/20" />
          ) : (
            `$${new Intl.NumberFormat("es-MX").format(totalPrice)} MXN`
          )}
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

      {/* Dates + guests card */}
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

      <Text font="gilroy" size="sm" className="mt-3 text-center text-white">
        {locale === "en"
          ? "Prices may vary based on date and availability."
          : "Los precios pueden variar según la fecha y disponibilidad."}
      </Text>

      <div className="mt-3">
        {appliedCoupon ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-[10px] bg-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0 text-green-300" />
                <span className="font-gilroy text-sm font-bold text-white">
                  {appliedCoupon.code}
                </span>
                {appliedCoupon.discountPercent ? (
                  <span className="rounded-full bg-green-500/25 px-2 py-0.5 text-xs font-semibold text-green-300">
                    {appliedCoupon.discountPercent}%{" "}
                    {locale === "en" ? "discount" : "descuento"}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Quitar cupón"
                onClick={handleRemoveCoupon}
                className="text-white/50 transition-colors hover:text-white"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            {!isPriceLoading && priceDetails?.components && (
              <div className="mt-2 space-y-1.5 rounded-[10px] bg-white/5 px-4 py-3">
                {priceDetails.components
                  .filter((c) => c.type !== "discount")
                  .map((c) => {
                    const label =
                      COMPONENT_LABEL[c.name]?.[locale as "es" | "en"] ??
                      c.title;
                    const isBaseRate = c.name === "baseRate";
                    const netAmount = isBaseRate
                      ? c.total + (discountComponent?.total ?? 0)
                      : c.total;
                    return (
                      <div
                        key={c.name}
                        className="flex items-center justify-between"
                      >
                        <Text font="gilroy" size="sm" className="text-white/70">
                          {label}
                        </Text>
                        <div className="flex items-center gap-1.5">
                          {isBaseRate && discountComponent && (
                            <Text
                              font="gilroy"
                              size="sm"
                              className="text-white/40 line-through"
                            >
                              $
                              {new Intl.NumberFormat("es-MX").format(
                                c.total,
                              )}{" "}
                            </Text>
                          )}
                          <Text
                            font="gilroy"
                            size="sm"
                            className={
                              isBaseRate && discountComponent
                                ? "text-green-300"
                                : "text-white/70"
                            }
                          >
                            ${new Intl.NumberFormat("es-MX").format(netAmount)}{" "}
                            MXN
                          </Text>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div
              className={`flex h-13.5 items-center rounded-[10px] border bg-white/10 px-4 py-2.5 transition-colors ${
                couponError ? "border-red-400" : "border-white/40"
              }`}
            >
              <Tag
                className={`h-6 w-6 shrink-0 ${couponError ? "text-red-400" : "text-white"}`}
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  setCouponError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleApplyCoupon();
                }}
                placeholder={locale === "en" ? "Enter coupon" : "Ingresa cupón"}
                className="mx-[9.52px] flex-1 bg-transparent text-[16.33px] font-bold text-white uppercase outline-none placeholder:text-white placeholder:normal-case"
              />
              <button
                type="button"
                onClick={() => void handleApplyCoupon()}
                disabled={isValidatingCoupon || !couponInput.trim()}
                className="shrink-0 cursor-pointer text-[16.33px] font-normal text-white transition-colors hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isValidatingCoupon ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : locale === "en" ? (
                  "Apply"
                ) : (
                  "Aplicar"
                )}
              </button>
            </div>
            {couponError && (
              <Text
                font="gilroy"
                size="sm"
                className="mt-1.5 pl-1 text-red-300"
              >
                {couponError}
              </Text>
            )}
          </div>
        )}
      </div>

      {/* Book button */}
      <div className="mt-5 flex w-full flex-col items-center">
        <Button
          variant="secondary"
          textClassName="text-base font-medium"
          className="flex w-full justify-center"
          disabled={
            disableCheckout ||
            isPriceLoading ||
            !dateRange.startDate ||
            !dateRange.endDate ||
            (couponInput.trim().length > 0 && !appliedCoupon)
          }
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

      {/* Mobile sheet */}
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
