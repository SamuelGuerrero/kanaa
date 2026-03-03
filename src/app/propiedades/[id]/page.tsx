
import { createPageMetadata, toAbsoluteUrl } from "@/lib/seo";
import { getListingById } from "@/server/hostaway/listings";

import { PropertyDetailsClient } from "./PropertyDetailsClient";

import type { Metadata } from "next";

type PropertyDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PropertyDetailsRouteProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getListingById(id);
    const city = property.city?.trim();
    const title = city
      ? `${property.name} en ${city}`
      : `${property.name} | Propiedad vacacional`;
    const description =
      property.description?.slice(0, 155) ||
      "Detalle de propiedad vacacional administrada por Kanaa.";
    const image = property.thumbnailUrl || "/favicon.ico";

    return createPageMetadata({
      title,
      description,
      path: `/propiedades/${id}`,
      image: toAbsoluteUrl(image),
    });
  } catch {
    return createPageMetadata({
      title: "Detalle de Propiedad",
      description:
        "Consulta amenidades, ubicación y disponibilidad de propiedades vacacionales administradas por Kanaa.",
      path: `/propiedades/${id}`,
    });
  }
}

export default async function PropertyDetailsRoute({
  params,
}: PropertyDetailsRouteProps) {
  const { id } = await params;
  return <PropertyDetailsClient id={id} />;
}
