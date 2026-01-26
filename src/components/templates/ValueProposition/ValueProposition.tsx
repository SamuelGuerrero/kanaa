import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import LeftValueProposition from "@assets/images/Home/LeftValueProposition.png";
import RightValueProposition from "@assets/images/Home/RightValueProposition.png";

export const ValueProposition = () => {
  return (
    <section className="w-full columns-2 gap-5">
      <Image
        src={LeftValueProposition}
        alt="Left Value Proposition"
        className="h-auto w-full break-inside-avoid object-contain"
        priority
      />

      <Image
        src={RightValueProposition}
        alt="Right Value Proposition"
        className="h-auto w-full break-inside-avoid object-contain"
        priority
      />
      <div className="p-12">
        <Text size="5xl" className="text-green-normal mb-5 leading-[66.2px]">
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
          icon={
            <CircleButton className="bg-gold-light-active!">
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Ver alojamientos
        </Button>
      </div>
    </section>
  );
};
