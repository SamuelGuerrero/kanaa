"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

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

export type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type CalendarProps = {
  currentMonth: Date;
  dateRange: DateRange;
  occupiedDates?: Date[];
  onDateClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onClearDates: () => void;
  onClose: () => void;
  showTwoMonths?: boolean;
  showButtons?: boolean;
  className?: string;
};

export const Calendar = ({
  currentMonth,
  dateRange,
  occupiedDates = [],
  onDateClick,
  onPrevMonth,
  onNextMonth,
  onClearDates,
  onClose,
  showTwoMonths = true,
  showButtons,
  className = "",
}: CalendarProps) => {
  const nextMonth = useMemo(() => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    return next;
  }, [currentMonth]);

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
      <div className="w-full sm:min-w-70 sm:flex-1">
        <h3 className="mb-4 text-center font-semibold text-gray-900">
          {MONTHS[month]} {year}
        </h3>
        <div className="grid grid-cols-7 gap-x-0 gap-y-1">
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

            const hasStartAndEnd = Boolean(
              dateRange.startDate && dateRange.endDate,
            );

            return (
              <div
                key={day}
                className="relative flex h-10 items-center justify-center"
              >
                {isInRange && (
                  <span className="absolute inset-y-0 right-0 left-0 bg-gray-100" />
                )}
                {isStart && hasStartAndEnd && (
                  <span className="absolute inset-y-0 right-0 w-1/2 bg-gray-100" />
                )}
                {isEnd && hasStartAndEnd && (
                  <span className="absolute inset-y-0 left-0 w-1/2 bg-gray-100" />
                )}

                <button
                  type="button"
                  onClick={() => onDateClick(date)}
                  disabled={isDisabled || isOccupied}
                  className={`relative z-10 flex h-10 w-10 items-center justify-center text-sm font-medium transition-all duration-200 ease-out ${
                    isDisabled || isOccupied
                      ? "cursor-not-allowed text-gray-300"
                      : "cursor-pointer hover:scale-105 hover:border hover:border-gray-900"
                  } ${
                    isStart || isEnd
                      ? "rounded-full bg-gray-900 text-white hover:bg-gray-900"
                      : ""
                  } ${
                    isInRange && !isStart && !isEnd ? "text-gray-900" : ""
                  } ${!isStart && !isEnd && !isInRange ? "rounded-full" : ""} ${
                    !isStart &&
                    !isEnd &&
                    !isInRange &&
                    !isDisabled &&
                    !isOccupied
                      ? "text-gray-900"
                      : ""
                  }`}
                >
                  {day}
                  {isOccupied && (
                    <span className="absolute top-1/2 left-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-gray-400" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-lg ${className}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="cursor-pointer rounded-full p-2 text-gray-900 transition-all duration-200 ease-out hover:scale-105 hover:bg-gray-100"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onNextMonth}
          className="cursor-pointer rounded-full p-2 text-gray-900 transition-all duration-200 ease-out hover:scale-105 hover:bg-gray-100"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-8">
        {renderMonth(currentMonth)}
        {showTwoMonths && (
          <div className="hidden sm:contents">{renderMonth(nextMonth)}</div>
        )}
      </div>

      <div
        className={`mt-4 flex justify-end space-x-3 border-t border-gray-200 pt-4 ${showButtons ? "" : "hidden"}`}
      >
        <button
          type="button"
          onClick={onClearDates}
          className="cursor-pointer text-sm font-semibold underline transition-colors hover:text-gray-900"
        >
          Borrar fechas
        </button>

        <button
          type="button"
          className="cursor-pointer rounded-lg bg-black px-4 py-1 text-sm text-white hover:bg-gray-800"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export { isSameDay, isDateBeforeToday, isDateOccupied, isDateInRange };
