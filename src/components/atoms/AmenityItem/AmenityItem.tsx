"use client";

import { Text } from "@/components/atoms";
import { useI18n } from "@/i18n";

import type { ReactNode } from "react";

type AmenityItemProps = {
  icon: ReactNode;
  value: number;
  description?: string;
  className?: string;
};

export const AmenityItem = ({
  icon,
  value,
  description,
  className,
}: AmenityItemProps) => {
  const { t } = useI18n();

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2.5 sm:flex-row ${className}`}
    >
      {icon}
      <Text
        font="gilroy"
        className="text-green-darker text-[16.79px] leading-7.5"
      >
        {value}
        {description && (
          <span className="ml-1 sm:hidden">{t(description)}</span>
        )}
      </Text>
    </div>
  );
};
