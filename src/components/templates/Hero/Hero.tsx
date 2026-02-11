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
    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="relative w-full sm:min-h-screen">
      <Image
        src={HeroBackground}
        alt="Hero background"
        fill
        priority
        className="h-1/2 object-cover sm:h-screen"
      />

      <div className="relative z-10 my-45 flex flex-col items-center justify-center text-center text-white sm:min-h-screen">
        <Text size="6xl" weight="medium">
          Siéntete como en casa,
          <br />
          en cualquier lugar.
        </Text>

        <Text size="xl" className="mt-8 mb-10" font="gilroy" weight="medium">
          Encuentra tu próxima casa de descanso ideal.
        </Text>
        <ReservationSearch onSearch={handleSearch} />
      </div>
    </section>
  );
};
