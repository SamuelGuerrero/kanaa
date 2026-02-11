import Image from "next/image";
import React from "react";

import { Text } from "@/components/atoms";
import { ContactanosForm } from "@/components/organisms";
import ContactanosHeroBg from "@assets/images/Home/ContactanosHeroBg.png";

export const ProjectConversation = () => {
  return (
    <section className="relative h-200 w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={ContactanosHeroBg}
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

      <div className="relative z-10 flex h-full items-center justify-between pr-20 pl-10">
        <div className="mb-55 max-w-183.25">
          <Text
            size="6xl"
            className="mt-20 leading-17.5 text-white"
            weight="medium"
          >
            Descubre cuánto
            <br />
            puede generar
            <br />
            tu propiedad
          </Text>

          <Text
            size="xl"
            className="text-grey-light mt-5"
            font="gilroy"
            weight="medium"
          >
            Calcula el potencial de ingresos de tu inmueble en minutos
            <br />
            y recibe una estimación anual personalizada, clara y
            <br />
            transparente.
          </Text>
        </div>

        <ContactanosForm />
      </div>
    </section>
  );
};
