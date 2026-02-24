"use client";

import { useRouter } from "next/navigation";

import { Text } from "@/components/atoms";
import { PropertyCard } from "@/components/molecules";
import {
  ReservationSearch,
  type ReservationSearchInitialFilters,
  type SearchFilters,
} from "@/components/organisms";
import { useI18n } from "@/i18n";

import type { Property } from "@/types/property";

type PropertyListTemplateProps = {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  fetchProperties: (filters?: SearchFilters) => void;
  handleSearch: (filters: SearchFilters) => void;
  initialFilters?: ReservationSearchInitialFilters;
  totalCount: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const PropertyListTemplate = ({
  properties,
  isLoading,
  error,
  fetchProperties,
  handleSearch,
  initialFilters,
  totalCount,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PropertyListTemplateProps) => {
  const router = useRouter();
  const { t } = useI18n();
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginationPages = (() => {
    const pages: number[] = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }
    return pages;
  })();

  return (
    <div>
      <section className="sm:bg-white">
        <div className="text-green-normal mx-auto flex w-[96%] flex-col items-center justify-center bg-white px-3 pt-24 pb-5 sm:bg-none sm:pt-40">
          <Text weight="medium" size="5xl">
            Conoce todas nuestras propiedades
          </Text>

          <Text className="mt-5" size="lg" font="gilroy">
            Revisa nuestro catálogo completo de propiedades disponibles y
            encuentra la ideal para ti.
          </Text>

          <ReservationSearch
            className="mt-10 w-full border-[#ddd] p-0! sm:border"
            onSearch={handleSearch}
            initialFilters={initialFilters}
          />
        </div>

        <div className="sn:px-3 py-5 sm:px-14">
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
                {t("Reintentar")}
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
            <>
              <div className="mx-auto grid w-[96%] grid-cols-1 gap-6 bg-white p-5 md:mx-auto md:max-w-7xl md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                      price={property.price}
                      priceLabel="por noche"
                      listingId={property.id.toString()}
                      onClick={() => router.push(`/propiedades/${property.id}`)}
                    />
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-4 pb-10">
                  <Text size="sm" font="gilroy" className="text-gray-500">
                    Página {currentPage} de {totalPages}
                  </Text>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("Anterior")}
                    </button>

                    {paginationPages.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`h-9 w-9 cursor-pointer rounded-lg text-sm transition ${
                          page === currentPage
                            ? "bg-green-normal text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        onPageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t("Siguiente")}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
