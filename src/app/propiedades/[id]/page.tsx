"use client";

import { useParams } from "next/navigation";

import { Text } from "@/components/atoms";
import { ErrorState } from "@/components/molecules/ErrorState";
import { LoadingState } from "@/components/molecules/LoadingState";
import { NotFoundState } from "@/components/molecules/NotFoundState";
import { PropertyDetails } from "@/components/organisms/PropertyDetails";
import { useProperty } from "@/hooks/useProperty";

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { property, isLoading, error } = useProperty(id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!property) {
    return <NotFoundState />;
  }

  const hasCoordinates =
    Number.isFinite(property.lat) && Number.isFinite(property.lng);
  const lat = property.lat;
  const lng = property.lng;
  const googleMapsKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ??
    "AIzaSyBBEdLc_mvADyvULxPr8wbmAh-yQ4ThPz4";
  const mapSrc =
    hasCoordinates && googleMapsKey
      ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${lat.toFixed(
          6,
        )},${lng.toFixed(6)}`
      : "";

  console.log(
    "Tiene coordenadas",
    hasCoordinates,
    lat,
    lng,
    googleMapsKey,
    mapSrc,
  );
  return (
    <main className="flex w-full flex-col items-center bg-white">
      <PropertyDetails property={property} />
      <div className="bg-grey-light-hover flex w-full flex-col items-center p-15">
        <Text className="text-green-normal" size="4xl">
          Dónde te vas a quedar
        </Text>
        <Text className="text-gold-darker mt-2" font="gilroy" size="lg">
          {property.city}, {property.state}, {property.country}
        </Text>
        <div className="mt-8 w-full">
          {hasCoordinates && mapSrc ? (
            <iframe
              title={`Mapa de ${property.name}`}
              src={mapSrc}
              className="h-[570px] w-full rounded-xl border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-[570px] w-full items-center justify-center rounded-xl bg-white text-center">
              <Text className="text-grey-darker" font="gilroy" size="lg">
                No hay coordenadas disponibles para este alojamiento.
              </Text>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
