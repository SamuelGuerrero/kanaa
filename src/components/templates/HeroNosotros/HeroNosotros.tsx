"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import { useI18n } from "@/i18n";
import HeroNosotrosBg from "@assets/images/Home/HeroNosotrosBg.png";

export const HeroNosotros = () => {
  const { locale } = useI18n();
  return (
    <section
      className="relative h-130 w-full sm:h-200"
      data-navbar-theme="dark"
    >
      <Image
        src={HeroNosotrosBg}
        alt="Hero background"
        fill
        priority
        className="object-cover"
      />

      <div className="relative z-10 mt-6 flex h-full w-full flex-col justify-center px-3 text-white sm:-mt-25 md:mt-0 md:ml-0 md:min-h-screen md:w-full md:items-center md:py-45">
        <Text className="sm:text-center" size="6xl" weight="medium">
          Alquileres vacacionales fáciles
        </Text>

        <Text
          size="xl"
          className="mt-5 max-w-145 sm:text-center"
          font="gilroy"
          weight="medium"
        >
          Agilizamos la gestión del alquiler vacacional para garantizar la
          tranquilidad y experiencias inolvidables a los huéspedes.
        </Text>
        <Button
          textWeight="bold"
          variant="primary"
          className="text-gold-dark! mt-10 w-fit"
          href={`/${locale}/properties`}
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
