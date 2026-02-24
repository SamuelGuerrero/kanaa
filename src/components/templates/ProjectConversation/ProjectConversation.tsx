import Image from "next/image";

import { Text } from "@/components/atoms";
import { ContactanosForm } from "@/components/organisms";
import ContactanosHeroBg from "@assets/images/Home/ContactanosHeroBg.png";

export const ProjectConversation = () => {
  return (
    <section className="relative min-h-230 w-full overflow-hidden sm:min-h-200 sm:pt-30">
      <div className="absolute inset-0">
        <Image
          src={ContactanosHeroBg}
          alt="BecomeHostBG"
          fill
          className="object-cover object-[72%] md:object-center"
        />
        <div className="absolute inset-0" />
        <div
          className="bg-beige-normal absolute inset-0 opacity-30"
          style={{ mixBlendMode: "hue" }}
        />
      </div>

      <div className="relative z-10 mt-5 flex h-full flex-col items-center justify-between px-3 md:flex-row md:pr-20 md:pl-10">
        <div className="mb-10 max-w-183.25 md:mb-55">
          <Text size="6xl" className="mt-20 max-w-112.5 text-white">
            Hablemos de tu proyecto
          </Text>

          <Text
            size="xl"
            className="text-grey-light mt-5 max-w-135"
            font="gilroy"
          >
            Déjanos tus datos y uno de nuestros asesores se pondrá en contacto
            contigo para entender tu necesidad y acompañarte en el siguiente
            paso.
          </Text>
        </div>

        <ContactanosForm />
      </div>
    </section>
  );
};
