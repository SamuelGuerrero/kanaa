import { Footer, Navbar } from "@/components/organisms";
import { LanguageProvider } from "@/i18n";

import type { Locale } from "@/i18n";
import type { ReactNode } from "react";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <LanguageProvider initialLocale={locale as Locale}>
      <Navbar />
      {children}
      <Footer />
    </LanguageProvider>
  );
}
