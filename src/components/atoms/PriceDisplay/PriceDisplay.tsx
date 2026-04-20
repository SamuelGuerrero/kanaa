"use client";

import { Text } from "@/components/atoms";

type PriceDisplayProps = {
  price: number;
  label?: string;
  className?: string;
};

export const PriceDisplay = ({
  price,
  label,
  className,
}: PriceDisplayProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Text
        font="gilroy"
        weight="medium"
        className="text-green-darker text-lg leading-8"
      >
        ${price.toLocaleString()}
      </Text>
      {label && (
        <Text
          font="gilroy"
          weight="medium"
          className="text-green-darker text-sm leading-4.25"
        >
          {label}
        </Text>
      )}
    </div>
  );
};
