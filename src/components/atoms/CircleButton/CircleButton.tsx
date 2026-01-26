import type { ReactNode } from "react";

interface CircleButtonProps {
  className?: string;
  children?: ReactNode;
}

export const CircleButton = ({ className, children }: CircleButtonProps) => {
  return (
    <div
      className={`flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-full bg-white ${className}`}
    >
      {children}
    </div>
  );
};
