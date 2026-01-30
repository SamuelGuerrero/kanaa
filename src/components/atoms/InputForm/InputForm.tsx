import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
    wrapperClassName?: string;
};


export const InputForm = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, wrapperClassName, ...props }, ref) => {
        return (
            <div className={wrapperClassName}>
                {label && (
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    className={`
              w-full rounded-lg border px-4 py-2 text-sm
              outline-none transition
              border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600
              ${error ? "border-red-500 focus:ring-red-500" : ""}
              ${className ?? ""}
            `}
                    {...props}
                />

                {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

InputForm.displayName = "InputForm";