import { siteConfig } from "@/lib/seo";

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout/",
          "/booking-success/",
          "/booking-confirmation/",
          "/reservation-tracking/",
          "/_next/",
        ],
      },
      // Allow Googlebot full access to public pages
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout/",
          "/booking-success/",
          "/booking-confirmation/",
          "/reservation-tracking/",
        ],
      },
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl,
  };
}
