"use client";

import { useEffect, useRef, useState } from "react";

import { Text } from "@/components/atoms";
import { useI18n } from "@/i18n";

export type PropertyType = { id: number; name: string };

/* ── Friendly labels + emoji icons ───────────────────────────────────── */

const TYPE_PRESENTATION: Record<
  string,
  { es: string; en: string; icon: string }
> = {
  Apartment: { es: "Departamento", en: "Apartment", icon: "🏢" },
  House: { es: "Casa", en: "House", icon: "🏠" },
  Condominium: { es: "Condominio", en: "Condominium", icon: "🏘️" },
  Loft: { es: "Loft", en: "Loft", icon: "🌆" },
  Cabin: { es: "Cabaña", en: "Cabin", icon: "🌲" },
  Villa: { es: "Villa", en: "Villa", icon: "🏖️" },
  Hotel: { es: "Hotel", en: "Hotel", icon: "🏨" },
  "Boutique hotel": { es: "Hotel boutique", en: "Boutique hotel", icon: "✨" },
  Bungalow: { es: "Bungalow", en: "Bungalow", icon: "🌴" },
  Cottage: { es: "Cottage", en: "Cottage", icon: "🏡" },
  Townhouse: { es: "Townhouse", en: "Townhouse", icon: "🏘️" },
  Aparthotel: { es: "Aparthotel", en: "Aparthotel", icon: "🏨" },
};

const presentTypeName = (name: string, locale: "es" | "en") =>
  TYPE_PRESENTATION[name]?.[locale] ?? name;

const presentTypeIcon = (name: string) => TYPE_PRESENTATION[name]?.icon ?? "🏠";

/* ── Funnel icon (matching mockup: 3 decreasing horizontal lines) ────── */

const FunnelLinesIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

/* ── Button (trigger) ────────────────────────────────────────────────── */

type PropertyTypeFilterProps = {
  /** Selected type id (applied) */
  value?: number;
  /** Whether the panel is open */
  open: boolean;
  /** Toggle panel visibility */
  onToggle: () => void;
};

export const PropertyTypeFilter = ({
  value,
  open,
  onToggle,
}: PropertyTypeFilterProps) => {
  const { t } = useI18n();
  const isActive = value !== undefined;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-haspopup="dialog"
      aria-expanded={open}
      className={`flex h-14 shrink-0 items-center gap-2 rounded-full border bg-white px-4.5 text-sm font-medium whitespace-nowrap shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors ${
        isActive || open
          ? "border-[1.5px] border-[#2d4a3e] text-[#2d4a3e]"
          : "border-gray-200 text-[#1F1F1F] hover:border-gray-400"
      }`}
    >
      <FunnelLinesIcon className="h-4 w-4 shrink-0" />
      <span>{t("Tipo de propiedad")}</span>
      {isActive && (
        <span className="ml-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#2d4a3e] text-[10px] font-medium text-white">
          1
        </span>
      )}
    </button>
  );
};

/* ── Panel (the popover with the grid of cards) ──────────────────────── */

type PropertyTypeFilterPanelProps = {
  types: PropertyType[];
  loading: boolean;
  /** Currently applied type id */
  value?: number;
  className?: string;
  onApply: (next: number | undefined) => void;
  onClose: () => void;
};

export const PropertyTypeFilterPanel = ({
  types,
  loading,
  value,
  className = "",
  onApply,
  onClose,
}: PropertyTypeFilterPanelProps) => {
  const { t, locale } = useI18n();
  const panelRef = useRef<HTMLDivElement | null>(null);
  // Local draft selection — applied only when user clicks "Aplicar".
  const [selected, setSelected] = useState<number | undefined>(value);

  // Re-sync when the applied value changes externally.
  useEffect(() => setSelected(value), [value]);

  // Click outside to dismiss without applying.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      className={`rounded-[20px] border border-gray-200 bg-white p-6 shadow-[0_8px_32px_rgba(0,0,0,0.10)] ${className}`}
    >
      <Text
        as="p"
        font="gilroy"
        size="xs"
        weight="medium"
        className="mb-3 text-gray-500"
      >
        {t("Elige el tipo de propiedad")}
      </Text>

      {loading && types.length === 0 ? (
        <div className="py-8 text-center">
          <Text as="span" font="gilroy" size="sm" className="text-gray-400">
            {t("Cargando…")}
          </Text>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
          {types.map((type) => {
            const isSelected = selected === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() =>
                  setSelected((prev) =>
                    prev === type.id ? undefined : type.id,
                  )
                }
                className={`flex flex-col items-center gap-1.5 rounded-[14px] border px-2 pt-3.5 pb-3 text-center transition-colors ${
                  isSelected
                    ? "border-[1.5px] border-[#2d4a3e] bg-[#f0f5f2]"
                    : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                <span className="text-2xl leading-none">
                  {presentTypeIcon(type.name)}
                </span>
                <span className="text-[11px] leading-tight font-medium text-[#1F1F1F]">
                  {presentTypeName(type.name, locale)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setSelected(undefined)}
          disabled={selected === undefined}
          className="text-sm font-medium text-gray-500 underline-offset-2 hover:underline disabled:no-underline disabled:opacity-40"
        >
          {t("Limpiar")}
        </button>

        <button
          type="button"
          onClick={() => onApply(selected)}
          className="rounded-full bg-[#2d4a3e] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f3329]"
        >
          {t("Aplicar filtro")}
        </button>
      </div>
    </div>
  );
};
