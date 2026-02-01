import { ChevronDownIcon } from "@heroicons/react/24/solid";
import * as React from "react";

type SelectOption = {
    label: string;
    value: string | number;
};

type SelectFormProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    options: SelectOption[];
    wrapperClassName?: string;
    defaultOptionLabel?: string;
};

export const SelectForm = React.forwardRef<
    HTMLSelectElement,
    SelectFormProps
>(
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
        ref
    ) => {
        return (
            <div className={`flex flex-col gap-1 ${wrapperClassName}  `}>
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        defaultValue=""
                        className={`h-13.75 w-145.25 font-gilroy font-bold text-[16.33px] px-4 text-white outline-none  bg-white/10 transition appearance-none  ${className}`}
                        {...props}
                    >
                        {defaultOptionLabel && (
                            <option value="" disabled hidden>
                                {defaultOptionLabel}
                            </option>
                        )}

                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 text-grey-light" />
                </div>

                {error && (
                    <span className="text-xs">{error}</span>
                )}

            </div>
        );
    }
);

SelectForm.displayName = "SelectForm";

