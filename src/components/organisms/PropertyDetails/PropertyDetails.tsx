"use client";

import { useRouter } from "next/navigation";

import { Text } from "@/components/atoms";
import { BookingWidget, PropertyOverview } from "@/components/molecules";
import { useOccupiedDates } from "@/hooks/useOccupiedDates";

import { PropertyImages } from "../PropertyImages";

import type { BookingData } from "@/components/molecules/BookingWidget";
import type { Property } from "@/types/property";

type PropertyDetailsProps = {
  property: Property;
};

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const router = useRouter();
  const images = property.listingImages || [];
  const { occupiedDates } = useOccupiedDates(property.id.toString());

  console.log("Fechas ocupadas", occupiedDates);

  const handleBookingClick = (data: BookingData) => {
    console.log("Datos de reserva:", data);

    sessionStorage.setItem("bookingData", JSON.stringify(data));

    router.push(`/checkout/${property.id}`);
  };

  return (
    <main className="mt-20 flex max-w-7xl flex-col bg-white pt-20">
      <Text size="5xl" className="text-green-normal" weight="medium">
        {property.name}
      </Text>

      <PropertyOverview
        city={property.city}
        state={property.state}
        country={property.country}
        personCapacity={property.personCapacity}
        bedroomsNumber={property.bedroomsNumber}
        bathroomsNumber={property.bathroomsNumber}
        className="mt-5"
      />

      <PropertyImages images={images} propertyName={property.name} />

      <div className="mt-10 flex w-full gap-10">
        <section>
          <Text
            font="gilroy"
            size="2xl"
            weight="bold"
            className="text-green-normal"
          >
            Casa habitacional ubicada en el centro de {property.city}
          </Text>

          <PropertyOverview
            city={property.city}
            state={property.state}
            country={property.country}
            personCapacity={property.personCapacity}
            bedroomsNumber={property.bedroomsNumber}
            bathroomsNumber={property.bathroomsNumber}
          />

          <Text
            font="gilroy"
            size="lg"
            className="text-grey-darker mt-4 text-justify"
          >
            {property.description}
          </Text>
        </section>

        <section>
          <BookingWidget
            price={property.price}
            maxCapacity={property.personCapacity}
            occupiedDates={occupiedDates}
            listingMapId={property.id.toString()}
            onBookingClick={handleBookingClick}
          />
        </section>
      </div>
    </main>
  );
};
