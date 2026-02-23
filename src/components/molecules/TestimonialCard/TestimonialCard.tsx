import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { Text } from "@/components/atoms";

type TestimonialCardProps = {
  name: string;
  role?: string;
  testimonial: string;
  rating: number;
  avatarUrl?: string;
};

export const TestimonialCard = ({
  name,
  role = "Huésped",
  testimonial,
  rating,
  avatarUrl = "https://picsum.photos/50/50",
}: TestimonialCardProps) => {
  const normalizedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <figure className="bg-green-normal relative mx-auto flex h-74 w-full max-w-92.5 flex-col items-center rounded-2xl p-5 sm:mx-0 sm:w-92.5">
      <div className="flex flex-col items-center">
        <Image
          src={avatarUrl}
          width={50}
          height={50}
          alt={`${name} avatar`}
          className="border-green-light-active h-12.5 min-h-12.5! w-12.5 min-w-12.5! rounded-full border object-cover"
        />

        <Text
          font="gilroy"
          weight="bold"
          size="xl"
          className="text-grey-light mt-4 text-center"
        >
          {name}
        </Text>

        <figure className="bg-green-light-hover rounded-full px-5 py-1.25">
          <Text font="gilroy" size="xxs" className="text-[10px]!">
            {role}
          </Text>
        </figure>

        <Text font="gilroy" size="xs" className="mt-4 text-center text-white">
          {testimonial}
        </Text>
      </div>

      <footer
        className="absolute bottom-5 mt-10 flex gap-1"
        aria-label={`${normalizedRating} de 5 estrellas`}
      >
        {Array.from({ length: fullStars }, (_, i) => (
          <StarIcon
            key={`full-${i}`}
            className="text-gold-normal h-[21.50px] w-[21.50px]"
            aria-hidden="true"
          />
        ))}

        {hasHalfStar && (
          <div key="half" className="relative h-[21.50px] w-[21.50px]">
            <StarIcon
              className="text-gold-normal absolute inset-0 opacity-30"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: "50%" }}
            >
              <StarIcon
                className="text-gold-normal h-[21.50px] w-[21.50px]"
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {Array.from({ length: emptyStars }, (_, i) => (
          <StarIcon
            key={`empty-${i}`}
            className="text-gold-normal h-[21.50px] w-[21.50px] opacity-30"
            aria-hidden="true"
          />
        ))}
      </footer>
    </figure>
  );
};
