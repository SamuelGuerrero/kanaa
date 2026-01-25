'use client';

import { StarIcon } from "@heroicons/react/24/solid";

import { Text } from "@/components/atoms";

type RatingBadgeProps = {
    rating: number;
};

export const RatingBadge = ({ rating }: RatingBadgeProps) => {
    return (
        <div className='flex gap-0.5'>
            <StarIcon className="w-4 h-4 text-gold-normal" />
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