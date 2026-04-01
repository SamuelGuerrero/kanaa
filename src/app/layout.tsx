import "@styles/globals.css";

import { type Metadata } from "next";
import { Roboto_Serif } from "next/font/google";
import localFont from "next/font/local";
import { cookies, headers } from "next/headers";

import { siteConfig, toAbsoluteUrl } from "@/lib/seo";

import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.defaultTitle,
    template: "%s | Kanaa",
  },
  description: siteConfig.description,
  applicationName: "Kanaa",
  referrer: "origin-when-cross-origin",
  keywords: [
    "gestion de propiedades",
    "alquiler vacacional",
    "property management",
    "renta vacacional",
    "kanaa",
  ],
  authors: [{ name: "Kanaa" }],
  creator: "Kanaa",
  publisher: "Kanaa",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Kanaa",
    url: "/",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [
      {
        url: toAbsoluteUrl("/favicon.ico"),
        width: 1200,
        height: 630,
        alt: "Kanaa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [toAbsoluteUrl("/favicon.ico")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const gilroy = localFont({
  src: [
    {
      path: "../../public/fonts/Gilroy-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gilroy-Heavy.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const localeFromHost = host?.toLowerCase().startsWith("en.") ? "en" : null;
  const localeCookie = cookieStore.get("kanaa_locale")?.value;
  const lang = localeFromHost ?? (localeCookie === "en" ? "en" : "es");

  return (
    <html lang={lang} className={`${robotoSerif.variable} ${gilroy.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="bg-[url('/svg/main.svg')] bg-contain bg-top bg-repeat p-1.5 xl:p-4">
        {children}
      </body>
    </html>
  );
}
