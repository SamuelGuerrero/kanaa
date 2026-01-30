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
            <div className={`flex flex-col gap-1 ${wrapperClassName}`}>
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    className={`
            h-12 rounded-md border px-3 text-sm outline-none transition
            focus:ring-2 focus:ring-green-500
            ${error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300"
                        }
            ${className}
          `}
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

                {error && (
                    <span className="text-xs text-red-500">{error}</span>
                )}
            </div>
        );
    }
);

SelectForm.displayName = "SelectForm";

