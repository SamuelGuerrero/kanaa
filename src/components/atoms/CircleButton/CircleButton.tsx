import type { ReactNode } from 'react';

interface CircleButtonProps {
    className?: string
    children?: ReactNode
}

export const CircleButton = ({ className, children }: CircleButtonProps) => {
    return (
        <div
            className={`bg-white w-7.5 h-7.5 rounded-full flex items-center justify-center cursor-pointer ${className}`}
        >
            {children}
        </div>
    )
}
