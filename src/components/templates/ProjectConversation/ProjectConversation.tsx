import Image from "next/image";

import { Text } from "@/components/atoms";
import { ContactanosForm } from "@/components/organisms";
import ContactanosHeroBg from "@assets/images/Home/ContactanosHeroBg.png";

export const ProjectConversation = () => {
  return (
    <section className="relative min-h-230 w-full overflow-hidden xl:min-h-200 xl:pt-30">
      <div className="absolute inset-0">
        <Image
          src={ContactanosHeroBg}
          alt="BecomeHostBG"
          fill
          className="object-cover object-[90%] xl:object-center"
        />
        <div className="absolute inset-0" />
        <div
          className="bg-beige-normal absolute inset-0 opacity-30"
          style={{ mixBlendMode: "hue" }}
        />
      </div>

      <div className="relative z-10 mt-5 flex h-full flex-col items-center justify-between px-3 xl:flex-row xl:pr-20 xl:pl-10">
        <div className="mx-auto mb-10 md:w-[80%] xl:mb-55 xl:max-w-183.25">
          <Text size="6xl" className="mt-20 text-white xl:max-w-112.5">
            Hablemos de tu proyecto
          </Text>

          <Text
            size="xl"
            className="text-grey-light mt-5 xl:max-w-135"
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
