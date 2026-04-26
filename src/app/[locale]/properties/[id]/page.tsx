import { StructuredData } from "@/components/atoms";
import { PropertyDetailsClient } from "@/components/organisms";
import { breadcrumbSchema, vacationRentalSchema } from "@/lib/schemas";
import { createPageMetadata, toAbsoluteUrl, type SiteLocale } from "@/lib/seo";
import { getListingById } from "@/server/hostaway/listings";

import type { Metadata } from "next";

type PropertyDetailsRouteProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({
  params,
}: PropertyDetailsRouteProps): Promise<Metadata> {
  const { id, locale } = await params;
  const siteLocale = (locale === "en" ? "en" : "es") as SiteLocale;

  try {
    const property = await getListingById(id);
    const city = property.city?.trim();
    const title = city
      ? `${property.name} en ${city}`
      : `${property.name} | Propiedad vacacional`;
    const description =
      property.description?.slice(0, 155) ||
      "Detalle de propiedad vacacional administrada por Kanaa.";
    const image = property.thumbnailUrl || "/og-image.png";

    return createPageMetadata({
      title,
      description,
      path: `/properties/${id}`,
      image: toAbsoluteUrl(image),
      locale: siteLocale,
    });
  } catch {
    return createPageMetadata({
      title: "Detalle de Propiedad",
      description:
        "Consulta amenidades, ubicación y disponibilidad de propiedades vacacionales administradas por Kanaa.",
      path: `/properties/${id}`,
      locale: siteLocale,
    });
  }
}

export default async function PropertyDetailsRoute({
  params,
}: PropertyDetailsRouteProps) {
  const { id, locale } = await params;
  const siteLocale = (locale === "en" ? "en" : "es") as SiteLocale;

  // Fetch property for structured data (best-effort — errors are non-fatal)
  let propertySchema: ReturnType<typeof vacationRentalSchema> | null = null;
  let breadcrumb: ReturnType<typeof breadcrumbSchema> | null = null;

  try {
    const property = await getListingById(id);
    const city = property.city?.trim();

    propertySchema = vacationRentalSchema({
      id,
      name: property.name,
      description: property.description?.slice(0, 300),
      image: property.thumbnailUrl || undefined,
      city,
      state: property.state,
      country: property.country,
      address: property.publicAddress || property.street,
      bedrooms: property.bedroomsNumber,
      bathrooms: property.bathroomsNumber,
      maxGuests: property.personCapacity,
      pricePerNight: property.price,
      rating:
        property.averageReviewRating > 0
          ? property.averageReviewRating
          : undefined,
      locale: siteLocale,
    });

    breadcrumb = breadcrumbSchema([
      { name: "Inicio", url: `/${locale}` },
      { name: "Propiedades", url: `/${locale}/properties` },
      {
        name: city ? `${property.name} — ${city}` : property.name,
        url: `/${locale}/properties/${id}`,
      },
    ]);
  } catch {
    // Structured data is best-effort — don't fail the page
  }

  return (
    <>
      {propertySchema && <StructuredData data={propertySchema} />}
      {breadcrumb && <StructuredData data={breadcrumb} />}
      <PropertyDetailsClient id={id} />
    </>
  );
}
