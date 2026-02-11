"use client";

import { useState, useCallback } from "react";

import type { DateRange } from "@/components/molecules";

type ActiveField = "checkin" | "checkout" | null;

export const useCalendar = (initialMonth: Date = new Date()) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [activeField, setActiveField] = useState<ActiveField>(null);

  const handleDateClick = useCallback(
    (date: Date, occupiedDates: Date[] = []) => {
      // Verificar si la fecha está disponible
      const isOccupied = occupiedDates.some(
        (occupiedDate) => occupiedDate.toDateString() === date.toDateString(),
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
          setShowCalendar(false);
          setActiveField(null);
        }
      }
    },
    [activeField, dateRange],
  );

  const handlePrevMonth = useCallback(() => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  }, [currentMonth]);

  const clearDates = useCallback(() => {
    setDateRange({ startDate: null, endDate: null });
    setActiveField(null);
  }, []);

  const openCalendar = useCallback((field: ActiveField) => {
    setShowCalendar(true);
    setActiveField(field);
  }, []);

  const closeCalendar = useCallback(() => {
    setShowCalendar(false);
    setActiveField(null);
  }, []);

  return {
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
  };
};
