"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import { useI18n } from "@/i18n";
import LeftValueProposition from "@assets/images/Home/LeftValueProposition.png";
import RightValueProposition from "@assets/images/Home/RightValueProposition.png";

export const ValueProposition = () => {
  const { locale } = useI18n();
  return (
    <section className="flex w-full flex-col gap-5 xl:grid xl:grid-cols-2">
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
          className="order-3 h-auto w-full object-contain xl:order-1"
          priority
        />

        <div className="order-2 mb-5 p-3 xl:mb-0 xl:p-12">
          <Text
            size="5xl"
            className="text-green-normal mb-5 max-w-170 xl:leading-[66.2px]"
          >
            Encuentra tu espacio ideal para sentirte en calma
          </Text>

          <Text
            font="gilroy"
            size="lg"
            className="text-grey-darker mb-5 max-w-118 leading-8"
          >
            Cada lugar está diseñado para brindarte calma, confort y una
            experiencia que se siente desde que llegas.
          </Text>

          <Button
            variant="secondary"
            className="mt-4 justify-center xl:w-auto xl:px-6 xl:py-2"
            href={`/${locale}/contact`}
            icon={
              <CircleButton className="bg-gold-light-active! ml-3 xl:ml-0">
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
};

//Ver si se queda la sección o se cambian los textos
