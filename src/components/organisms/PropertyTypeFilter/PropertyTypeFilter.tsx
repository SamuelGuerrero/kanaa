"use client";

import { HomeModernIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

import { Text } from "@/components/atoms";
import { useI18n } from "@/i18n";

type PropertyType = { id: number; name: string };

const PROPERTY_TYPE_ES: Record<string, string> = {
  Apartment: "Apartamento",
  House: "Casa",
  Condo: "Condominio",
  Condominium: "Condominio",
  Villa: "Villa",
  Cabin: "Cabaña",
  Cottage: "Cabaña",
  Studio: "Estudio",
  Townhouse: "Casa adosada",
  Loft: "Loft",
  Penthouse: "Penthouse",
  Resort: "Resort",
  Hotel: "Hotel",
  "Guest House": "Casa de huéspedes",
  Guesthouse: "Casa de huéspedes",
  Bungalow: "Bungalow",
  Chalet: "Chalet",
  Hostel: "Hostal",
  "Bed and Breakfast": "Bed & Breakfast",
  Farm: "Granja",
  Boat: "Barco",
  Camper: "Autocaravana",
  Tent: "Tienda de campaña",
  Other: "Otro",
};

type PropertyTypeFilterProps = {
  /** Currently selected propertyTypeId, or undefined for "All" */
  value?: number;
  /** Called when the user picks a type or clears the filter */
  onChange: (next: number | undefined) => void;
};

export const PropertyTypeFilter = ({
  value,
  onChange,
}: PropertyTypeFilterProps) => {
  const { t, locale } = useI18n();
  const translateType = (name: string) =>
    locale === "es" ? (PROPERTY_TYPE_ES[name] ?? name) : name;
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Fetch types once on mount. The endpoint is server-cached for an hour so
  // the cost is negligible, and avoiding a strict-mode re-entrance loop on
  // the popover is worth the small upfront request.
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);
    fetch("/api/hostaway/property-types", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP"))))
      .then((data: { result?: PropertyType[] }) => {
        if (!cancelled) setTypes(data.result ?? []);
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        console.error("PropertyTypeFilter:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectedLabel = (() => {
    const found = types.find((type) => type.id === value);
    return found ? translateType(found.name) : undefined;
  })();

  return (
    <div ref={popoverRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
          value
            ? "border-green-normal bg-green-normal text-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-green-normal hover:text-green-normal"
        }`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <HomeModernIcon className="h-4 w-4" />
        <span>{t("Tipo de propiedad")}</span>
        {value && selectedLabel && (
          <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
            1
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
        >
          <Text
            as="p"
            font="gilroy"
            size="xs"
            weight="semibold"
            className="mb-3 uppercase tracking-wide text-gray-500"
          >
            {t("Tipo de propiedad")}
          </Text>

          <div className="relative">
            <select
              value={value ?? ""}
              onChange={(e) => {
                const raw = e.target.value;
                onChange(raw === "" ? undefined : Number(raw));
                setOpen(false);
              }}
              disabled={loading}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-sm focus:border-green-normal focus:outline-none disabled:opacity-60"
            >
              <option value="">
                {loading ? t("Cargando…") : t("Todos los tipos")}
              </option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {translateType(type.name)}
                </option>
              ))}
            </select>
          </div>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              className="mt-3 text-xs font-medium text-green-normal underline-offset-2 hover:underline"
            >
              {t("Limpiar filtros")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
