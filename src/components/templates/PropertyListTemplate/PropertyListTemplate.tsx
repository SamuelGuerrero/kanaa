"use client";

import { useRouter } from "next/navigation";

import { Text } from "@/components/atoms";
import { PropertyCard } from "@/components/molecules";
import {
  ReservationSearch,
  type ReservationSearchInitialFilters,
  type SearchFilters,
} from "@/components/organisms";

import type { Property } from "@/types/property";

type PropertyListTemplateProps = {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  fetchProperties: (filters?: SearchFilters) => void;
  handleSearch: (filters: SearchFilters) => void;
  initialFilters?: ReservationSearchInitialFilters;
};

export const PropertyListTemplate = ({
  properties,
  isLoading,
  error,
  fetchProperties,
  handleSearch,
  initialFilters,
}: PropertyListTemplateProps) => {
  const router = useRouter();

  return (
    <div>
      <section className="bg-white">
        <div className="text-green-normal flex w-full flex-col items-center justify-center pt-40">
          <Text size="5xl">Conoce todas nuestras propiedades</Text>

          <Text className="mt-5" size="lg" font="gilroy">
            Revisa nuestro catálogo completo de propiedades disponibles y
            encuentra la ideal para ti.
          </Text>

          <ReservationSearch
            className="mt-10 border border-[#ddd]"
            onSearch={handleSearch}
            initialFilters={initialFilters}
          />
        </div>

        <div className="px-14 py-10">
          {error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Text size="2xl" weight="bold" className="text-red-600">
                Error al cargar propiedades
              </Text>
              <Text size="lg" font="gilroy" className="mt-2 text-gray-500">
                {error}
              </Text>
              <button
                onClick={() => void fetchProperties()}
                className="bg-green-normal hover:bg-green-dark mt-4 rounded-lg px-6 py-2 text-white"
              >
                Reintentar
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="border-gold-normal mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                <Text size="xl" font="gilroy">
                  Cargando propiedades...
                </Text>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Text size="2xl" weight="bold" className="text-gray-600">
                No se encontraron propiedades
              </Text>
              <Text size="lg" font="gilroy" className="mt-2 text-gray-500">
                Intenta ajustar tus filtros de búsqueda
              </Text>
            </div>
          ) : (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((property) => {
                const imageUrl =
                  property.listingImages?.[0]?.url ?? property.thumbnailUrl;

                return (
                  <PropertyCard
                    key={property.id}
                    image={imageUrl}
                    guests={property.personCapacity}
                    bedrooms={property.bedroomsNumber}
                    bathrooms={property.bathroomsNumber}
                    rating={property.averageReviewRating / 2 || 0}
                    title={property.name}
                    price={2 * property.price}
                    priceLabel="por 2 noches"
                    onClick={() => router.push(`/propiedades/${property.id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
