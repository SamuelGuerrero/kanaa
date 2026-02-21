"use client";

import { StarIcon } from "@heroicons/react/24/solid";

import { Text } from "@/components/atoms";

type RatingBadgeProps = {
  rating: number;
  className?: string;
  starClassName?: string;
  ratingClassName?: string;
};

export const RatingBadge = ({
  rating,
  className = "",
  starClassName = "",
  ratingClassName = "",
}: RatingBadgeProps) => {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      <StarIcon className={`text-gold-normal h-4 w-4 ${starClassName}`} />
      <Text
        font="gilroy"
        weight="medium"
        className={`text-green-darker text-base leading-4.75 ${ratingClassName}`}
      >
        {rating}
      </Text>
    </div>
  );
};
