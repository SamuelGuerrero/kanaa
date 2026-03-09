"use client";

import { useEffect, useState } from "react";

import { ErrorState } from "@/components/molecules/ErrorState";
import { LoadingState } from "@/components/molecules/LoadingState";
import { NotFoundState } from "@/components/molecules/NotFoundState";
import { PropertyDetailsPage } from "@/components/templates";
import { useProperty } from "@/hooks/useProperty";

import type { ApiResponse, Property } from "@/types/property";

type PropertyDetailsClientProps = {
  id: string;
};

export function PropertyDetailsClient({ id }: PropertyDetailsClientProps) {
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
        setListingsError(
          err instanceof Error ? err.message : "Error desconocido",
        );
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

  return (
    <PropertyDetailsPage
      property={property}
      hasCoordinates={hasCoordinates}
      mapSrc={mapSrc}
      listings={listings}
      listingsLoading={listingsLoading}
      listingsError={listingsError}
      itemsPerPage={itemsPerPage}
    />
  );
}
