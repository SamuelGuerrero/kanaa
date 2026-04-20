"use client";

import { useState } from "react";

import { CarouselButton, PaginationDots } from "@/components/atoms";
import { TestimonialCard } from "@/components/molecules";
import { useCarouselPagination } from "@/hooks/useCarouselPagination";

import type { DetailedHTMLProps, HTMLAttributes, TouchEvent } from "react";

export type Testimonial = {
  id: number;
  name: string;
  role?: string;
  rating: number;
  testimonial: string;
  avatarUrl?: string;
};

type TestimonialCarouselProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  testimonials: Testimonial[];
  loading?: boolean;
  error?: string | null;
  itemsPerPage?: number;
};

export const TestimonialCarousel = ({
  testimonials,
  loading = false,
  error = null,
  itemsPerPage = 3,
  className,
  ...rest
}: TestimonialCarouselProps) => {
  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    shouldShowControls,
  } = useCarouselPagination({
    items: testimonials,
    itemsPerPage,
  });

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0);
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchStart(touch.clientX);
    }
  };

  const onTouchMove = (e: TouchEvent) => {
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
      <section className={className} {...rest}>
        <div className="flex min-h-100 items-center justify-center">
          <div className="text-center">
            <div className="border-gold-normal mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="text-gray-600">Cargando testimonios...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={className} {...rest}>
        <div className="flex min-h-100 items-center justify-center text-center text-red-500">
          <div>
            <p className="mb-2 text-xl font-semibold">
              Error al cargar testimonios
            </p>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className={className} {...rest}>
        <div className="flex min-h-100 items-center justify-center text-center">
          <p className="text-gray-600">No hay testimonios disponibles</p>
        </div>
      </section>
    );
  }

  const pages = Array.from({
    length: Math.ceil(testimonials.length / itemsPerPage),
  }).map((_, pageIndex) =>
    testimonials.slice(
      pageIndex * itemsPerPage,
      pageIndex * itemsPerPage + itemsPerPage,
    ),
  );

  return (
    <section className={className} {...rest}>
      <div className="relative mx-auto mr-3 w-full max-w-6xl">
        <CarouselButton
          direction="prev"
          onClick={prevPage}
          disabled={!shouldShowControls}
          className="-left-12 hidden xl:block"
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
                <div className="grid grid-cols-1 gap-6 px-2 sm:px-4 md:grid-cols-2 lg:grid-cols-3">
                  {page.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      name={testimonial.name}
                      role={testimonial.role}
                      rating={testimonial.rating}
                      testimonial={testimonial.testimonial}
                      avatarUrl={testimonial.avatarUrl}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <CarouselButton
          direction="next"
          onClick={nextPage}
          disabled={!shouldShowControls}
          className="-right-12 hidden xl:block"
        />
      </div>

      {shouldShowControls && (
        <PaginationDots
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={goToPage}
        />
      )}
    </section>
  );
};
