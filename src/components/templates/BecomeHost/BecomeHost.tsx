import Image from "next/image";

import { Text } from "@/components/atoms";
import { BecomeHostForm } from "@/components/organisms";
import BecomeHostBG from "@assets/images/Home/BecomeHostBG.png";

export const BecomeHost = () => {
  return (
    <section
      className="relative h-225 w-full sm:h-200"
      data-navbar-theme="dark"
    >
      <div className="absolute inset-0">
        <Image
          src={BecomeHostBG}
          alt="BecomeHostBG"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-black opacity-40"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>

      <div className="relative z-10 mt-15 flex h-full flex-col items-center gap-10 px-3 sm:mt-24 sm:w-full md:flex-row md:justify-between md:px-10">
        <div className="mb-5 max-w-138.5 md:mb-55">
          <Text
            size="6xl"
            className="mt-15 text-white md:mt-20 md:leading-18"
            weight="medium"
          >
            Convierte tu propiedad en un activo rentable
          </Text>

          <Text
            size="xl"
            className="mt-3 pr-2 text-white md:mt-5"
            font="gilroy"
            weight="medium"
          >
            Cuéntanos un poco de ti para comenzar
          </Text>
        </div>

        <BecomeHostForm className="-mt-10 sm:-mt-25" />
      </div>
    </section>
  );
};
