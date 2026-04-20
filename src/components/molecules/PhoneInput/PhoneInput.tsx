"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Text } from "@/components/atoms";

type Country = {
  code: string;
  dial: string;
  flag: string;
  label: string;
};

const PHONE_COUNTRIES: Country[] = [
  { code: "MX", dial: "+52", flag: "🇲🇽", label: "México" },
  { code: "US", dial: "+1", flag: "🇺🇸", label: "Estados Unidos" },
  { code: "CA", dial: "+1", flag: "🇨🇦", label: "Canadá" },
  { code: "ES", dial: "+34", flag: "🇪🇸", label: "España" },
  { code: "CO", dial: "+57", flag: "🇨🇴", label: "Colombia" },
  { code: "AR", dial: "+54", flag: "🇦🇷", label: "Argentina" },
  { code: "BR", dial: "+55", flag: "🇧🇷", label: "Brasil" },
  { code: "CL", dial: "+56", flag: "🇨🇱", label: "Chile" },
  { code: "PE", dial: "+51", flag: "🇵🇪", label: "Perú" },
];

type PhoneFormat = {
  maxDigits: number;
  format: (digits: string) => string;
  placeholder: string;
};

const PHONE_FORMATS: Record<string, PhoneFormat> = {
  MX: {
    maxDigits: 10,
    format: (d) =>
      [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join("-"),
    placeholder: "555-123-4567",
  },
  US: {
    maxDigits: 10,
    format: (d) =>
      [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join("-"),
    placeholder: "555-867-5309",
  },
  CA: {
    maxDigits: 10,
    format: (d) =>
      [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join("-"),
    placeholder: "555-867-5309",
  },
  ES: {
    maxDigits: 9,
    format: (d) =>
      [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)].filter(Boolean).join("-"),
    placeholder: "612-345-678",
  },
  CO: {
    maxDigits: 10,
    format: (d) =>
      [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join("-"),
    placeholder: "310-567-8901",
  },
  AR: {
    maxDigits: 10,
    format: (d) =>
      [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join("-"),
    placeholder: "911-234-5678",
  },
  BR: {
    maxDigits: 11,
    format: (d) =>
      [d.slice(0, 2), d.slice(2, 7), d.slice(7, 11)].filter(Boolean).join("-"),
    placeholder: "11-98765-4321",
  },
  CL: {
    maxDigits: 9,
    format: (d) =>
      [d.slice(0, 1), d.slice(1, 5), d.slice(5, 9)].filter(Boolean).join("-"),
    placeholder: "9-1234-5678",
  },
  PE: {
    maxDigits: 9,
    format: (d) =>
      [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9)].filter(Boolean).join("-"),
    placeholder: "987-654-321",
  },
};

type PhoneInputProps = {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  nonEditable?: boolean;
};

export const PhoneInput = ({
  label,
  value,
  onChange,
  error,
  nonEditable = false,
}: PhoneInputProps) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    PHONE_COUNTRIES[0]!,
  );

  const fmt = PHONE_FORMATS[selectedCountry.code] ?? PHONE_FORMATS.MX!;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, fmt.maxDigits);
    const formatted = fmt.format(digits);
    onChange?.(digits ? `${selectedCountry.dial} ${formatted}` : "");
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = PHONE_COUNTRIES.find((c) => c.code === e.target.value);
    if (country) {
      setSelectedCountry(country);
      onChange?.("");
    }
  };

  if (nonEditable) {
    return (
      <div>
        {label && (
          <Text
            font="gilroy"
            size="base"
            weight="bold"
            className="text-green-darker leading-5"
          >
            {label}
          </Text>
        )}
        <div className="flex items-center gap-2">
          <span className="inline-block h-5.25 w-7.25 text-[21px] leading-none">
            {selectedCountry.flag}
          </span>
          <Text
            font="gilroy"
            size="base"
            weight="medium"
            className="text-green-darker"
          >
            {value || "—"}
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      {label && (
        <Text
          font="gilroy"
          size="base"
          weight="bold"
          className="text-green-darker leading-5"
        >
          {label}
        </Text>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex shrink-0 items-center">
          <div className="flex items-center gap-0.5 rounded-[10px] bg-[#F4F4F3] px-1.25 py-1.25">
            <ChevronDown
              className="text-green-normal h-3.5 w-3.5 shrink-0"
              strokeWidth={2}
            />
            <span className="inline-block h-5.25 w-7.25 text-[21px] leading-none">
              {selectedCountry.flag}
            </span>
          </div>
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Seleccionar país"
          >
            {PHONE_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.label} ({c.dial})
              </option>
            ))}
          </select>
        </div>

        <input
          type="tel"
          inputMode="numeric"
          value={value.replace(`${selectedCountry.dial} `, "")}
          onChange={handleChange}
          placeholder={fmt.placeholder}
          className="font-gilroy text-green-darker w-full bg-transparent text-base leading-4.75 font-medium placeholder-[#6A6A6A] outline-none"
        />
      </div>

      {error && (
        <Text font="gilroy" size="xs" className="mt-1 text-red-500">
          {error}
        </Text>
      )}
    </div>
  );
};
