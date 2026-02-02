import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { forwardRef, type SelectHTMLAttributes } from "react";

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
    return (
      <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            defaultValue=""
            className={`font-gilroy h-13.75 w-145.25 appearance-none bg-white/10 px-4 pr-12 text-[16.33px] font-bold text-white transition outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? "border-red-500" : "border-gray-300"
            } ${className}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          >
            {defaultOptionLabel && (
              <option value="" disabled>
                {defaultOptionLabel}
              </option>
            )}

            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDownIcon
            className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </div>

        {error && (
          <span
            id={`${props.id}-error`}
            className="text-xs text-red-600"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  },
);

SelectForm.displayName = "SelectForm";
