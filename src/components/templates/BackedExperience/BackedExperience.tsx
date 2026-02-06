"use client";

import { useEffect, useState } from "react";

import { Text } from "@/components/atoms";
import { TestimonialCarousel, type Testimonial } from "@/components/organisms";

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

export const BackedExperience = () => {
  const [itemsPerPage, setItemsPerPage] = useState(
    typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 3,
  );
  const [displayedTestimonials, setDisplayedTestimonials] =
    useState(mockTestimonials);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640;
      setItemsPerPage(isMobile ? 1 : 3);
      setDisplayedTestimonials(
        isMobile ? mockTestimonials.slice(0, 3) : mockTestimonials,
      );
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="flex flex-col items-center bg-white px-4 py-16 text-center">
      <Text size="5xl" className="text-green-normal">
        Experiencias que nos respaldan
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-6 mb-8">
        Huéspedes y propietarios comparten cómo KANNA transformó su forma de
        viajar y de gestionar sus propiedades.
      </Text>
      <TestimonialCarousel
        testimonials={displayedTestimonials}
        itemsPerPage={itemsPerPage}
      />
    </section>
  );
};
