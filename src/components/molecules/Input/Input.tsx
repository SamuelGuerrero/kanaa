import { Text } from "@/components/atoms";

import type { DetailedHTMLProps, FocusEvent, InputHTMLAttributes } from "react";

type InputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "value" | "onChange"
> & {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: "text" | "date-dynamic";
};

export const Input = ({
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  variant = "text",
  className = "",
  onFocus,
  onBlur,
  ...rest
}: InputProps) => {
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

  return (
    <div>
      {label && (
        <Text
          font="gilroy"
          size="xs"
          weight="medium"
          className="block text-black"
        >
          {label}
        </Text>
      )}

      <input
        type={variant === "date-dynamic" ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`text-gilroy w-full overflow-scroll bg-transparent text-sm text-gray-600 placeholder-[#6A6A6A] transition-colors duration-150 outline-none focus:text-gray-900 focus:placeholder:text-gray-400 ${className}`}
        {...rest}
      />
    </div>
  );
};
