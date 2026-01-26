'use client';

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, type DetailedHTMLProps, type HTMLAttributes } from "react";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import { PropertyCarousel } from "@/components/organisms";

import type { ApiResponse, Property } from "@/types/property";

type FeaturedPropertiesProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {}

export const FeaturedProperties = ({ className, ...rest }: FeaturedPropertiesProps) => {
    const [listings, setListings] = useState<Property[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        void fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/hostaway/listings?limit=12');

            if (!response.ok) {
                throw new Error('Error al cargar listings');
            }

            const data = await response.json() as ApiResponse<Property[]>;
            setListings(data.result || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={`py-24 px-4 flex items-center justify-center flex-col bg-white ${className}`} {...rest}>
            <Text size="5xl" className="mb-5 text-green-normal">
                Conoce nuestros alojamientos
            </Text>
            <Text size="lg" font="gilroy" className="text-grey-darker">
                Todos nuestros alojamientos están destinado a que pases una estadía de relajación.
            </Text>

            <Button
                variant="primary"
                textWeight="bold"
                className="font-bold text-gold-normal-hover! mt-10"
                icon={
                    <CircleButton>
                        <ArrowRightIcon
                            className="w-5 text-gold-normal-hover drop-shadow-[0_0_0.5px_currentColor]"
                        />
                    </CircleButton>
                }
            >
                Ver todos los alojamientos
            </Button>

            <PropertyCarousel listings={listings} loading={loading} error={error} className="mt-10" />
        </section>
    )
}
