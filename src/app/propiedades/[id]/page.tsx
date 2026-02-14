"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CircleButton, Text } from "@/components/atoms";
import { ErrorState } from "@/components/molecules/ErrorState";
import { LoadingState } from "@/components/molecules/LoadingState";
import { NotFoundState } from "@/components/molecules/NotFoundState";
import { Button } from "@/components/molecules";
import { PropertyCarousel } from "@/components/organisms/PropertyCarousel";
import { PropertyDetails } from "@/components/organisms/PropertyDetails";
import { useProperty } from "@/hooks/useProperty";

import type { ApiResponse, Property } from "@/types/property";

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { property, isLoading, error } = useProperty(id);
  const [listings, setListings] = useState<Property[]>([]);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(
    typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 4,
  );

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 4);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setListingsLoading(true);
        setListingsError(null);

        const response = await fetch(
          `/api/hostaway/listings?limit=${itemsPerPage * 3}`,
        );

        if (!response.ok) {
          throw new Error("Error al cargar listings");
        }

        const data = (await response.json()) as ApiResponse<Property[]>;
        setListings(data.result || []);
      } catch (err) {
        setListingsError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setListingsLoading(false);
      }
    };

    void fetchListings();
  }, [itemsPerPage]);

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
    "AIzaSyCFzAPw7K-QhDDh5_Oswa7oMEqn_KCCWsc";
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

        <div className="mt-12 w-full border-t border-t-[#D9D4CC] pt-10">
          <Text
            className="text-green-normal"
            size="2xl"
            weight="bold"
            font="gilroy"
          >
            Qué debes saber
          </Text>

          <div className="mt-8 grid w-full grid-cols-1 gap-10 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="text-gold-normal mt-1">
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <Text
                  className="text-green-normal"
                  font="gilroy"
                  size="xl"
                  weight="bold"
                >
                  Política de cancelación
                </Text>
                <Text
                  className="text-grey-darker mt-2"
                  font="gilroy"
                  size="base"
                >
                  Cancelación gratuita durante 24 horas. Pasado <br /> ese
                  plazo, la reservación no será reembolsable. <br /> Consulta la
                  política completa de este anfitrión <br /> para obtener más
                  información.
                </Text>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-gold-normal mt-1">
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <Text
                  className="text-green-normal"
                  font="gilroy"
                  size="xl"
                  weight="bold"
                >
                  Reglas de la casa
                </Text>
                <div className="text-grey-darker font-gilroy mt-2 space-y-1 text-base">
                  <div>Llegada a partir de las 2:00 p.m.</div>
                  <div>Salida antes de las 11:00 a.m.</div>
                  <div>2 huéspedes como máximo</div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-gold-normal mt-1">
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <Text
                  className="text-green-normal"
                  font="gilroy"
                  size="xl"
                  weight="bold"
                >
                  Seguridad y propiedad
                </Text>
                <div className="text-grey-darker font-gilroy mt-2 space-y-1 text-base">
                  <div>Alarma de monóxido de carbono</div>
                  <div>Alarma de humo</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 w-full border-t border-t-[#D9D4CC] pt-14 text-center">
          <Text className="text-green-normal" size="5xl">
            Algunas sugerencias
          </Text>
          <Text className="text-grey-darker mt-3" font="gilroy" size="lg">
            Te pueden interesar otras casas para tu relajación.
          </Text>

          <Button
            variant="primary"
            textWeight="bold"
            className="text-gold-normal-hover! mt-6 font-bold"
            href="/propiedades"
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Ver todos los alojamientos
          </Button>

          <PropertyCarousel
            listings={listings}
            loading={listingsLoading}
            error={listingsError}
            itemsPerPage={itemsPerPage}
            className="mt-10"
          />
        </div>
      </div>
    </main>
  );
}
