"use client";

import { Text } from "@/components/atoms";
import { useI18n, type Locale } from "@/i18n";

const LANGUAGES: Array<{ value: Locale; label: string }> = [
  { value: "es", label: "Español" },
  { value: "en", label: "Inglés" },
];

export const LanguageSwitcher = () => {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5">
      <Text size="xs" font="gilroy" className="text-green-light-active">
        Idioma
      </Text>
      <div className="inline-flex rounded-full bg-white/10 p-0.5">
        {LANGUAGES.map((language) => (
          <button
            key={language.value}
            type="button"
            onClick={() => setLocale(language.value)}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${locale === language.value ? "bg-gold-light-hover text-gold-dark" : "text-green-light-active hover:bg-white/10"}`}
          >
            {t(language.label)}
          </button>
        ))}
      </div>
    </div>
  );
};
