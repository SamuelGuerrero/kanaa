import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import LeftValueProposition from "@assets/images/Home/LeftValueProposition.png";
import RightValueProposition from "@assets/images/Home/RightValueProposition.png";

export const ValueProposition = () => {
  return (
    <section className="w-full flex flex-col md:grid md:grid-cols-2 gap-5 text-center md:text-left">

      <div className="w-full">
        <Image
          src={LeftValueProposition}
          alt="Left Value Proposition"
          className="h-auto w-full object-contain"
          priority
        />
      </div>


      <div className="w-full flex flex-col">
        <Image
          src={RightValueProposition}
          alt="Right Value Proposition"
          className="
            h-auto w-full object-contain
            order-3 md:order-1"
          priority
        />

        <div className="p-6 mb-5 md:p-12 md:mb-0 order-2"
        >
          <Text
            size="5xl"
            className="text-green-normal mb-5 leading-tight md:leading-[66.2px]"
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
            En KANNA disfrutas espacios cómodos, tranquilos y pensados para <br />
            que te relajes desde el primer momento.
          </Text>

          <Button
            variant="secondary"
            className="mt-4 w-full justify-center md:w-auto md:px-6 md:py-2"
            icon={
              <CircleButton className="bg-gold-light-active! ml-3 md:ml-0 ">
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
