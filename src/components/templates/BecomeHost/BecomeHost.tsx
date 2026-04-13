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

      <div className="relative z-10 mt-15 flex h-full flex-col items-center gap-10 px-3 sm:mt-24 sm:w-full xl:flex-row xl:justify-between xl:px-10">
        <div className="mb-5 md:text-center xl:mb-55 xl:max-w-138.5 xl:text-left">
          <Text
            size="6xl"
            className="mt-15 text-white xl:mt-20 xl:leading-18"
            weight="medium"
          >
            Convierte tu propiedad en un activo rentable
          </Text>

          <Text
            size="xl"
            className="mt-3 pr-2 text-white xl:mt-5"
            font="gilroy"
            weight="medium"
          >
            Administra tu propiedad sin complicaciones y con el respaldo de
            expertos en rentas de alta demanda.
          </Text>
        </div>

        <BecomeHostForm className="-mt-10 xl:-mt-25" />
      </div>
    </section>
  );
};
