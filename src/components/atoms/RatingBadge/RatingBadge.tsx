"use client";

import { StarIcon } from "@heroicons/react/24/solid";

import { Text } from "@/components/atoms";

type RatingBadgeProps = {
  rating: number;
};

export const RatingBadge = ({ rating }: RatingBadgeProps) => {
  return (
    <div className="flex gap-0.5">
      <StarIcon className="text-gold-normal h-4 w-4" />
      <Text
        font="gilroy"
        weight="medium"
        className="text-green-darker text-base leading-4.75"
      >
        {rating}
      </Text>
    </div>
  );
};
