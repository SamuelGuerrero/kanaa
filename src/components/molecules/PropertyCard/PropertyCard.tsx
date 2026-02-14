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
  onClick?: () => void;
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
  onClick,
}: PropertyCardProps) => {
  return (
    <figure
      onClick={onClick}
      className="bg-gold-light-hover group flex w-full cursor-pointer flex-col gap-5 rounded-lg p-[10px_10px_20px] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg sm:h-[434.9px] sm:w-75.5"
    >
      <div className="relative h-71.75 w-full overflow-hidden rounded-md">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
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
          className="text-green-darker text-left text-xl leading-7.5"
        >
          {title}
        </Text>

        <PriceDisplay price={price} label={priceLabel} />
      </div>
    </figure>
  );
};
