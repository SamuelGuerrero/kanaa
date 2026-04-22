"use client";

import { useParams } from "next/navigation";

import { Text } from "@/components/atoms";
import { translateText } from "@/i18n/translations";

export const CheckoutHero = () => {
  const params = useParams();
  const locale = params?.locale === "en" ? "en" : "es";
  const t = (text: string) => translateText(text, locale);

  return (
    <div className="mb-10 text-center">
      <Text size="5xl" weight="medium" className="text-green-normal mb-2">
        {t("Completa tu reserva")}
      </Text>
      <Text font="gilroy" size="lg" className="text-green-normal">
        {t("Estás a un paso de confirmar tu reserva")}
      </Text>
    </div>
  );
};
