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

      <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-center h-full px-3  gap-10 mt-30 md:mt-0">
        <div className="md:mb-55 max-w-183.25">
          <Text size="6xl" className="md:leading-17.5 text-white" weight="medium">
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
