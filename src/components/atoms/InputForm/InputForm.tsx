"use client";

import {
  forwardRef,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
} from "react";

import { Text } from "@/components/atoms";
import { useI18n } from "@/i18n";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

export const InputForm = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, wrapperClassName, ...props }, ref) => {
    const { t } = useI18n();
    const isPhoneInput = props.type === "tel";
    const { onChange, onFocus, onBlur, ...restProps } = props;

    const formatPhoneValue = (raw: string) => {
      const [rawMain] = raw.split(/(?:ext\.?|x)/i);
      const extensionMatch = /(?:ext\.?|x)\s*(\d*)/i.exec(raw);
      const extension = (extensionMatch?.[1] ?? "")
        .replace(/\D/g, "")
        .slice(0, 6);

      const mainInput = (rawMain ?? "").trim();
      const hasPlusPrefix = mainInput.startsWith("+");
      const onlyDigits = mainInput.replace(/\D/g, "");

      let countryDigits = "";
      let localDigits = onlyDigits;

      if (hasPlusPrefix) {
        if (onlyDigits.startsWith("52")) {
          countryDigits = "52";
          localDigits = onlyDigits.slice(2);
        } else {
          countryDigits = onlyDigits.slice(0, 3);
          localDigits = onlyDigits.slice(countryDigits.length);
        }
      } else if (onlyDigits.startsWith("52") && onlyDigits.length > 10) {
        countryDigits = "52";
        localDigits = onlyDigits.slice(2);
      }

      localDigits = localDigits.slice(0, 10);

      const hasTwoDigitLada =
        localDigits.startsWith("55") ||
        localDigits.startsWith("33") ||
        localDigits.startsWith("81");
      const localFormatted = hasTwoDigitLada
        ? localDigits.length <= 2
          ? localDigits
          : localDigits.length <= 6
            ? `${localDigits.slice(0, 2)} ${localDigits.slice(2)}`
            : `${localDigits.slice(0, 2)} ${localDigits.slice(2, 6)} ${localDigits.slice(6)}`
        : localDigits.length <= 3
          ? localDigits
          : localDigits.length <= 6
            ? `${localDigits.slice(0, 3)} ${localDigits.slice(3)}`
            : `${localDigits.slice(0, 3)} ${localDigits.slice(3, 6)} ${localDigits.slice(6)}`;

      const prefix = countryDigits ? `+${countryDigits}` : "";
      const main = prefix
        ? `${prefix}${localFormatted ? ` ${localFormatted}` : ""}`
        : localFormatted;

      return extension ? `${main} ext. ${extension}` : main;
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (isPhoneInput) {
        event.target.value = formatPhoneValue(event.target.value);
      }
      onChange?.(event);
    };

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      if (isPhoneInput && !event.target.value.trim()) {
        event.target.value = "+52 ";
        onChange?.(event as unknown as ChangeEvent<HTMLInputElement>);
      }
      onFocus?.(event);
    };

    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      if (isPhoneInput) {
        const rawValue = event.target.value.trim();
        if (
          rawValue === "+52" ||
          rawValue === "+52 ext." ||
          rawValue === "+52 ext"
        ) {
          event.target.value = "";
          onChange?.(event as unknown as ChangeEvent<HTMLInputElement>);
        }
      }
      onBlur?.(event);
    };

    return (
      <div className={wrapperClassName}>
        {label && (
          <Text
            font="gilroy"
            size="sm"
            weight="medium"
            className="mb-1 block text-white"
          >
            {t(label)}
          </Text>
        )}

        <input
          ref={ref}
          className={`font-gilroy w-70.25 bg-white/10 px-4 text-[16.33px] font-semibold text-white placeholder-white transition outline-none focus:border-[#CBBE99] focus:bg-white/20 focus:ring-2 focus:ring-[#CBBE99]/25 md:h-13.5 ${isPhoneInput ? "appearance-none tracking-[0.02em] [font-variant-numeric:tabular-nums]" : ""} ${error ? "border border-red-300" : ""} ${className ?? ""} `}
          placeholder={
            props.placeholder ? t(String(props.placeholder)) : undefined
          }
          {...restProps}
          inputMode={isPhoneInput ? "tel" : props.inputMode}
          autoComplete={isPhoneInput ? "tel" : props.autoComplete}
          dir={isPhoneInput ? "ltr" : props.dir}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {error && (
          <Text size="xs" font="gilroy" className="mt-1 text-red-200">
            {t(error)}
          </Text>
        )}
      </div>
    );
  },
);

InputForm.displayName = "InputForm";
