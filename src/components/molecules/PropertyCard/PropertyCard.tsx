"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

import {
  AmenityItem,
  BedIcon,
  PriceDisplay,
  RatingBadge,
  Text,
  ToiletIcon,
} from "@/components/atoms";

type PropertyCardProps = {
  image: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  title: string;
  price: number;
  priceLabel?: string;
};

export const PropertyCard = ({
  image,
  guests,
  bedrooms,
  bathrooms,
  rating,
  title,
  price,
  priceLabel,
}: PropertyCardProps) => {
  return (
    <figure className="bg-gold-light-hover flex h-[434.9px] w-75.5 flex-col gap-5 rounded-lg p-[10px_10px_20px]">
      <div className="relative h-71.75 w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="flex flex-col gap-2.5 px-1.25">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4.25">
            <AmenityItem
              icon={<UserGroupIcon className="text-gold-normal h-4 w-4" />}
              value={guests}
            />
            <AmenityItem icon={<BedIcon />} value={bedrooms} />
            <AmenityItem icon={<ToiletIcon />} value={bathrooms} />
          </div>

          <RatingBadge rating={rating} />
        </div>

        <Text
          font="gilroy"
          weight="bold"
          className="text-green-darker text-xl leading-7.5"
        >
          {title}
        </Text>

        <PriceDisplay price={price} label={priceLabel} />
      </div>
    </figure>
  );
};
