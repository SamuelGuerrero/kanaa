import { PropertyDetails } from "@/components/organisms/PropertyDetails";
import { PropertyKnowBeforeSection } from "@/components/organisms/PropertyKnowBeforeSection";
import { PropertyLocationSection } from "@/components/organisms/PropertyLocationSection";
import { PropertySuggestionsSection } from "@/components/organisms/PropertySuggestionsSection";

import type { Property } from "@/types/property";

type PropertyDetailsPageProps = {
  property: Property;
  hasCoordinates: boolean;
  mapSrc: string;
  listings: Property[];
  listingsLoading: boolean;
  listingsError: string | null;
  itemsPerPage: number;
};

export const PropertyDetailsPage = ({
  property,
  hasCoordinates,
  mapSrc,
  listings,
  listingsLoading,
  listingsError,
  itemsPerPage,
}: PropertyDetailsPageProps) => {
  return (
    <main className="flex w-full flex-col items-center bg-white">
      <PropertyDetails property={property} />

      <div className="bg-grey-light-hover flex w-full flex-col items-center px-3 pt-5 pb-10 sm:p-15 sm:pt-15">
        <PropertyLocationSection
          title="Dónde te vas a quedar"
          subtitle={`${property.city}, ${property.state}, ${property.country}`}
          mapTitle={`Mapa de ${property.name}`}
          hasCoordinates={hasCoordinates}
          mapSrc={mapSrc}
          emptyStateText="No hay coordenadas disponibles para este alojamiento."
        />

        <PropertyKnowBeforeSection
          title="Qué debes saber"
          cancellationContent={
            <>
              Cancelación gratuita durante 24 horas. Pasado ese plazo, la
              reservación no será reembolsable. Consulta la política completa de
              este anfitrión para obtener más información.
            </>
          }
          houseRules={[
            "Llegada a partir de las 2:00 p.m.",
            "Salida antes de las 11:00 a.m.",
            "2 huéspedes como máximo",
          ]}
          safetyItems={["Alarma de monóxido de carbono", "Alarma de humo"]}
        />

        <PropertySuggestionsSection
          title="Algunas sugerencias"
          subtitle="Te pueden interesar otras casas para tu relajación."
          ctaHref="/propiedades"
          ctaLabel="Ver todos los alojamientos"
          listings={listings}
          loading={listingsLoading}
          error={listingsError}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </main>
  );
};
