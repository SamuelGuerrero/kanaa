"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useState, useMemo } from "react";

import { CircleButton, Text } from "@/components/atoms";

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
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  totalNights: number;
  totalPrice: number;
  listingMapId: string;
};

type GuestCounts = {
  adults: number;
  children: number;
  infants: number;
};

const DAYS = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isDateInRange(
  date: Date,
  startDate: Date | null,
  endDate: Date | null,
): boolean {
  if (!startDate || !endDate) return false;
  return date > startDate && date < endDate;
}

function isDateBeforeToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function isDateOccupied(date: Date, occupiedDates: Date[]): boolean {
  return occupiedDates.some((occupiedDate) => isSameDay(date, occupiedDate));
}

export const BookingWidget = ({
  price,
  className = "",
  maxCapacity = 10,
  occupiedDates = [],
  listingMapId,
  onBookingClick,
}: BookingWidgetProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  const [activeField, setActiveField] = useState<"checkin" | "checkout" | null>(
    null,
  );
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const nextMonth = useMemo(() => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    return next;
  }, [currentMonth]);

  const totalNights =
    dateRange.startDate && dateRange.endDate
      ? Math.ceil(
          (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 2;

  const totalGuests = guests.adults + guests.children;
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

  const handleDateClick = (date: Date) => {
    if (isDateBeforeToday(date) || isDateOccupied(date, occupiedDates)) return;

    if (activeField === "checkin") {
      setDateRange({ startDate: date, endDate: null });
      setActiveField("checkout");
    } else if (activeField === "checkout") {
      if (dateRange.startDate && date <= dateRange.startDate) {
        setDateRange({ startDate: date, endDate: null });
        setActiveField("checkout");
      } else {
        setDateRange({ ...dateRange, endDate: date });
        setShowCalendar(false);
        setActiveField(null);
      }
    }
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const clearDates = () => {
    setDateRange({ startDate: null, endDate: null });
    setActiveField(null);
  };

  const handleGuestChange = (type: keyof GuestCounts, increment: boolean) => {
    setGuests((prev) => {
      const newValue = increment
        ? prev[type] + 1
        : Math.max(type === "adults" ? 1 : 0, prev[type] - 1);

      const newGuests = { ...prev, [type]: newValue };
      const newTotal = newGuests.adults + newGuests.children;

      if (increment && newTotal > maxCapacity) {
        return prev;
      }

      return newGuests;
    });
  };

  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <div className="min-w-70 flex-1">
        <h3 className="mb-4 text-center font-semibold text-gray-900">
          {MONTHS[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-10" />;
            }

            const date = new Date(year, month, day);
            const isDisabled = isDateBeforeToday(date);
            const isOccupied = isDateOccupied(date, occupiedDates);
            const isStart =
              dateRange.startDate && isSameDay(date, dateRange.startDate);
            const isEnd =
              dateRange.endDate && isSameDay(date, dateRange.endDate);
            const isInRange = isDateInRange(
              date,
              dateRange.startDate,
              dateRange.endDate,
            );

            const nextDay = new Date(year, month, day);
            nextDay.setDate(nextDay.getDate() - 1);
            const isAfterStart =
              dateRange.startDate && isSameDay(nextDay, dateRange.startDate);

            const prevDay = new Date(year, month, day);
            prevDay.setDate(prevDay.getDate() + 1);
            const isBeforeEnd =
              dateRange.endDate && isSameDay(prevDay, dateRange.endDate);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled || isOccupied}
                className={`relative flex h-10 w-10 items-center justify-center text-sm font-medium transition-all ${isDisabled || isOccupied ? "cursor-not-allowed text-gray-300" : "cursor-pointer hover:border hover:border-gray-900"} ${isStart || isEnd ? "rounded-full bg-gray-900 text-white hover:bg-gray-900" : ""} ${isInRange && !isStart && !isEnd ? "w-[40.5px] bg-gray-100" : ""} ${isInRange && isAfterStart ? "rounded-l-full" : ""} ${isInRange && isBeforeEnd ? "rounded-r-full" : ""} ${isInRange && !isAfterStart && !isBeforeEnd ? "rounded-none" : ""} ${!isStart && !isEnd && !isInRange ? "rounded-full" : ""} ${!isStart && !isEnd && !isInRange && !isDisabled && !isOccupied ? "text-gray-900" : ""} `}
              >
                {day}
                {isOccupied && (
                  <span className="absolute top-1/2 left-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-gray-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
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
                setShowCalendar(true);
                setShowGuestSelector(false);
                setActiveField("checkin");
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
                setShowCalendar(true);
                setShowGuestSelector(false);
                setActiveField("checkout");
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
                setShowCalendar(false);
                setActiveField(null);
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
                  {totalGuests} {totalGuests === 1 ? "huésped" : "huéspedes"}
                  {guests.infants > 0 &&
                    `, ${guests.infants} ${guests.infants === 1 ? "bebé" : "bebés"}`}
                </Text>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-gray-600 transition-transform ${showGuestSelector ? "rotate-90" : ""}`}
              />
            </div>
          </div>
        </figure>

        {showCalendar && (
          <div className="absolute right-0 z-50 mt-2 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handlePrevMonth}
                className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-8">
              {renderMonth(currentMonth)}
              {renderMonth(nextMonth)}
            </div>

            <div className="mt-4 flex justify-end space-x-3 border-t border-gray-200 pt-4">
              <button
                onClick={clearDates}
                className="cursor-pointer text-sm font-semibold underline transition-colors hover:text-gray-900"
              >
                Borrar fechas
              </button>

              <button
                className="cursor-pointer rounded-lg bg-black px-4 py-1 text-sm text-white"
                onClick={() => {
                  setShowCalendar(false);
                  setActiveField(null);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {showGuestSelector && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between py-4">
              <div>
                <Text font="gilroy" size="base" weight="semibold">
                  Adultos
                </Text>
                <Text font="gilroy" size="sm" className="text-gray-600">
                  13 años o más
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGuestChange("adults", false)}
                  disabled={guests.adults <= 1}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-medium">
                  {guests.adults}
                </span>
                <button
                  onClick={() => handleGuestChange("adults", true)}
                  disabled={totalGuests >= maxCapacity}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 py-4">
              <div>
                <Text font="gilroy" size="base" weight="semibold">
                  Niños
                </Text>
                <Text font="gilroy" size="sm" className="text-gray-600">
                  De 2 a 12 años
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGuestChange("children", false)}
                  disabled={guests.children <= 0}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-medium">
                  {guests.children}
                </span>
                <button
                  onClick={() => handleGuestChange("children", true)}
                  disabled={totalGuests >= maxCapacity}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 py-4">
              <div>
                <Text font="gilroy" size="base" weight="semibold">
                  Bebés
                </Text>
                <Text font="gilroy" size="sm" className="text-gray-600">
                  Menores de 2 años
                </Text>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleGuestChange("infants", false)}
                  disabled={guests.infants <= 0}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center font-medium">
                  {guests.infants}
                </span>
                <button
                  onClick={() => handleGuestChange("infants", true)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 transition-colors hover:border-gray-900"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {totalGuests >= maxCapacity && (
              <div className="mt-2 rounded-lg bg-gray-100 p-3">
                <Text font="gilroy" size="sm" className="text-gray-700">
                  En este alojamiento se pueden quedar {maxCapacity}{" "}
                  {maxCapacity === 1 ? "huésped" : "huéspedes"} como máximo, sin
                  incluir a los bebés.
                </Text>
              </div>
            )}

            <div className="mt-3 flex w-full justify-end">
              <button
                className="cursor-pointer rounded-lg bg-black px-4 py-1 text-sm text-white"
                onClick={() => {
                  setShowGuestSelector(false);
                }}
              >
                Cerrar
              </button>
            </div>
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
