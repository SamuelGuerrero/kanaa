"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { CircleButton, Text } from "@/components/atoms";
import {
  Calendar,
  GuestSelector,
  formatGuestsText,
  type GuestCounts,
} from "@/components/molecules";
import { useCalendar } from "@/hooks/useCalendar";

import { Button } from "../Button";

type BookingWidgetProps = {
  price: number;
  className?: string;
  maxCapacity?: number;
  occupiedDates?: Date[];
  listingMapId: string;
  onBookingClick?: (bookingData: BookingData) => void;
};

export type BookingData = {
  startDate: Date | null;
  endDate: Date | null;
  guests: GuestCounts;
  totalNights: number;
  totalPrice: number;
  listingMapId: string;
};

export const BookingWidget = ({
  price,
  className = "",
  maxCapacity = 10,
  occupiedDates = [],
  listingMapId,
  onBookingClick,
}: BookingWidgetProps) => {
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

  const totalNights =
    dateRange.startDate && dateRange.endDate
      ? Math.ceil(
          (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 2;

  const totalPrice = price * totalNights;

  const handleBookingClick = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Por favor selecciona las fechas de tu estadía");
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
    if (!date) return "Añadir fecha";
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <figure
      className={`bg-green-normal h-auto w-154 rounded-[10px] px-12.5 py-10 ${className}`}
    >
      <div className="flex space-x-2.5">
        <Text size="4xl" font="gilroy" weight="bold" className="text-white">
          ${new Intl.NumberFormat("es-MX").format(totalPrice)} MXN
        </Text>
        <Text size="lg" font="gilroy" className="mt-2.5 text-white">
          por {totalNights} {totalNights === 1 ? "noche" : "noches"}
        </Text>
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
                  {formatGuestsText(guests)}
                </Text>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-gray-600 transition-transform ${showGuestSelector ? "rotate-90" : ""}`}
              />
            </div>
          </div>
        </figure>

        {showCalendar && (
          <div className="absolute right-0 z-50 mt-2">
            <Calendar
              currentMonth={currentMonth}
              dateRange={dateRange}
              occupiedDates={occupiedDates}
              onDateClick={(date) => handleDateClick(date, occupiedDates)}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onClearDates={clearDates}
              onClose={closeCalendar}
              showTwoMonths={true}
            />
          </div>
        )}

        {showGuestSelector && (
          <div className="absolute z-50 mt-2 w-full">
            <GuestSelector
              guests={guests}
              maxCapacity={maxCapacity}
              onGuestsChange={setGuests}
              onClose={() => setShowGuestSelector(false)}
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex w-full flex-col items-center">
        <Button
          variant="secondary"
          textClassName="text-base font-medium"
          className="w-fit"
          onClick={handleBookingClick}
          icon={
            <CircleButton className="bg-gold-light-active!">
              <ArrowRightIcon className="text-gold-dark w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Reserva ahora
        </Button>

        <Text
          font="gilroy"
          size="sm"
          weight="medium"
          className="mt-4 text-center text-white"
        >
          Aún no se te cobrará nada
        </Text>
      </div>
    </figure>
  );
};
