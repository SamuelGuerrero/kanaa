"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRef } from "react";

import {
  AmenityItem,
  BedIcon,
  PriceDisplay,
  RatingBadge,
  Text,
  ToiletIcon,
} from "@/components/atoms";
import { useListingCalendar } from "@/hooks/useListingCalendar";

type PropertyCardProps = {
  image: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  rating: number;
  title: string;
  price: number;
  priceLabel?: string;
  listingId?: string;
  city: string;
  state: string;
  country: string;
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
  listingId,
  city,
  state,
  country,
  onClick,
}: PropertyCardProps) => {
  const formatDateKeyLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatLocation = (value: string | undefined) => {
    return value === "Ciudad de México" ? "CDMX" : value;
  };

  // Fetch a 7-day window so we always find at least one priced available day,
  // even when today itself is occupied or has no calendar price.
  const todayKey = formatDateKeyLocal(new Date());
  const sevenDaysKey = formatDateKeyLocal(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  );
  const { priceByDate } = useListingCalendar(listingId ?? "", {
    startDate: todayKey,
    endDate: sevenDaysKey,
  });

  // Prefer the minimum upcoming calendar price over the raw listing price so that
  // the card and the detail page always reflect the same pricing source.
  const upcomingPrices = Object.values(priceByDate);
  const displayPrice =
    upcomingPrices.length > 0 ? Math.min(...upcomingPrices) : price;

  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    const el = textRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.parentElement!.clientWidth;
    if (overflow <= 0) return;
    const duration = Math.max(1.5, overflow / 40);
    el.style.setProperty("--marquee-distance", `-${overflow}px`);
    el.style.setProperty("--marquee-duration", `${duration}s`);
    el.classList.add("marquee-animate");
  };

  const handleMouseLeave = () => {
    const el = textRef.current;
    if (!el) return;
    el.classList.remove("marquee-animate");
    el.style.transform = "translateX(0)";
  };

  return (
    <figure
      onClick={onClick}
      className="bg-gold-light-hover group flex w-full cursor-pointer flex-col gap-5 rounded-lg p-[10px_10px_20px] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg sm:h-114 sm:w-75.5"
    >
      <div className="relative h-71.75 w-full shrink-0 overflow-hidden rounded-md">
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
              className="flex-row!"
            />
            <AmenityItem
              icon={<BedIcon />}
              value={bedrooms}
              className="flex-row!"
            />
            <AmenityItem
              icon={<ToiletIcon />}
              value={bathrooms}
              className="flex-row!"
            />
          </div>

          <RatingBadge rating={rating} />
        </div>

        <Text
          font="gilroy"
          size="sm"
          weight="medium"
          className="text-grey-darker"
        >
          {formatLocation(city)}, {formatLocation(state)}, {country}
        </Text>

        <div
          className="overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span ref={textRef} className="inline-block whitespace-nowrap">
            <Text
              font="gilroy"
              weight="bold"
              className="text-green-darker -mt-1 text-left text-xl"
            >
              {title}
            </Text>
          </span>
        </div>

        <PriceDisplay
          className="-mt-2"
          price={displayPrice}
          label={priceLabel}
        />
      </div>
    </figure>
  );
};
