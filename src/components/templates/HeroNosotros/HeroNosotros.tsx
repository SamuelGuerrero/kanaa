import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import HeroNosotrosBg from "@assets/images/Home/HeroNosotrosBg.png";

export const HeroNosotros = () => {
  return (
    <section className="relative h-200 w-full">
      <Image
        src={HeroNosotrosBg}
        alt="Hero background"
        fill
        priority
        className="object-cover"
      />

      <div className="relative z-10 my-45 flex min-h-screen flex-col items-center justify-center text-white">
        <Text size="6xl" weight="medium">
          Alquileres vacacionales fáciles
        </Text>

        <Text size="xl" className="mt-5" font="gilroy" weight="medium">
          Agilizamos la gestión del alquiler vacacional para garantizar
          <br />
          la tranquilidad y experiencias inolvidables a los huéspedes.
        </Text>
        <Button
          textWeight="bold"
          variant="primary"
          className="text-gold-dark! mt-10"
          href="/propiedades"
          icon={
            <CircleButton className="bg-grey-light!">
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Conoce nuestros proyectos
        </Button>
      </div>
    </section>
  );
};
