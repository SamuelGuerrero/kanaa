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
import { useI18n } from "@/i18n";

import type { ApiResponse, Property } from "@/types/property";

type FeaturedPropertiesProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  title?: string;
  subtitle?: string;
  buttonText?: string;
};

const getItemsPerPage = (width: number) => {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 4;
};

export const FeaturedProperties = ({
  className,
  title = "Conoce nuestros alojamientos",
  subtitle = "Alojamientos pensados para tu descanso.",
  buttonText = "Ver todos los alojamientos",
  ...rest
}: FeaturedPropertiesProps) => {
  const { locale } = useI18n();
  const [listings, setListings] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(
    typeof window !== "undefined" ? getItemsPerPage(window.innerWidth) : 4,
  );

  useEffect(() => {
    const handleResize = () =>
      setItemsPerPage(getItemsPerPage(window.innerWidth));
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
        {title}
      </Text>
      <Text size="lg" font="gilroy" className="text-grey-darker">
        {subtitle}
      </Text>

      <Button
        variant="primary"
        textWeight="bold"
        className="text-gold-normal-hover! mt-5 w-fit font-bold md:mt-10"
        href={`/${locale}/properties`}
        icon={
          <CircleButton>
            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        }
      >
        {buttonText}
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
