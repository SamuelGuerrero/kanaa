import Image from "next/image";

import { Text } from "@/components/atoms";
import { BecomeHostForm } from "@/components/organisms";
import BecomeHostBG from "@assets/images/Home/BecomeHostBG.png";

export const BecomeHost = () => {
  return (
    <section className="relative h-200 w-full" data-navbar-theme="dark">
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

      <div className="relative z-10 mt-30 flex h-full flex-col items-center gap-10 px-3 md:mt-0 md:flex-row md:justify-center">
        <div className="max-w-183.25 md:mb-55">
          <Text
            size="6xl"
            className="text-white md:leading-17.5"
            weight="medium"
          >
            Convierte tu propiedad en un activo rentable
          </Text>

          <Text
            size="xl"
            className="mt-5 text-white"
            font="gilroy"
            weight="medium"
          >
            Descurbre el potencial de tu
          </Text>
        </div>

        <BecomeHostForm />
      </div>
    </section>
  );
};
