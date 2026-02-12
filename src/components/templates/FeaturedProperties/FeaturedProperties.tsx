"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import {
  useEffect,
  useState,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from "react";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import { PropertyCarousel } from "@/components/organisms";

import type { ApiResponse, Property } from "@/types/property";

type FeaturedPropertiesProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {};

export const FeaturedProperties = ({
  className,
  ...rest
}: FeaturedPropertiesProps) => {
  const [listings, setListings] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
    void fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/hostaway/listings?limit=${itemsPerPage * 3}`,
      );

      if (!response.ok) {
        throw new Error("Error al cargar listings");
      }

      const data = (await response.json()) as ApiResponse<Property[]>;
      setListings(data.result || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`flex flex-col items-center justify-center bg-white px-4 py-24 text-center ${className}`}
      {...rest}
    >
      <Text size="5xl" className="text-green-normal mb-5">
        Conoce nuestros alojamientos
      </Text>
      <Text size="lg" font="gilroy" className="text-grey-darker">
        Todos nuestros alojamientos están destinado a que pases una estadía de
        relajación.
      </Text>

      <Button
        variant="primary"
        textWeight="bold"
        className="text-gold-normal-hover! mt-10 font-bold"
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
        loading={loading}
        error={error}
        itemsPerPage={itemsPerPage}
        className="mt-10"
      />
    </section>
  );
};
