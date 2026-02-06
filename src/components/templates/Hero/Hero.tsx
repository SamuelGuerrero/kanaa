import Image from "next/image";
import React from "react";

import { Text } from "@/components/atoms";
import { ReservationSearch } from "@/components/organisms";
import HeroBackground from "@assets/images/Home/HeroBackground.png";

export const Hero = () => {
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
        <ReservationSearch />
      </div>
    </section>
  );
};
