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
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.cookie = `${COOKIE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback(
    (value: string) => {
      return translateText(value, locale);
    },
    [locale],
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
