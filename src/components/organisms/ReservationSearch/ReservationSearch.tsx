"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState, type FormEvent } from "react";

import { CircleButton } from "@/components/atoms";
import { Input } from "@/components/molecules";

export type SearchFilters = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: string;
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
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    onSearch?.({
      destination,
      checkIn,
      checkOut,
      guests,
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`flex h-92 w-[95%] flex-col items-center overflow-hidden rounded-xl bg-white text-left shadow-lg md:h-16 md:w-205.75 md:flex-row md:gap-0 md:rounded-full md:p-0 md:shadow-none ${className ?? ""}`}
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

      <div className="relative w-full border-b border-b-gray-300 px-6 py-4 md:w-[142.5px] md:border-b-0 md:py-0">
        <div className="absolute top-1/2 right-0 hidden h-[85%] w-px -translate-y-1/2 bg-gray-200 md:block" />
        <Input
          label="Entrada"
          value={checkIn}
          onChange={setCheckIn}
          placeholder="Añade fecha"
          variant="date-dynamic"
        />
      </div>

      <div className="relative w-full border-b border-b-gray-300 px-6 py-4 md:w-[142.5px] md:border-b-0 md:py-0">
        <div className="absolute top-1/2 right-0 hidden h-[85%] w-px -translate-y-1/2 bg-gray-200 md:block" />
        <Input
          label="Salida"
          value={checkOut}
          onChange={setCheckOut}
          placeholder="Añade fecha"
          variant="date-dynamic"
        />
      </div>

      <div className="flex w-full flex-col sm:flex-row sm:items-center md:w-63.75">
        <div className="flex-1 px-6 py-4 md:py-0">
          <Input
            label="Huéspedes"
            value={guests}
            onChange={setGuests}
            placeholder="Añade Huéspedes"
          />
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
    </form>
  );
};
