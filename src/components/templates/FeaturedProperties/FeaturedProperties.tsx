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
> & {
  title?: string | null;
  subtitle?: string | null;
  buttonLabel?: string | null;
};

export const FeaturedProperties = ({
  className,
  title,
  subtitle,
  buttonLabel,
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
      className={`flex flex-col justify-center bg-white px-3.5 py-8 shadow md:items-center md:py-22 md:text-center ${className}`}
      {...rest}
    >
      <Text size="5xl" className="text-green-normal mb-5">
        {title ?? "Conoce nuestros alojamientos"}
      </Text>
      <Text size="lg" font="gilroy" className="text-grey-darker">
        {subtitle ??
          "Todos nuestros alojamientos están pensados para que disfrutes de una estadía placentera y relajante."}
      </Text>

      <Button
        variant="primary"
        textWeight="bold"
        className="text-gold-normal-hover! mt-5 w-fit font-bold md:mt-10"
        href="/properties"
        icon={
          <CircleButton>
            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        }
      >
        {buttonLabel ?? "Ver todos los alojamientos"}
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
