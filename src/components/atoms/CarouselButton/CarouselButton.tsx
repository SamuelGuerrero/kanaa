"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { useI18n } from "@/i18n";

import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type CarouselButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
};

export const CarouselButton = ({
  direction,
  onClick,
  disabled,
  className,
  ...rest
}: CarouselButtonProps) => {
  const { t } = useI18n();
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;
  const position =
    direction === "prev" ? "-left-6 -translate-x-4" : "-right-6 translate-x-4";
  const label = direction === "prev" ? "Anterior" : "Siguiente";

  return (
    <button
      onClick={onClick}
      className={`bg-gold-light-hover absolute top-1/2 ${position} z-10 -translate-y-1/2 cursor-pointer rounded-full p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={disabled}
      aria-label={t(label)}
      {...rest}
    >
      <Icon className="text-gold-normal-hover h-6 w-6" />
    </button>
  );
};
