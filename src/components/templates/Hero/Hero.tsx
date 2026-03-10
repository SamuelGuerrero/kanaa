"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Text } from "@/components/atoms";
import { ReservationSearch } from "@/components/organisms";
import HeroBackground from "@assets/images/Home/HeroBackground.png";

export const Hero = () => {
  const router = useRouter();

  const handleSearch = (filters: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guestCounts: { adults: number; children: number; infants: number };
  }) => {
    const params = new URLSearchParams();
    if (filters.destination) params.append("destination", filters.destination);
    if (filters.checkIn) params.append("checkIn", filters.checkIn);
    if (filters.checkOut) params.append("checkOut", filters.checkOut);
    params.append("adults", String(filters.guestCounts.adults));
    params.append("children", String(filters.guestCounts.children));
    params.append("infants", String(filters.guestCounts.infants));
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-200 w-full sm:min-h-screen">
      <Image
        src={HeroBackground}
        alt="Hero background"
        fill
        priority
        className="object-cover"
      />

      <div className="relative z-10 mt-8 flex min-h-170 flex-col items-center justify-center px-4 pt-20 text-center text-white sm:mt-0 sm:min-h-screen sm:pt-0">
        <Text className="max-w-175" size="6xl">
          Siéntete como en casa, en cualquier lugar
        </Text>

        <Text size="xl" className="mt-8 mb-10" font="gilroy" weight="medium">
          Encuentra tu próxima casa de descanso.
        </Text>
        <ReservationSearch onSearch={handleSearch} />
      </div>
    </section>
  );
};
