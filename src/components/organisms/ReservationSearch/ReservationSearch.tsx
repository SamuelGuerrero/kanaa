"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState, type FormEvent } from "react";

import { CircleButton } from "@/components/atoms";
import {
  Calendar,
  Input,
  GuestSelector,
  formatGuestsText,
  type GuestCounts,
} from "@/components/molecules";
import { useCalendar } from "@/hooks/useCalendar";

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
};

export const ReservationSearch = ({
  className,
  onSearch,
}: ReservationSearchProps) => {
  const [destination, setDestination] = useState("");
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
  });

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
  } = useCalendar();

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
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

  return (
    <form
      onSubmit={handleSearch}
      className={`relative flex h-92 w-[95%] flex-col items-center overflow-visible rounded-xl bg-white text-left shadow-lg md:h-16 md:w-205.75 md:flex-row md:gap-0 md:rounded-full md:p-0 md:shadow-none ${className ?? ""}`}
    >
      <div className="relative w-full border-b border-b-gray-300 px-6 py-4 md:w-70.75 md:border-b-0 md:py-0">
        <div className="absolute top-1/2 right-0 hidden h-[85%] w-px -translate-y-1/2 bg-gray-200 md:block" />

        <Input
          label="Destino"
          value={destination}
          onChange={setDestination}
          placeholder="Escribe tu destino"
        />
      </div>

      <div
        className="relative w-full cursor-pointer border-b border-b-gray-300 px-6 py-4 md:w-[142.5px] md:border-b-0 md:py-0"
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
            className={activeField === "checkin" ? "bg-gray-50" : ""}
          />
        </div>
      </div>

      <div
        className="relative w-full cursor-pointer border-b border-b-gray-300 px-6 py-4 md:w-[142.5px] md:border-b-0 md:py-0"
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
            className={activeField === "checkout" ? "bg-gray-50" : ""}
          />
        </div>
      </div>

      <div className="flex w-full flex-col sm:flex-row sm:items-center md:w-63.75">
        <div
          className="flex-1 cursor-pointer px-6 py-4 md:py-0"
          onClick={handleGuestsClick}
        >
          <div className="pointer-events-none">
            <Input
              label="Huéspedes"
              value={formatGuestsText(guests)}
              onChange={() => {
                /* empty */
              }}
              placeholder="Añade Huéspedes"
              readOnly
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full justify-center border-t border-t-gray-300 py-4 sm:border-t-0 sm:py-0 md:w-auto md:justify-start"
        >
          <CircleButton className="bg-green-normal! hover:bg-green-dark mx-3 h-12 w-12 cursor-pointer transition-colors duration-200">
            <MagnifyingGlassIcon className="w-5 text-white drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        </button>
      </div>

      {/* Calendario flotante */}
      {showCalendar && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full md:right-0 md:left-auto md:w-auto">
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

      {/* Selector de huéspedes */}
      {showGuestSelector && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full md:right-0 md:left-auto md:w-80">
          <GuestSelector
            guests={guests}
            maxCapacity={20}
            onGuestsChange={setGuests}
            onClose={() => setShowGuestSelector(false)}
          />
        </div>
      )}
    </form>
  );
};
