"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CircleButton, Text } from "@/components/atoms";
import {
  BookingWidget,
  Button,
  Calendar,
  PropertyOverview,
} from "@/components/molecules";
import { useCalendar } from "@/hooks/useCalendar";
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
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const {
    currentMonth,
    dateRange,
    handleDateClick,
    handlePrevMonth,
    handleNextMonth,
    clearDates,
    openCalendar,
  } = useCalendar();

  useEffect(() => {
    openCalendar("checkin");
  }, [openCalendar]);

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
          <Button
            variant="primary"
            className="mt-4"
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Mostrar más
          </Button>
          <div className="border-t-grey-normal-hover mt-6 border-t">
            <Text
              font="gilroy"
              size="2xl"
              weight="bold"
              className="text-green-normal mt-6"
            >
              Lo que te ofrece este lugar:{" "}
            </Text>

            <div className="grid w-full grid-cols-2 gap-5">
              {(showAllAmenities
                ? property.listingAmenities
                : property.listingAmenities.slice(0, 8)
              ).map((amenity) => (
                <div className="flex items-center gap-2" key={amenity.id}>
                  <UserGroupIcon className="text-gold-normal h-4 w-4" />
                  <Text font="gilroy" size="lg" className="text-grey-darker">
                    {amenity.amenityName}
                  </Text>
                </div>
              ))}
            </div>
            {property.listingAmenities.length > 8 && (
              <Button
                type="button"
                variant="primary"
                className="mt-4"
                icon={
                  <CircleButton>
                    <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                  </CircleButton>
                }
                onClick={() => setShowAllAmenities((prev) => !prev)}
              >
                {showAllAmenities ? "Mostrar menos" : "Mostrar más"}
              </Button>
            )}
          </div>

          <div className="bg-grey-normal-hover my-8 h-px w-full" />

          <div>
            <Text
              className="text-green-normal"
              size="2xl"
              font="gilroy"
              weight="bold"
            >
              2 noches en {property.name}
            </Text>
            <Text font="gilroy" size="lg" className="text-grey-darker mt-2">
              23 de ene. de 2026 - 25 de ene. de 2026
            </Text>
            <div className="mt-8">
              <Calendar
                currentMonth={currentMonth}
                dateRange={dateRange}
                occupiedDates={occupiedDates}
                onDateClick={(date) => handleDateClick(date, occupiedDates)}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onClearDates={clearDates}
                className="border-none shadow-none"
                showButtons={false}
                onClose={() => {
                  /* noop */
                }}
                showTwoMonths={true}
              />
            </div>

            <div>
              <Text size="sm" font="gilroy" className="text-gray-darker">
                Política de cancelación <br />
                100% rembolsable hasta 14 días antes de la llegada <br />
                50% rembolsable hasta 7 días antes de la llegada
              </Text>
            </div>
          </div>
        </section>

        <section>
          <BookingWidget
            price={property.price}
            maxCapacity={property.personCapacity}
            occupiedDates={occupiedDates}
            listingMapId={property.id.toString()}
            onBookingClick={handleBookingClick}
            disableCheckout={true}
          />
        </section>
      </div>
    </main>
  );
};
