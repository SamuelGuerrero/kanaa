import type { Metadata } from "next";

export type SiteLocale = "es" | "en";

type PageMetadataOptions = {
  title: string;
  description: string;
  /** Base path without locale prefix — e.g. "/" or "/properties/123" */
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  /** Locale for canonical URL. Defaults to "es". */
  locale?: SiteLocale;
};

const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_OG_IMAGE = "/og-image.png";

const normalizeSiteUrl = (rawUrl: string) => {
  const withProtocol = /^https?:\/\//i.test(rawUrl)
    ? rawUrl
    : `https://${rawUrl}`;

  return withProtocol.replace(/\/$/, "");
};

const resolveSiteUrl = () => {
  const fromPublicEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromPublicEnv) return normalizeSiteUrl(fromPublicEnv);

  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (fromVercel) return normalizeSiteUrl(fromVercel);

  const fromVercelPreview = process.env.VERCEL_URL;
  if (fromVercelPreview) return normalizeSiteUrl(fromVercelPreview);

  return DEFAULT_SITE_URL;
};

export const siteConfig = {
  name: "Kanaa",
  defaultTitle: "Kanaa | Gestión de propiedades vacacionales",
  description:
    "Kanaa transforma propiedades en activos rentables con gestión integral, optimización de ingresos y experiencias excepcionales para huéspedes.",
  locale: "es_MX" as const,
  siteUrl: resolveSiteUrl(),
};

export const toAbsoluteUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

export const createPageMetadata = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords,
  noIndex = false,
  locale = "es",
}: PageMetadataOptions): Metadata => {
  // Normalize base path
  const basePath = path.startsWith("/") ? path : `/${path}`;
  // Suffix for paths that are exactly "/" → don't double-slash
  const pathSuffix = basePath === "/" ? "" : basePath;

  const canonical = `/${locale}${pathSuffix}`;
  const absoluteImage = toAbsoluteUrl(image);
  const { siteUrl } = siteConfig;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        es: `${siteUrl}/es${pathSuffix}`,
        en: `${siteUrl}/en${pathSuffix}`,
        "x-default": `${siteUrl}/es${pathSuffix}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "es_MX",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : {
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
  };
};
