import Image from "next/image";
import React from "react";

import { Text } from "@/components/atoms";
import { ContactanosForm } from "@/components/organisms";
import ContactanosHeroBg from "@assets/images/Home/ContactanosHeroBg.png";

export const ProjectConversation = () => {
  return (
    <section className="relative h-200 w-full  overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={ContactanosHeroBg}
          alt="BecomeHostBG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 " />
        <div
          className="bg-beige-normal absolute inset-0 opacity-30"
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
            Hablemos de
            <br />
            tu proyecto
          </Text>

          <Text
            size="xl"
            className="text-grey-light mt-5"
            font="gilroy"
            weight="medium"
          >
            Déjanos tus datos y uno de nuestros asesores se pondrá
            <br />
            en contacto contigo para entender tu necesidad y
            <br />
            acompañarte en el siguiente paso.
          </Text>
        </div>

        <ContactanosForm />
      </div>
    </section>
  );
};
