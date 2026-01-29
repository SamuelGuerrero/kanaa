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
      className={`flex h-16 items-center overflow-hidden rounded-full bg-white ${className}`}
      style={{ width: "823px" }}
    >
      <div className="relative px-6" style={{ width: "283px" }}>
        <div className="absolute top-1/2 right-0 h-[85%] w-px -translate-y-1/2 bg-gray-200" />

        <Input
          label="Destino"
          value={destination}
          onChange={setDestination}
          placeholder="Escribe tu destino"
        />
      </div>

      <div className="relative px-6" style={{ width: "142.5px" }}>
        <div className="absolute top-1/2 right-0 h-[85%] w-px -translate-y-1/2 bg-gray-200" />
        <Input
          label="Entrada"
          value={checkIn}
          onChange={setCheckIn}
          placeholder="Añade fecha"
          variant="date-dynamic"
        />
      </div>

      <div className="relative px-6" style={{ width: "142.5px" }}>
        <div className="absolute top-1/2 right-0 h-[85%] w-px -translate-y-1/2 bg-gray-200" />
        <Input
          label="Salida"
          value={checkOut}
          onChange={setCheckOut}
          placeholder="Añade fecha"
          variant="date-dynamic"
        />
      </div>

      <div className="flex items-center" style={{ width: "255px" }}>
        <div className="flex-1 px-6">
          <Input
            label="Huéspedes"
            value={guests}
            onChange={setGuests}
            placeholder="Añade Huéspedes"
          />
        </div>

        <button type="submit">
          <CircleButton className="bg-green-normal! hover:bg-green-dark mx-3 h-12 w-12 cursor-pointer transition-colors duration-200">
            <MagnifyingGlassIcon className="w-5 text-white drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        </button>
      </div>
    </form>
  );
};
