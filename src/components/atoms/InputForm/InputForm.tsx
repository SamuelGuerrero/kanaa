import { forwardRef, type InputHTMLAttributes } from "react";

import { Text } from "@/components/atoms";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  wrapperClassName?: string;
};

export const InputForm = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={wrapperClassName}>
        {label && (
          <Text
            font="gilroy"
            size="sm"
            weight="medium"
            className="mb-1 block text-white"
          >
            {label}
          </Text>
        )}

        <input
          ref={ref}
          className={`font-gilroy w-70.25 rounded-[10px] border border-white/20 bg-white/10 px-4 text-[16.33px] font-semibold text-white placeholder-white/75 transition outline-none focus:border-[#CBBE99] focus:bg-white/20 focus:ring-2 focus:ring-[#CBBE99]/25 md:h-13.5 ${error ? "border-red-300" : ""} ${className ?? ""} `}
          {...props}
        />

        {error && (
          <Text size="xs" font="gilroy" className="mt-1 text-red-200">
            {error}
          </Text>
        )}
      </div>
    );
  },
);

InputForm.displayName = "InputForm";
