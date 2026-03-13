import Image from "next/image";

import { Text } from "@/components/atoms";
import JoinHeroBg from "@assets/images/Home/JoinHeroBg.png";

type Props = {
  title?: string;
  subtitle?: string;
};

export const HeroJoin = ({
  title = "Trabaja con nosotros",
  subtitle = "Sé parte de la evolución en la gestión de alquileres vacacionales.",
}: Props) => {
  return (
    <section className="relative h-100 sm:h-full">
      <Image
        src={JoinHeroBg}
        alt="Hero background"
        fill
        priority
        className="smm object-cover"
      />

      <div className="relative z-1 -mt-50 flex min-h-screen flex-col items-center justify-center px-1 text-center text-white md:py-45 lg:mt-0">
        <Text size="6xl" weight="medium">
          {title}
        </Text>

        <Text
          size="xl"
          className="mt-5 md:mt-10 md:w-94"
          font="gilroy"
          weight="medium"
        >
          {subtitle}
        </Text>
      </div>
    </section>
  );
};
