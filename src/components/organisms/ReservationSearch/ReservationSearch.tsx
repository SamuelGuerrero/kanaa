"use client";

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { CircleButton, Text } from "@/components/atoms";
import {
  Calendar,
  Input,
  GuestSelector,
  formatGuestsText,
  type GuestCounts,
} from "@/components/molecules";
import { useCalendar } from "@/hooks/useCalendar";
import type { ApiResponse, Property } from "@/types/property";

export type SearchFilters = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  guestCounts: GuestCounts;
};

type ReservationSearchProps = {
  className?: string;
  onSearch?: (filters: SearchFilters) => void;
  initialFilters?: ReservationSearchInitialFilters;
};

export type ReservationSearchInitialFilters = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guestCounts?: GuestCounts;
};

export const ReservationSearch = ({
  className,
  onSearch,
  initialFilters,
}: ReservationSearchProps) => {
  const selectorContainerClass =
    "rounded-full border border-[#D8D8D8] bg-white transition-colors duration-200 focus-within:border-[#A19574] md:rounded-none md:border-0 md:bg-transparent";
  const selectorTextClass =
    "font-gilroy w-full bg-transparent text-sm text-[#444444] placeholder-[#6A6A6A] transition-colors duration-150 outline-none focus:text-[#1B1B1B] disabled:cursor-not-allowed disabled:text-[#9A9A9A]";

  const [destinationOptions, setDestinationOptions] = useState<
    { id: string; label: string }[]
  >([{ id: "", label: "Selecciona un destino" }]);
  const [destinationsLoading, setDestinationsLoading] = useState(false);
  const [destination, setDestination] = useState("");
  const [isMounted, setIsMounted] = useState(false);
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
    dateRange,
    activeField,
    handleDateClick,
    handlePrevMonth,
    handleNextMonth,
    clearDates,
    openCalendar,
    closeCalendar,
    setDateRange,
  } = useCalendar();

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    });
  };

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    onSearch?.({
      destination,
      checkIn: formatDate(dateRange.startDate),
      checkOut: formatDate(dateRange.endDate),
      guests: formatGuestsText(guests),
      guestCounts: guests,
    });
  };

  const parseDate = (value?: string) => {
    if (!value) return null;
    const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    }
    const parts = value.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (!day || !month || !year) return null;
      return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
    }
    return null;
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let cancelled = false;

    const loadDestinationOptions = async () => {
      setDestinationsLoading(true);
      try {
        const response = await fetch("/api/hostaway/listings?limit=100&offset=0");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = (await response.json()) as ApiResponse<Property[]>;
        const cities = Array.from(
          new Set(
            (data.result ?? [])
              .map((property) => property.city?.trim())
              .filter((city): city is string => Boolean(city)),
          ),
        ).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

        if (cancelled) return;

        setDestinationOptions([
          { id: "", label: "Selecciona un destino" },
          ...cities.map((city) => ({
            id: city,
            label: city,
          })),
        ]);
      } catch (error) {
        if (!cancelled) {
          console.error("Error loading destination options:", error);
          setDestinationOptions([{ id: "", label: "Selecciona un destino" }]);
        }
      } finally {
        if (!cancelled) {
          setDestinationsLoading(false);
        }
      }
    };

    void loadDestinationOptions();

    return () => {
      cancelled = true;
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (!initialFilters) return;
    if (typeof initialFilters.destination === "string") {
      const match = destinationOptions.some(
        (option) => option.id === initialFilters.destination,
      );
      if (match) {
        setDestination(initialFilters.destination);
      }
    }
    if (initialFilters.guestCounts) {
      setGuests(initialFilters.guestCounts);
    }
    if (initialFilters.checkIn || initialFilters.checkOut) {
      setDateRange({
        startDate: parseDate(initialFilters.checkIn),
        endDate: parseDate(initialFilters.checkOut),
      });
    }
  }, [destinationOptions, initialFilters, isMounted, setDateRange]);

  const handleCheckInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCalendar("checkin");
    setShowGuestSelector(false);
  };

  const handleCheckOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openCalendar("checkout");
    setShowGuestSelector(false);
  };

  const handleGuestsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowGuestSelector(!showGuestSelector);
    closeCalendar();
  };

  const showMobileSheet = showCalendar || showGuestSelector;
  const closePanels = () => {
    closeCalendar();
    setShowGuestSelector(false);
  };
  const isMobileViewport = () =>
    typeof window !== "undefined" && window.innerWidth < 768;

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

  const handleSheetTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const target = e.target as HTMLElement;
    const startedInScrollableArea = Boolean(target.closest("[data-sheet-scroll]"));
    const scrollTop = sheetScrollRef.current?.scrollTop ?? 0;

    setCanDragSheet(!startedInScrollableArea || scrollTop === 0);
    setTouchStartY(touch.clientY);
  };

  const handleSheetTouchMove = (e: React.TouchEvent) => {
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
    <form
      onSubmit={handleSearch}
      suppressHydrationWarning
      className={`relative flex h-92 w-[95%] flex-col items-center overflow-visible rounded-xl bg-white p-3 text-left sm:shadow-lg md:h-16 md:w-205.75 md:flex-row md:gap-0 md:rounded-full md:p-0 md:shadow-none ${className ?? ""}`}
    >
      <div
        className={`relative mb-3 w-full px-6 py-4 md:mb-0 md:w-70.75 md:min-w-70.75 md:py-0 ${selectorContainerClass}`}
      >
        <div className="absolute top-1/2 right-0 hidden h-[85%] w-px -translate-y-1/2 bg-gray-200 md:block" />
        <div className="relative">
          <Text
            font="gilroy"
            size="xs"
            weight="medium"
            className="block text-[#1F1F1F]"
          >
            Destino
          </Text>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={destinationsLoading}
            className={`appearance-none pr-6 ${selectorTextClass}`}
          >
            {!isMounted || destinationsLoading ? (
              <option value="">Cargando destinos...</option>
            ) : (
              destinationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))
            )}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-0 bottom-0 h-4 w-4 text-[#6A6A6A]" />
        </div>
      </div>

      <div className="mb-3 w-full md:mb-0 md:contents md:w-auto">
        <div
          className={`relative flex w-full items-center ${selectorContainerClass}`}
        >
          <div
            className="relative flex-1 cursor-pointer px-6 py-4 md:w-[142.5px] md:min-w-[142.5px] md:flex-none md:py-0"
            onClick={handleCheckInClick}
          >
            <div className="absolute top-1/2 right-0 hidden h-[85%] w-px -translate-y-1/2 bg-gray-200 md:block" />
            <div className="pointer-events-none">
              <Input
                label="Entrada"
                value={formatDateDisplay(dateRange.startDate)}
                onChange={() => {
                  /* empty */
                }}
                placeholder="Añade fecha"
                variant="date-dynamic"
                readOnly
                className={`${selectorTextClass} ${activeField === "checkin" ? "text-[#1B1B1B]" : ""}`}
              />
            </div>
          </div>

          <div className="h-8 w-px bg-gray-200 md:hidden" />

          <div
            className="relative flex-1 cursor-pointer px-6 py-4 md:w-[142.5px] md:min-w-[142.5px] md:flex-none md:py-0"
            onClick={handleCheckOutClick}
          >
            <div className="absolute top-1/2 right-0 hidden h-[85%] w-px -translate-y-1/2 bg-gray-200 md:block" />
            <div className="pointer-events-none">
              <Input
                label="Salida"
                value={formatDateDisplay(dateRange.endDate)}
                onChange={() => {
                  /* empty */
                }}
                placeholder="Añade fecha"
                variant="date-dynamic"
                readOnly
                className={`${selectorTextClass} ${activeField === "checkout" ? "text-[#1B1B1B]" : ""}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col sm:flex-row sm:items-center md:w-63.75">
        <div
          className={`mb-3 flex-1 cursor-pointer px-6 py-4 sm:mb-0 md:min-w-45 md:py-0 ${selectorContainerClass}`}
          onClick={handleGuestsClick}
        >
          <div className="pointer-events-none">
            <Input
              label="Huéspedes"
              value={formatGuestsText(guests)}
              onChange={() => {
                /* empty */
              }}
              placeholder="Añade huéspedes"
              readOnly
              className={selectorTextClass}
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full justify-center sm:border-t-0 sm:py-0 md:w-auto md:justify-start"
        >
          <div className="bg-green-normal hover:bg-green-dark flex w-full items-center justify-center gap-3 rounded-[10px] py-4 text-white transition-colors duration-200 md:hidden">
            <Text font="gilroy" className="text-sm">
              Realizar búsqueda
            </Text>
            <span className="bg-green-dark flex h-8 w-8 items-center justify-center rounded-full">
              <MagnifyingGlassIcon className="w-4 text-white" />
            </span>
          </div>

          <CircleButton className="bg-green-normal! hover:bg-green-dark mx-3 hidden h-12 w-12 cursor-pointer transition-colors duration-200 md:flex">
            <MagnifyingGlassIcon className="w-5 text-white drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        </button>
      </div>

      {showCalendar && (
        <div className="absolute top-full left-0 z-50 mt-2 hidden w-full md:right-0 md:left-auto md:block md:w-auto">
          <Calendar
            currentMonth={currentMonth}
            dateRange={dateRange}
            onDateClick={handleDateClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onClearDates={clearDates}
            onClose={closeCalendar}
            showTwoMonths={true}
            className="mx-auto max-w-full"
          />
        </div>
      )}

      {showGuestSelector && (
        <div className="absolute top-full left-0 z-50 mt-2 hidden w-full md:right-0 md:left-auto md:block md:w-80">
          <GuestSelector
            guests={guests}
            maxCapacity={20}
            onGuestsChange={setGuests}
            onClose={closePanels}
          />
        </div>
      )}

      {showMobileSheet && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            aria-label="Cerrar"
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
                  {showCalendar ? "Selecciona tus fechas" : "Selecciona huéspedes"}
                </Text>
                <button
                  type="button"
                  aria-label="Cerrar modal"
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
                    maxCapacity={20}
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
    </form>
  );
};
