import type { ReactNode } from 'react';

interface CircleButtonProps {
    className?: string
    children?: ReactNode
    onClick?: () => void
}

export const CircleButton = ({ className, children, onClick }: CircleButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`bg-white w-7.5 h-7.5 rounded-full flex items-center justify-center cursor-pointer ${className}`}
        >
            {children}
        </button>
    )
}
