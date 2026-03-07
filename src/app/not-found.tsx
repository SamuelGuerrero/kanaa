import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <span
        aria-hidden="true"
        className="select-none font-gilroy text-[120px] leading-none font-bold text-green-light-active md:text-[180px]"
      >
        404
      </span>

      <Text
        font="gilroy"
        size="5xl"
        weight="bold"
        as="h1"
        className="mt-2 text-green-normal"
      >
        Página no encontrada
      </Text>

      <Text
        font="gilroy"
        size="lg"
        className="mt-4 max-w-md text-grey-darker"
      >
        Lo sentimos, la página que buscas no existe o fue movida.
      </Text>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button
          variant="primary"
          href="/"
          icon={
            <CircleButton>
              <ArrowRightIcon className="w-5 text-gold-normal-hover drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Volver al inicio
        </Button>

        <Button
          variant="secondary"
          href="/propiedades"
          className="border border-gold-light-active"
          icon={
            <CircleButton className="bg-gold-light-hover">
              <ArrowRightIcon className="w-5 text-gold-normal-hover drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Ver propiedades
        </Button>
      </div>
    </main>
  );
}
