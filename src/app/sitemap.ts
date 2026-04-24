import { siteConfig } from "@/lib/seo";
import { getListings } from "@/server/hostaway/listings";

import type { MetadataRoute } from "next";

type StaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

/** Public routes (path without locale prefix). */
const PUBLIC_ROUTES: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/properties", changeFrequency: "daily", priority: 0.9 },
  { path: "/property-management", changeFrequency: "weekly", priority: 0.9 },
  { path: "/calculator", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/join", changeFrequency: "monthly", priority: 0.6 },
];

const LOCALES = ["es", "en"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const { siteUrl } = siteConfig;

  // Static routes — generate one entry per locale
  const staticUrls: MetadataRoute.Sitemap = PUBLIC_ROUTES.flatMap((route) =>
    LOCALES.map((locale) => {
      const pathSuffix = route.path === "/" ? "" : route.path;
      return {
        url: `${siteUrl}/${locale}${pathSuffix}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            es: `${siteUrl}/es${pathSuffix}`,
            en: `${siteUrl}/en${pathSuffix}`,
          },
        },
      };
    }),
  );

  try {
    const listings = await getListings({ limit: 500 });

    const dynamicUrls: MetadataRoute.Sitemap = listings
      .filter((listing) => listing?.id)
      .flatMap((listing) => {
        const lastMod = listing.latestActivityOn
          ? new Date(listing.latestActivityOn)
          : now;

        return LOCALES.map((locale) => ({
          url: `${siteUrl}/${locale}/properties/${listing.id}`,
          lastModified: lastMod,
          changeFrequency: "daily" as const,
          priority: 0.8,
          alternates: {
            languages: {
              es: `${siteUrl}/es/properties/${listing.id}`,
              en: `${siteUrl}/en/properties/${listing.id}`,
            },
          },
        }));
      });

    return [...staticUrls, ...dynamicUrls];
  } catch {
    return staticUrls;
  }
}
