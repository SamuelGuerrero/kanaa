"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import { translateText } from "@/i18n/translations";

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] === "en" ? "en" : "es";
  const t = (text: string) => translateText(text, locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <span
        aria-hidden="true"
        className="font-gilroy text-green-light-active text-[120px] leading-none font-bold select-none md:text-[180px]"
      >
        404
      </span>

      <Text
        font="gilroy"
        size="5xl"
        weight="bold"
        as="h1"
        className="text-green-normal mt-2"
      >
        {t("Página no encontrada")}
      </Text>

      <Text font="gilroy" size="lg" className="text-grey-darker mt-4 max-w-md">
        {t(
          "Lo sentimos, la página que buscas no existe o fue movida.",
        )}
      </Text>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button
          variant="primary"
          href={`/${locale}`}
          icon={
            <CircleButton>
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          {t("Volver al inicio")}
        </Button>

        <Button
          variant="secondary"
          href={`/${locale}/properties`}
          className="border-gold-light-active border"
          icon={
            <CircleButton className="bg-gold-light-hover">
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          {t("Ver propiedades")}
        </Button>
      </div>
    </main>
  );
}
