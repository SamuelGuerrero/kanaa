'use client';

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, type DetailedHTMLProps, type HTMLAttributes } from 'react';

import { PropertyCard } from "@/components/molecules";

import type { Property } from '@/types/property'

type PropertyCarouselProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
    listings?: Property[];
    loading?: boolean;
    error?: string | null;
};


export const PropertyCarousel = ({ listings = [], loading, error, className, ...rest }: PropertyCarouselProps) => {
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
                <div className="flex justify-center items-center min-h-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-normal mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando propiedades...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <div className="text-center text-red-500 min-h-100 flex items-center justify-center">
                    <div>
                        <p className="text-xl font-semibold mb-2">Error al cargar propiedades</p>
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
                    className="absolute -left-6 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-gold-light-hover rounded-full p-3 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={listings.length <= itemsPerPage}
                    aria-label="Anterior"
                >
                    <ChevronLeftIcon className="w-6 h-6 text-gold-normal-hover" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8">
                    {visibleListings.map((property) => {
                        const imageUrl = property.listingImages?.[0]?.url ?? property.thumbnailUrl;
                        return (
                            <PropertyCard
                                key={property.id}
                                image={imageUrl}
                                guests={property.personCapacity}
                                bedrooms={property.bedroomsNumber}
                                bathrooms={property.bathroomsNumber}
                                rating={property.averageReviewRating || 0}
                                title={property.name}
                                price={2 * (property.price)}
                                priceLabel="por 2 noches"
                            />
                        );
                    })}
                </div>

                <button
                    onClick={nextPage}
                    className="absolute -right-6 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-gold-light-hover rounded-full p-3 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={listings.length <= itemsPerPage}
                    aria-label="Siguiente"
                >
                    <ChevronRightIcon className="w-6 h-6 text-gold-normal-hover " />
                </button>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`w-3.75 h-3.75 cursor-pointer rounded-full transition-all ${currentPage === index
                                ? 'bg-gold-normal w-[37.5px]'
                                : 'bg-gold-light-active hover:bg-gold-light-active'
                                }`}
                            aria-label={`Ir a página ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};