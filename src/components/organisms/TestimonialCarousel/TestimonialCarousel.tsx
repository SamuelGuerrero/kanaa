"use client";

import { CarouselButton, PaginationDots } from "@/components/atoms";
import { TestimonialCard } from "@/components/molecules";
import { useCarouselPagination } from "@/hooks/useCarouselPagination";

import type { DetailedHTMLProps, HTMLAttributes } from "react";

type Testimonial = {
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
  testimonials?: Testimonial[];
  loading?: boolean;
  error?: string | null;
  itemsPerPage?: number;
};

// Datos mock de testimonios
const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alexander Montes de Oca",
    role: "Huésped",
    rating: 4,
    testimonial:
      "KANNA hizo que nuestras vacaciones en Mérida fueran inolvidables. La casa era hermosa, cómoda y perfectamente equipada. Nos sentimos como en casa desde el primer momento.",
    avatarUrl: "https://picsum.photos/50/50",
  },
  {
    id: 2,
    name: "María García López",
    role: "Huésped verificado",
    rating: 5,
    testimonial:
      "Excelente servicio y atención al detalle. La propiedad superó todas nuestras expectativas. Sin duda volveremos a reservar con KANNA.",
    avatarUrl: "https://picsum.photos/50/50",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    role: "Anfitrión",
    rating: 4.5,
    testimonial:
      "Como anfitrión, KANNA me ha facilitado mucho la gestión de mis propiedades. Plataforma profesional y confiable.",
    avatarUrl: "https://picsum.photos/50/50",
  },
  {
    id: 4,
    name: "Ana Martínez",
    role: "Huésped",
    rating: 5,
    testimonial:
      "La mejor experiencia de alquiler vacacional que hemos tenido. Todo estaba impecable y la comunicación fue excelente.",
    avatarUrl: "https://picsum.photos/50/50",
  },
  {
    id: 5,
    name: "Roberto Sánchez",
    role: "Huésped",
    rating: 4,
    testimonial:
      "Muy buena ubicación y amenidades. El proceso de check-in fue súper sencillo. Recomendado al 100%.",
    avatarUrl: "https://picsum.photos/50/50",
  },
  {
    id: 6,
    name: "Laura Fernández",
    role: "Huésped verificado",
    rating: 4.5,
    testimonial:
      "Una experiencia maravillosa de principio a fin. La propiedad era tal como se mostraba en las fotos, incluso mejor.",
    avatarUrl: "https://picsum.photos/50/50",
  },
  {
    id: 7,
    name: "Diego Morales",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Perfecto para una escapada familiar. Espaciosa, limpia y con todas las comodidades necesarias. Altamente recomendable.",
    avatarUrl: "https://picsum.photos/50/50",
  },
  {
    id: 8,
    name: "Patricia Jiménez",
    role: "Anfitrión",
    rating: 4.5,
    testimonial:
      "KANNA me ha ayudado a gestionar mis propiedades de manera eficiente. El soporte técnico es excelente.",
    avatarUrl: "https://picsum.photos/50/50",
  },
  {
    id: 9,
    name: "Javier Torres",
    role: "Huésped",
    rating: 5,
    testimonial:
      "Increíble atención al cliente y una propiedad de primera clase. Sin duda mi primera opción para futuras vacaciones.",
    avatarUrl: "https://picsum.photos/50/50",
  },
];

export const TestimonialCarousel = ({
  testimonials = mockTestimonials,
  loading = false,
  error = null,
  itemsPerPage = 3,
  className,
  ...rest
}: TestimonialCarouselProps) => {
  const {
    currentPage,
    totalPages,
    visibleItems: visibleTestimonials,
    nextPage,
    prevPage,
    goToPage,
    shouldShowControls,
  } = useCarouselPagination({
    items: testimonials,
    itemsPerPage,
  });

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

  return (
    <section className={className} {...rest}>
      <div className="relative">
        <CarouselButton
          direction="prev"
          onClick={prevPage}
          disabled={!shouldShowControls}
        />

        <div className="grid grid-cols-1 gap-6 px-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleTestimonials.map((testimonial) => (
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

        <CarouselButton
          direction="next"
          onClick={nextPage}
          disabled={!shouldShowControls}
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
