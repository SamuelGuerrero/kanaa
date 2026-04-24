"use client";

import { useState } from "react";

const CATEGORIES = [
  "Todos",
  "Para viajeros",
  "Para propietarios",
  "Lifestyle",
  "Mérida",
  "Gestión",
];

type BlogFiltersProps = {
  onFilter?: (category: string) => void;
};

export function BlogFilters({ onFilter }: BlogFiltersProps) {
  const [active, setActive] = useState("Todos");
  const [search, setSearch] = useState("");

  const handleCategory = (cat: string) => {
    setActive(cat);
    onFilter?.(cat);
  };

  return (
    <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-gold-light-active pt-8">
      {/* Category pills */}
      <ul className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <button
              onClick={() => handleCategory(cat)}
              className={`rounded-full border px-[18px] py-2.5 text-sm font-medium font-gilroy transition-all duration-200 ${
                active === cat
                  ? "border-green-dark-active bg-green-dark-active text-gold-light"
                  : "border-gold-light-active text-beige-darker hover:border-green-dark-active hover:text-green-dark-active"
              }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* Search */}
      <div className="relative w-[280px]">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-beige-dark"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Buscar artículos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-gold-light-active bg-transparent py-3 pl-11 pr-4 font-gilroy text-sm text-green-dark-active placeholder:text-beige-dark focus:border-green-dark-active focus:outline-none"
        />
      </div>
    </div>
  );
}
