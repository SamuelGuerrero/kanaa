import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";

export default function NotFound() {
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
        Página no encontrada
      </Text>

      <Text font="gilroy" size="lg" className="text-grey-darker mt-4 max-w-md">
        Lo sentimos, la página que buscas no existe o fue movida.
      </Text>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button
          variant="primary"
          href="/"
          icon={
            <CircleButton>
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Volver al inicio
        </Button>

        <Button
          variant="secondary"
          href="/properties"
          className="border-gold-light-active border"
          icon={
            <CircleButton className="bg-gold-light-hover">
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Ver propiedades
        </Button>
      </div>
    </main>
  );
}
