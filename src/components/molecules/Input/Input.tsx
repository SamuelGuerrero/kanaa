"use client";

import { Text } from "@/components/atoms";
import { useI18n } from "@/i18n";

import type { DetailedHTMLProps, FocusEvent, InputHTMLAttributes } from "react";

type FontSize =
  | "xxs"
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl";
type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";

type InputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "value" | "onChange"
> & {
  label?: string;
  labelClassName?: string;
  labelSize?: FontSize;
  labelWeight?: FontWeight;
  value: string;
  onChange?: (value: string) => void;
  variant?: "text" | "date-dynamic";
  nonEditable?: boolean;
};

export const Input = ({
  value,
  onChange,
  placeholder,
  label,
  labelClassName = "",
  labelSize = "xs",
  labelWeight = "medium",
  type = "text",
  variant = "text",
  className = "",
  nonEditable = false,
  onFocus,
  onBlur,
  ...rest
}: InputProps) => {
  const { t } = useI18n();

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (variant === "date-dynamic") {
      e.currentTarget.type = "date";
    }
    onFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (variant === "date-dynamic" && !e.currentTarget.value) {
      e.currentTarget.type = "text";
    }
    onBlur?.(e);
  };

  if (nonEditable) {
    return (
      <div>
        {label && (
          <Text
            font="gilroy"
            size={labelSize}
            weight={labelWeight}
            className={`block text-black ${labelClassName}`}
          >
            {label}
          </Text>
        )}
        <Text
          font="gilroy"
          size="base"
          weight="medium"
          className={`text-green-darker ${className}`}
        >
          {value || placeholder ?? "—"}
        </Text>
      </div>
    );
  }

  return (
    <div>
      {label && (
        <Text
          font="gilroy"
          size={labelSize}
          weight={labelWeight}
          className={`block text-black ${labelClassName}`}
        >
          {label}
        </Text>
      )}

      <input
        type={variant === "date-dynamic" ? "text" : type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder ? t(placeholder) : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full bg-transparent outline-none ${className}`}
        {...rest}
      />
    </div>
  );
};
