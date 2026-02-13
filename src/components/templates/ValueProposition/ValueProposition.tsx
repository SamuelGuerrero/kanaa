import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import LeftValueProposition from "@assets/images/Home/LeftValueProposition.png";
import RightValueProposition from "@assets/images/Home/RightValueProposition.png";

export const ValueProposition = () => {
  return (
    <section className="flex w-full flex-col gap-5 md:grid md:grid-cols-2 ">
      <div className="w-full">
        <Image
          src={LeftValueProposition}
          alt="Left Value Proposition"
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      <div className="flex w-full flex-col">
        <Image
          src={RightValueProposition}
          alt="Right Value Proposition"
          className="order-3 h-auto w-full object-contain md:order-1"
          priority
        />

        <div className="order-2 mb-5 p-3 md:mb-0 md:p-12">
          <Text
            size="5xl"
            className="text-green-normal mb-5 md:leading-[66.2px]"
          >
            Más que hospedaje, <br />
            una mejor forma de <br />
            descansar
          </Text>

          <Text
            font="gilroy"
            size="lg"
            className="text-grey-darker mb-5 leading-8"
          >
            En KANNA disfrutas espacios cómodos, tranquilos y pensados para{" "}
            <br />
            que te relajes desde el primer momento.
          </Text>

          <Button
            variant="secondary"
            className="mt-4  justify-center md:w-auto md:px-6 md:py-2"
            href="/propiedades"
            icon={
              <CircleButton className="bg-gold-light-active! ml-3 md:ml-0">
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Ver alojamientos
          </Button>
        </div>
      </div>
    </section>
  );
};
