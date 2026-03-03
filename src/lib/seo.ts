import type { Metadata } from "next";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
};

const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_OG_IMAGE = "/favicon.ico";

const normalizeSiteUrl = (rawUrl: string) => {
  const withProtocol = /^https?:\/\//i.test(rawUrl)
    ? rawUrl
    : `https://${rawUrl}`;

  return withProtocol.replace(/\/$/, "");
};

const resolveSiteUrl = () => {
  const fromPublicEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromPublicEnv) {
    return normalizeSiteUrl(fromPublicEnv);
  }

  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (fromVercel) {
    return normalizeSiteUrl(fromVercel);
  }

  const fromVercelPreview = process.env.VERCEL_URL;
  if (fromVercelPreview) {
    return normalizeSiteUrl(fromVercelPreview);
  }

  return DEFAULT_SITE_URL;
};

export const siteConfig = {
  name: "Kanaa",
  defaultTitle: "Kanaa | Gestión de propiedades vacacionales",
  description:
    "Kanaa transforma propiedades en activos rentables con gestión integral, optimización de ingresos y experiencias excepcionales para huéspedes.",
  locale: "es_MX",
  siteUrl: resolveSiteUrl(),
};

export const toAbsoluteUrl = (path: string) => {
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
}: PageMetadataOptions): Metadata => {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const absoluteImage = toAbsoluteUrl(image);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - ${title}`,
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
