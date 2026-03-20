"use client";

import {
  ArrowRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="bg-gold-light-active flex h-20 w-20 items-center justify-center rounded-full">
        <ExclamationTriangleIcon className="text-gold-normal h-10 w-10" />
      </div>

      <Text
        font="gilroy"
        size="5xl"
        weight="bold"
        as="h1"
        className="text-green-normal mt-6"
      >
        Algo salió mal
      </Text>

      <Text font="gilroy" size="lg" className="text-grey-darker mt-4 max-w-md">
        Ocurrió un error inesperado. Puedes intentarlo de nuevo o regresar al
        inicio.
      </Text>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button
          variant="primary"
          onClick={reset}
          icon={
            <CircleButton>
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Intentar de nuevo
        </Button>

        <Button
          variant="secondary"
          href="/"
          className="border-gold-light-active border"
          icon={
            <CircleButton className="bg-gold-light-hover">
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Volver al inicio
        </Button>
      </div>
    </main>
  );
}
