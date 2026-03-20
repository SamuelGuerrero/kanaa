import { siteConfig } from "@/lib/seo";
import { getListings } from "@/server/hostaway/listings";

import type { MetadataRoute } from "next";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/es", changeFrequency: "weekly", priority: 1 },
  { path: "/es/properties", changeFrequency: "daily", priority: 0.9 },
  { path: "/es/property-management", changeFrequency: "weekly", priority: 0.9 },
  { path: "/es/calculator", changeFrequency: "weekly", priority: 0.8 },
  { path: "/es/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/es/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/es/join", changeFrequency: "monthly", priority: 0.6 },
  { path: "/es/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/es/vacancies", changeFrequency: "weekly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const listings = await getListings({ limit: 200 });

    const dynamicUrls: MetadataRoute.Sitemap = listings
      .filter((listing) => listing?.id)
      .map((listing) => ({
        url: `${siteConfig.siteUrl}/properties/${listing.id}`,
        lastModified: listing.latestActivityOn
          ? new Date(listing.latestActivityOn)
          : now,
        changeFrequency: "daily",
        priority: 0.8,
      }));

    return [...staticUrls, ...dynamicUrls];
  } catch {
    return staticUrls;
  }
}
