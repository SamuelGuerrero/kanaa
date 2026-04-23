/**
 * Schema.org JSON-LD factories for structured data.
 * All schemas follow schema.org v26+ and Google's Rich Results guidelines.
 */

import { siteConfig, toAbsoluteUrl } from "@/lib/seo";

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

type SchemaBase = Record<string, unknown>;

/** Wraps a schema object with the @context declaration. */
const withContext = <T extends SchemaBase>(schema: T) => ({
  "@context": "https://schema.org",
  ...schema,
});

// ---------------------------------------------------------------------------
// Organization + WebSite (root layout)
// ---------------------------------------------------------------------------

export const organizationSchema = () =>
  withContext({
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    logo: {
      "@type": "ImageObject",
      url: toAbsoluteUrl("/favicon.ico"),
      width: 512,
      height: 512,
    },
    description: siteConfig.description,
    foundingDate: "2021",
    areaServed: {
      "@type": "Country",
      name: "México",
    },
    knowsLanguage: ["es", "en"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["Spanish", "English"],
        url: `${siteConfig.siteUrl}/es/contact`,
      },
    ],
    sameAs: [
      "https://www.instagram.com/kanaa.house",
      "https://www.facebook.com/kanaa.house",
    ],
  });

export const webSiteSchema = () =>
  withContext({
    "@type": "WebSite",
    "@id": `${siteConfig.siteUrl}/#website`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
    inLanguage: ["es-MX", "en-US"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.siteUrl}/es/properties?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });

// ---------------------------------------------------------------------------
// LocalBusiness / Property Management Company (home + property-management)
// ---------------------------------------------------------------------------

export const localBusinessSchema = () =>
  withContext({
    "@type": ["LocalBusiness", "LodgingBusiness"],
    "@id": `${siteConfig.siteUrl}/#localbusiness`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    image: toAbsoluteUrl("/og-image.png"),
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "MX",
      addressRegion: "México",
    },
    areaServed: {
      "@type": "Country",
      name: "México",
    },
    priceRange: "$$",
    openingHours: "Mo-Su 00:00-23:59",
    knowsLanguage: ["es", "en"],
    parentOrganization: { "@id": `${siteConfig.siteUrl}/#organization` },
  });

// ---------------------------------------------------------------------------
// FAQPage — accepts a DataHome / DataPropertyManagment-style array
// ---------------------------------------------------------------------------

type FAQItem = { question: string; answer: string };

export const faqPageSchema = (items: readonly FAQItem[]) =>
  withContext({
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

type BreadcrumbItem = { name: string; url: string };

export const breadcrumbSchema = (items: BreadcrumbItem[]) =>
  withContext({
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  });

// ---------------------------------------------------------------------------
// Vacation Rental / Lodging property (property detail page)
// ---------------------------------------------------------------------------

type VacationRentalSchemaInput = {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  pricePerNight?: number;
  rating?: number;
  reviewCount?: number;
  locale?: "es" | "en";
};

export const vacationRentalSchema = ({
  id,
  name,
  description,
  image,
  city,
  state,
  country,
  address,
  bedrooms,
  bathrooms,
  maxGuests,
  pricePerNight,
  rating,
  reviewCount,
  locale = "es",
}: VacationRentalSchemaInput) => {
  const propertyUrl = `${siteConfig.siteUrl}/${locale}/properties/${id}`;

  const schema: SchemaBase = {
    "@type": "LodgingBusiness",
    "@id": `${propertyUrl}#property`,
    name,
    url: propertyUrl,
    description:
      description ??
      "Propiedad vacacional administrada por Kanaa con servicio integral.",
    image: image ? toAbsoluteUrl(image) : toAbsoluteUrl("/og-image.png"),
    provider: { "@id": `${siteConfig.siteUrl}/#organization` },
  };

  // Address
  if (city ?? state ?? country ?? address) {
    schema.address = {
      "@type": "PostalAddress",
      ...(address ? { streetAddress: address } : {}),
      ...(city ? { addressLocality: city } : {}),
      ...(state ? { addressRegion: state } : {}),
      ...(country ? { addressCountry: country } : {}),
    };
  }

  // Amenity details
  if (bedrooms != null) schema.numberOfRooms = bedrooms;
  if (bathrooms != null)
    schema.amenityFeature = [
      {
        "@type": "LocationFeatureSpecification",
        name: "Bathrooms",
        value: bathrooms,
      },
    ];
  if (maxGuests != null)
    schema.occupancy = {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: maxGuests,
    };

  // Price
  if (pricePerNight != null) {
    schema.priceRange = `MXN ${pricePerNight}+`;
  }

  // Aggregate rating
  if (rating != null && rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      bestRating: "10",
      worstRating: "1",
      ...(reviewCount != null ? { reviewCount } : {}),
    };
  }

  return withContext(schema);
};

// ---------------------------------------------------------------------------
// Service offering (property management page)
// ---------------------------------------------------------------------------

export const propertyManagementServiceSchema = () =>
  withContext({
    "@type": "Service",
    "@id": `${siteConfig.siteUrl}/es/property-management#service`,
    name: "Gestión de Propiedades Vacacionales",
    description:
      "Kanaa ofrece gestión integral de propiedades vacacionales: publicación, reservas, atención a huéspedes, limpieza y mantenimiento.",
    provider: { "@id": `${siteConfig.siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "México" },
    serviceType: "Property Management",
    url: `${siteConfig.siteUrl}/es/property-management`,
    offers: {
      "@type": "Offer",
      priceCurrency: "MXN",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Comisión basada en rendimiento de la propiedad",
      },
    },
  });
