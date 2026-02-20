"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CarouselButton, PaginationDots } from "@/components/atoms";
import { PropertyCard } from "@/components/molecules";
import { useCarouselPagination } from "@/hooks/useCarouselPagination";

import type { Property } from "@/types/property";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type PropertyCarouselProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  listings?: Property[];
  loading?: boolean;
  error?: string | null;
  itemsPerPage?: number;
};

export const PropertyCarousel = ({
  listings = [],
  loading,
  error,
  itemsPerPage = 4,
  className,
  ...rest
}: PropertyCarouselProps) => {
  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    shouldShowControls,
  } = useCarouselPagination({
    items: listings,
    itemsPerPage,
  });
  const router = useRouter();

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchStart(touch.clientX);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchEnd(touch.clientX);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && shouldShowControls) {
      nextPage();
    }
    if (isRightSwipe && shouldShowControls) {
      prevPage();
    }
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

  const pages = Array.from({
    length: Math.ceil(listings.length / itemsPerPage),
  }).map((_, pageIndex) =>
    listings.slice(
      pageIndex * itemsPerPage,
      pageIndex * itemsPerPage + itemsPerPage,
    ),
  );

  return (
    <section className={className} {...rest}>
      <div className="relative mx-auto w-full max-w-7xl">
        <CarouselButton
          direction="prev"
          onClick={prevPage}
          disabled={!shouldShowControls}
          className="-left-10 hidden sm:block"
        />

        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            {pages.map((page, pageIndex) => (
              <div key={`page-${pageIndex}`} className="w-full shrink-0">
                <div className="grid grid-cols-1 gap-3.75 sm:px-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {page.map((property) => {
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
                        onClick={() =>
                          router.push(`/propiedades/${property.id}`)
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <CarouselButton
          direction="next"
          onClick={nextPage}
          disabled={!shouldShowControls}
          className="-right-10 hidden sm:block"
        />
      </div>

      <PaginationDots
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={goToPage}
      />
    </section>
  );
};
