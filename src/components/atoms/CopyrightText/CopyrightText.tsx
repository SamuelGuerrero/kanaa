"use client";

import { Text } from "../Text";
import { useI18n } from "@/i18n";

type CopyrightTextProps = {
  className?: string;
};

export const CopyrightText = ({ className }: CopyrightTextProps) => {
  const { locale } = useI18n();
  const year = new Date().getFullYear();
  const copyText =
    locale === "en"
      ? `© ${year} — Kanaa. All rights reserved.`
      : `© ${year} — Kanaa. Todos los derechos reservados.`;

  return (
    <Text
      size="sm"
      className={`text-white ${className}`}
      weight="medium"
      font="gilroy"
    >
      {copyText}
    </Text>
  );
};
