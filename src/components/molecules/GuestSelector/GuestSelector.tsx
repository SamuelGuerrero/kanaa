"use client";

import { Minus, Plus } from "lucide-react";

import { Text } from "@/components/atoms";

export type GuestCounts = {
  adults: number;
  children: number;
  infants: number;
};

type GuestSelectorProps = {
  guests: GuestCounts;
  maxCapacity?: number;
  onGuestsChange: (guests: GuestCounts) => void;
  onClose: () => void;
  className?: string;
};

export const GuestSelector = ({
  guests,
  maxCapacity = 10,
  onGuestsChange,
  onClose,
  className = "",
}: GuestSelectorProps) => {
  const totalGuests = guests.adults + guests.children;

  const handleGuestChange = (type: keyof GuestCounts, increment: boolean) => {
    const newValue = increment
      ? guests[type] + 1
      : Math.max(type === "adults" ? 1 : 0, guests[type] - 1);

    const newGuests = { ...guests, [type]: newValue };
    const newTotal = newGuests.adults + newGuests.children;

    // No permitir exceder la capacidad máxima
    if (increment && newTotal > maxCapacity) {
      return;
    }

    onGuestsChange(newGuests);
  };

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-lg ${className}`}
    >
      {/* Adultos */}
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
            type="button"
            onClick={() => handleGuestChange("adults", false)}
            disabled={guests.adults <= 1}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Disminuir adultos"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-medium text-gray-900">
            {guests.adults}
          </span>
          <button
            type="button"
            onClick={() => handleGuestChange("adults", true)}
            disabled={totalGuests >= maxCapacity}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Aumentar adultos"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Niños */}
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
            type="button"
            onClick={() => handleGuestChange("children", false)}
            disabled={guests.children <= 0}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Disminuir niños"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-medium text-gray-900">
            {guests.children}
          </span>
          <button
            type="button"
            onClick={() => handleGuestChange("children", true)}
            disabled={totalGuests >= maxCapacity}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Aumentar niños"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bebés */}
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
            type="button"
            onClick={() => handleGuestChange("infants", false)}
            disabled={guests.infants <= 0}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-colors hover:border-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Disminuir bebés"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-medium text-gray-900">
            {guests.infants}
          </span>
          <button
            type="button"
            onClick={() => handleGuestChange("infants", true)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-gray-900 transition-colors hover:border-gray-900"
            aria-label="Aumentar bebés"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mensaje de capacidad máxima */}
      {totalGuests >= maxCapacity && (
        <div className="mt-2 rounded-lg bg-gray-100 p-3">
          <Text font="gilroy" size="sm" className="text-gray-700">
            En este alojamiento se pueden quedar {maxCapacity}{" "}
            {maxCapacity === 1 ? "huésped" : "huéspedes"} como máximo, sin
            incluir a los bebés.
          </Text>
        </div>
      )}

      {/* Botón cerrar */}
      <div className="mt-3 flex w-full justify-end border-t border-gray-200 pt-3">
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export const formatGuestsText = (guests: GuestCounts): string => {
  const totalGuests = guests.adults + guests.children;
  let text = `${totalGuests} ${totalGuests === 1 ? "huésped" : "huéspedes"}`;

  if (guests.infants > 0) {
    text += `, ${guests.infants} ${guests.infants === 1 ? "bebé" : "bebés"}`;
  }

  return text;
};
