"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CarouselButton, PaginationDots } from "@/components/atoms";
import { PropertyCard } from "@/components/molecules";
import { useCarouselPagination } from "@/hooks/useCarouselPagination";
import { useI18n } from "@/i18n";

import type { Property } from "@/types/property";
import type { DetailedHTMLProps, HTMLAttributes, TouchEvent } from "react";

type PropertyCarouselProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  listings?: Property[];
  loading?: boolean;
  error?: string | null;
  itemsPerPage?: number;
};

/**
 * Returns how many cards to show per slide depending on the viewport width.
 *   < 640px  → 1  (mobile, full-width card)
 *   640–1023 → 2  (tablet, 2 cards side by side)
 *  1024–1279 → 3  (small desktop)
 *  ≥ 1280    → 4  (large desktop)
 */
const getItemsPerPage = (width: number) => {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  if (width < 1280) return 3;
  return 4;
};

const useResponsiveItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const update = () => setItemsPerPage(getItemsPerPage(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return itemsPerPage;
};

export const PropertyCarousel = ({
  listings = [],
  loading,
  error,
  className,
  itemsPerPage: itemsPerPageProp,
  ...rest
}: PropertyCarouselProps) => {
  const { t, locale } = useI18n();
  const responsiveItemsPerPage = useResponsiveItemsPerPage();
  const itemsPerPage = itemsPerPageProp ?? responsiveItemsPerPage;

  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    shouldShowControls,
  } = useCarouselPagination({ items: listings, itemsPerPage });

  const router = useRouter();
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0);
    const touch = e.targetTouches[0];
    if (touch) setTouchStart(touch.clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) setTouchEnd(touch.clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && shouldShowControls) nextPage();
    if (distance < -minSwipeDistance && shouldShowControls) prevPage();
  };

  if (loading) {
    return (
      <section>
        <div className="flex min-h-100 items-center justify-center">
          <div className="text-center">
            <div className="border-gold-normal mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2" />
            <p className="text-gray-600">{t("Cargando propiedades...")}</p>
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
              {t("Error al cargar propiedades")}
            </p>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const pages = Array.from({
    length: Math.ceil(listings.length / itemsPerPage),
  }).map((_, i) =>
    listings.slice(i * itemsPerPage, i * itemsPerPage + itemsPerPage),
  );

  const gridColsClass =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    }[itemsPerPage] ?? "grid-cols-4";

  return (
    <section className={className} {...rest}>
      <div className="relative mx-auto w-full max-w-7xl">
        <CarouselButton
          direction="prev"
          onClick={prevPage}
          disabled={!shouldShowControls}
          className="hidden md:left-6 md:block xl:-left-10"
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
              <div
                key={`page-${pageIndex}`}
                className="w-full shrink-0 md:flex md:justify-center lg:block"
              >
                <div
                  className={`grid gap-3.75 text-left sm:px-4 ${gridColsClass}`}
                >
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
                        city={property.city}
                        state={property.state}
                        country={property.country}
                        priceLabel="por noche"
                        listingId={property.id.toString()}
                        onClick={() =>
                          router.push(`/${locale}/properties/${property.id}`)
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
          className="hidden md:right-6 md:block xl:-right-10"
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
