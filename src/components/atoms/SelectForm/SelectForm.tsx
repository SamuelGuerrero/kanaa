"use client";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { forwardRef, type SelectHTMLAttributes } from "react";

import { Text } from "@/components/atoms";
import { useI18n } from "@/i18n";

type SelectOption = {
  label: string;
  value: string | number;
};

type SelectFormProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  wrapperClassName?: string;
  defaultOptionLabel?: string;
};

export const SelectForm = forwardRef<HTMLSelectElement, SelectFormProps>(
  (
    {
      label,
      error,
      options,
      className = "",
      wrapperClassName = "",
      defaultOptionLabel,
      ...props
    },
    ref,
  ) => {
    const { t } = useI18n();

    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        {label && (
          <Text font="gilroy" size="sm" weight="medium" className="text-white">
            {t(label)}
          </Text>
        )}
        <div className="relative">
          <select
            ref={ref}
            defaultValue=""
            className={`font-gilroy ms:w-145.25 appearance-none rounded-[10px] border border-white/20 bg-white/10 px-4 pr-12 text-[16.33px] font-semibold text-white transition outline-none focus:border-[#CBBE99] focus:ring-2 focus:ring-[#CBBE99]/25 disabled:cursor-not-allowed disabled:opacity-50 md:h-13.75 ${
              error ? "border-red-300" : ""
            } ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          >
            {defaultOptionLabel && (
              <option value="" disabled>
                {t(defaultOptionLabel)}
              </option>
            )}

            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>

          <ChevronDownIcon className="text-grey-light pointer-events-none absolute top-1/2 right-4 h-7 w-7 -translate-y-1/2" />
        </div>

        {error && (
          <Text id={`${props.id}-error`} size="xs" className="text-red-200">
            {t(error)}
          </Text>
        )}
      </div>
    );
  },
);

SelectForm.displayName = "SelectForm";
