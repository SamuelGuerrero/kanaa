import Image from "next/image";

import { Text } from "@/components/atoms";
import { EarningsCalculatorForm } from "@/components/organisms";
import calculadoraHeroBg from "@assets/images/Home/calculadoraHeroBg.png";

export const EarningsCalculator = () => {
  return (
    <section
      className="relative h-230 w-full md:h-300 xl:h-200"
      data-navbar-theme="dark"
    >
      <div className="absolute inset-0">
        <Image
          src={calculadoraHeroBg}
          alt="BecomeHostBG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" />
        <div
          className="bg-beige-normal absolute inset-0 opacity-40"
          style={{ mixBlendMode: "hue" }}
        />
      </div>

      <div className="relative z-10 mt-15 flex flex-col items-center px-3 sm:mt-34 xl:flex-row xl:justify-between xl:px-10">
        <div className="mb-5 md:max-w-[90%] md:text-center xl:mb-55 xl:max-w-138.5 xl:text-left">
          <Text
            size="6xl"
            className="mt-15 text-white xl:mt-20 xl:max-w-132.5 xl:leading-18"
            weight="medium"
          >
            Descubre cuánto puede generar tu propiedad
          </Text>

          <Text
            size="xl"
            className="text-grey-light mt-3 xl:mt-5"
            font="gilroy"
            weight="medium"
          >
            Calcula el potencial de ingresos de tu inmueble en minutos y recibe
            una estimación anual personalizada, clara y transparente.
          </Text>
        </div>

        <EarningsCalculatorForm />
      </div>
    </section>
  );
};
