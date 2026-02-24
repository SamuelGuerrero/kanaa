import Image from "next/image";

import { Text } from "@/components/atoms";
import IntelligentManagement1 from "@assets/images/Home/IntelligentManagement1.png";
import IntelligentManagement2 from "@assets/images/Home/IntelligentManagement2.png";
import IntelligentManagement3 from "@assets/images/Home/IntelligentManagement3.png";

export const IntelligentManagement = () => {
  return (
    <section className="bg-gold-light mx-3 pt-5 pb-3 md:pt-15 md:pb-10 md:text-center">
      <Text size="5xl" weight="medium" className="text-green-normal">
        Gestión inteligente de propiedades
      </Text>

      <div className="my-8 grid gap-2 md:my-10">
        <Text
          font="gilroy"
          size="lg"
          weight="medium"
          className="text-grey-darker mx-auto sm:w-242.5"
        >
          Ayudamos a propietarios a maximizar el potencial de sus inmuebles a
          través de un modelo de gestión profesional, transparente y respaldado
          por datos. Desde la estrategia de renta hasta la operación diaria, nos
          ocupamos de todo.
        </Text>
      </div>

      <div className="grid w-full gap-2 px-2 md:grid-cols-2 md:grid-rows-2 md:gap-6 md:px-0">
        <Image
          src={IntelligentManagement1}
          alt="IntelligentManagement1"
          className="row-span-2 h-full w-full object-cover"
          priority
        />

        <Image
          src={IntelligentManagement2}
          alt="IntelligentManagement2"
          className="hidden h-full w-full object-cover sm:block"
          priority
        />

        <Image
          src={IntelligentManagement3}
          alt="IntelligentManagement3"
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </section>
  );
};
