import Image from "next/image";

import { Text } from "@/components/atoms";
import { BecomeHostForm } from "@/components/organisms";
import BecomeHostBG from "@assets/images/Home/BecomeHostBG.png";

export const BecomeHost = () => {
  return (
    <section className="relative min-h-screen w-full pb-50">
      <Image
        src={BecomeHostBG}
        alt="BecomeHostBG"
        fill
        priority
        className="object-cover"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center space-x-15 text-white">
        <div className="mt-15">
          <Text size="6xl" className="">
            Convierte tu propiedad
            <br />
            en un activo rentable
          </Text>

          <Text size="xl" className="mt-5 mb-18" font="gilroy">
            Encuentra tu próximo casa de descanso ideal.
          </Text>
        </div>
        <div
          style={{
            background:
              "radial-gradient(90.16% 143.01% at 15.32% 21.04%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.045) 77.08%, rgba(255, 255, 255, 0) 100%)",
            backgroundBlendMode: "overlay, normal",
            backdropFilter: "blur(22.39px)",
            WebkitBackdropFilter: "blur(22.39px)",
          }}
          className="mt-45 rounded-lg border border-white/20 bg-white/1 p-8 backdrop-blur-md"
        >
          <BecomeHostForm />
        </div>
      </div>
    </section>
  );
};
