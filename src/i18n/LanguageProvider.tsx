"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

import { translateText } from "@/i18n/translations";

export type Locale = "es" | "en";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (value: string) => string;
};

const STORAGE_KEY = "kanaa_locale";
const COOKIE_KEY = "kanaa_locale";
const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({
  children,
  initialLocale = "es",
  cmsEnStrings = {},
}: {
  children: ReactNode;
  initialLocale?: Locale;
  /** English translations fetched from Strapi ui-strings at layout level */
  cmsEnStrings?: Record<string, string>;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.cookie = `${COOKIE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      const segments = pathname.split("/");
      segments[1] = nextLocale;
      router.push(segments.join("/"));
    },
    [pathname, router],
  );

  const t = useCallback(
    (value: string) => {
      // CMS strings override translations.ts for English
      if (locale === "en" && cmsEnStrings[value] !== undefined) return cmsEnStrings[value];
      return translateText(value, locale);
    },
    [locale, cmsEnStrings],
  );

  const contextValue = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(LanguageContext);
  if (context) return context;

  return {
    locale: "es" as Locale,
    setLocale: () => undefined,
    t: (value: string) => value,
  };
};
