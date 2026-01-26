"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, type DetailedHTMLProps, type HTMLAttributes } from "react";

import { PropertyCard } from "@/components/molecules";

import type { Property } from "@/types/property";

type PropertyCarouselProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  listings?: Property[];
  loading?: boolean;
  error?: string | null;
};

export const PropertyCarousel = ({
  listings = [],
  loading,
  error,
  className,
  ...rest
}: PropertyCarouselProps) => {
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <section>
        <div className="flex min-h-100 items-center justify-center">
          <div className="text-center">
            <div className="border-gold-normal mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="flex min-h-100 items-center justify-center text-center text-red-500">
          <div>
            <p className="mb-2 text-xl font-semibold">
              Error al cargar propiedades
            </p>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const startIndex = currentPage * itemsPerPage;
  const visibleListings = listings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className={className} {...rest}>
      <div className="relative">
        <button
          onClick={prevPage}
          className="bg-gold-light-hover absolute top-1/2 -left-6 z-10 -translate-x-4 -translate-y-1/2 cursor-pointer rounded-full p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          disabled={listings.length <= itemsPerPage}
          aria-label="Anterior"
        >
          <ChevronLeftIcon className="text-gold-normal-hover h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 gap-6 px-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleListings.map((property) => {
            const imageUrl =
              property.listingImages?.[0]?.url ?? property.thumbnailUrl;
            return (
              <PropertyCard
                key={property.id}
                image={imageUrl}
                guests={property.personCapacity}
                bedrooms={property.bedroomsNumber}
                bathrooms={property.bathroomsNumber}
                rating={property.averageReviewRating || 0}
                title={property.name}
                price={2 * property.price}
                priceLabel="por 2 noches"
              />
            );
          })}
        </div>

        <button
          onClick={nextPage}
          className="bg-gold-light-hover absolute top-1/2 -right-6 z-10 translate-x-4 -translate-y-1/2 cursor-pointer rounded-full p-3 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          disabled={listings.length <= itemsPerPage}
          aria-label="Siguiente"
        >
          <ChevronRightIcon className="text-gold-normal-hover h-6 w-6" />
        </button>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`h-3.75 w-3.75 cursor-pointer rounded-full transition-all ${
                currentPage === index
                  ? "bg-gold-normal w-[37.5px]"
                  : "bg-gold-light-active hover:bg-gold-light-active"
              }`}
              aria-label={`Ir a página ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
