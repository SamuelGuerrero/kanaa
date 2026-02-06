import Image from "next/image";

import { Text } from "@/components/atoms";
import { BecomeHostForm } from "@/components/organisms";
import BecomeHostBG from "@assets/images/Home/BecomeHostBG.png";

export const BecomeHost = () => {
  return (
    <section className="relative h-200 w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={BecomeHostBG}
          alt="BecomeHostBG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div
          className="bg-beige-normal absolute inset-0 opacity-40"
          style={{ mixBlendMode: "hue" }}
        />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center gap-10 px-8">
        <div className="mb-55 max-w-183.25">
          <Text size="6xl" className="leading-17.5 text-white" weight="medium">
            Convierte tu propiedad
            <br />
            en un activo rentable
          </Text>

          <Text size="xl" className="mt-5 text-white" font="gilroy" weight="medium">
            Encuentra tu próximo casa de descanso ideal.
          </Text>
        </div>

        <BecomeHostForm />
      </div>
    </section>
  );
};
