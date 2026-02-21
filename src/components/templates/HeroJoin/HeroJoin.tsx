import Image from "next/image";

import { Text } from "@/components/atoms";
import JoinHeroBg from "@assets/images/Home/JoinHeroBg.png";

export const HeroJoin = () => {
  return (
    <section className="relative">
      <Image
        src={JoinHeroBg}
        alt="Hero background"
        fill
        priority
        className="object-cover"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-1 text-center text-white md:py-45">
        <Text size="6xl" weight="medium">
          Trabaja con nosotros
        </Text>

        <Text
          size="xl"
          className="mt-5 md:mt-10 md:w-94"
          font="gilroy"
          weight="medium"
        >
          Sé parte de la evolución en la gestión de alquileres vacacionales.
        </Text>
      </div>
    </section>
  );
};
