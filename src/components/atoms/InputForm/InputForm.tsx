import React from 'react'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
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
                    className={`h-13.5 w-70.25  font-gilroy font-bold text-[16.33px] px-4 text-white placeholder-white outline-none transition bg-white/10
              ${error ? "" : ""}
              ${className ?? ""}
            `}
                    {...props}
                />

                {error && (
                    <p className="mt-1 text-xs">{error}</p>
                )}
            </div>
        );
    }
);

InputForm.displayName = "InputForm";