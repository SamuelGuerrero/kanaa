"use client";

import { UserGroupIcon } from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CircleButton, Text } from "@/components/atoms";
import {
  BookingWidget,
  Button,
  Calendar,
  PropertyOverview,
} from "@/components/molecules";
import { useCalendar } from "@/hooks/useCalendar";
import { useListingCalendar } from "@/hooks/useListingCalendar";
import { useI18n } from "@/i18n";

import { PropertyImages } from "../PropertyImages";

import type { BookingData } from "@/components/molecules";
import type { Property } from "@/types/property";

type PropertyDetailsProps = {
  property: Property;
};

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const { locale, t } = useI18n();
  const DESCRIPTION_PREVIEW_LENGTH = 260;
  const router = useRouter();
  const images = property.listingImages || [];
  const { occupiedDates, priceByDate } = useListingCalendar(
    property.id.toString(),
  );
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const {
    currentMonth,
    dateRange,
    handlePrevMonth,
    handleNextMonth,
    clearDates,
    setDateRange,
  } = useCalendar();

  console.log("Fechas ocupadas", occupiedDates);

  const handleBookingClick = (data: BookingData) => {
    const enrichedData: BookingData = {
      ...data,
      propertyName: property.name,
      propertyImage: property.listingImages?.[0]?.url ?? property.thumbnailUrl,
      propertyCity: property.city,
      propertyRating: property.starRating ?? undefined,
      pricePerNight: property.price,
    };

    sessionStorage.setItem("bookingData", JSON.stringify(enrichedData));

    router.push(`/checkout/${property.id}`);
  };

  const fullDescription = (property.description ?? "").trim();
  const shouldTruncateDescription =
    fullDescription.length > DESCRIPTION_PREVIEW_LENGTH;
  const visibleDescription =
    showFullDescription || !shouldTruncateDescription
      ? fullDescription
      : `${fullDescription.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`;
  const totalNights =
    dateRange.startDate && dateRange.endDate
      ? Math.ceil(
          (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
  const stayTitle =
    totalNights > 0
      ? locale === "en"
        ? `${totalNights} ${totalNights === 1 ? "night" : "nights"} in ${property.name}`
        : `${totalNights} ${totalNights === 1 ? "noche" : "noches"} en ${property.name}`
      : locale === "en"
        ? `Select your dates in ${property.name}`
        : `Selecciona tus fechas en ${property.name}`;
  const formatStayDate = (date: Date) =>
    new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  const stayDateRangeText =
    dateRange.startDate && dateRange.endDate
      ? `${formatStayDate(dateRange.startDate)} - ${formatStayDate(dateRange.endDate)}`
      : locale === "en"
        ? "Select check-in and check-out dates"
        : "Selecciona fecha de llegada y salida";
  const handleInlineCalendarDateClick = (date: Date) => {
    const isOccupied = occupiedDates.some(
      (occupiedDate) => occupiedDate.toDateString() === date.toDateString(),
    );
    if (isOccupied) return;

    if (!dateRange.startDate || dateRange.endDate) {
      setDateRange({ startDate: date, endDate: null });
      return;
    }

    if (date <= dateRange.startDate) {
      setDateRange({ startDate: date, endDate: null });
      return;
    }

    setDateRange({ startDate: dateRange.startDate, endDate: date });
  };

  return (
    <section className="flex max-w-7xl flex-col bg-white pt-20 sm:mt-20">
      <PropertyOverview
        city={property.city}
        state={property.state}
        country={property.country}
        personCapacity={property.personCapacity}
        bedroomsNumber={property.bedroomsNumber}
        bathroomsNumber={property.bathroomsNumber}
        name={property.name}
        className="hidden sm:block"
        showButton
      />

      <PropertyImages images={images} propertyName={property.name} />

      <div className="mt-10 flex w-full gap-10">
        <section className="mx-2 min-w-0 flex-1 pb-10">
          <Text
            font="gilroy"
            size="2xl"
            weight="bold"
            className="text-green-normal hidden sm:block"
          >
            {locale === "en"
              ? `Residential home located in downtown ${property.city}`
              : `Casa habitacional ubicada en el centro de ${property.city}`}
          </Text>

          <Text
            size="5xl"
            className="text-green-normal sm:hidden"
            weight="medium"
          >
            {property.name}
          </Text>

          <PropertyOverview
            city={property.city}
            state={property.state}
            country={property.country}
            personCapacity={property.personCapacity}
            bedroomsNumber={property.bedroomsNumber}
            bathroomsNumber={property.bathroomsNumber}
          />

          <div className="my-6 h-px w-full bg-[#F3F4F6] sm:hidden" />

          <Text font="gilroy" weight="bold" size="2xl" className="sm:hidden">
            Sobre este lugar
          </Text>

          <Text
            font="gilroy"
            size="lg"
            className="text-grey-darker mt-4 text-justify"
          >
            {visibleDescription}
          </Text>

          {shouldTruncateDescription && (
            <Button
              variant="primary"
              className="mt-4 hidden! sm:flex!"
              onClick={() => setShowFullDescription((prev) => !prev)}
            >
              {showFullDescription ? "Mostrar menos" : "Mostrar más"}
            </Button>
          )}

          {shouldTruncateDescription && (
            <Button
              textWeight="bold"
              variant="primary"
              className="text-gold-dark! bg-transparent px-0! sm:hidden"
              onClick={() => setShowFullDescription((prev) => !prev)}
              icon={
                <CircleButton>
                  <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
              }
            >
              {showFullDescription ? "Leer menos" : "Leer más"}
            </Button>
          )}

          <BookingWidget
            price={property.price}
            maxCapacity={property.personCapacity}
            occupiedDates={occupiedDates}
            priceByDate={priceByDate}
            listingMapId={property.id.toString()}
            onBookingClick={handleBookingClick}
            sharedDateRange={dateRange}
            onSharedDateRangeChange={setDateRange}
            className="sm:hidden"
          />

          <div className="border-t-grey-normal-hover mt-6 border-t px-5 sm:px-0">
            <Text
              font="gilroy"
              size="2xl"
              weight="bold"
              className="text-green-normal mt-6"
            >
              Lo que te ofrece este lugar:{" "}
            </Text>

            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
              {(showAllAmenities
                ? property.listingAmenities
                : property.listingAmenities.slice(
                    0,
                    showAllAmenities
                      ? property.listingAmenities.length
                      : window.innerWidth < 640
                        ? 4
                        : 8,
                  )
              ).map((amenity) => (
                <div className="flex items-center gap-2" key={amenity.id}>
                  <UserGroupIcon className="text-gold-normal h-4 w-4" />
                  <Text font="gilroy" size="lg" className="text-grey-darker">
                    {amenity.amenityName}
                  </Text>
                </div>
              ))}
            </div>
            {property.listingAmenities.length > 4 && (
              <Button
                type="button"
                variant="primary"
                textClassName="mx-auto!"
                className="sm:bg-gold-light-hover text-gold-dark! mt-4 w-full border border-[#D1D5DB] bg-transparent px-0! sm:w-fit sm:border-none sm:px-4!"
                onClick={() => setShowAllAmenities((prev) => !prev)}
              >
                {showAllAmenities ? (
                  "Mostrar menos"
                ) : (
                  <>
                    <span className="hidden sm:inline">Mostrar más</span>
                    <span className="font-bold text-black sm:hidden">
                      {t("Mostrar todas las amenidades")}
                    </span>
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="bg-grey-normal-hover my-8 h-px w-full" />

          <div className="mx-2 sm:mx-0">
            <Text
              className="text-green-normal"
              size="2xl"
              font="gilroy"
              weight="bold"
            >
              {stayTitle}
            </Text>
            <Text font="gilroy" size="lg" className="text-grey-darker mt-2">
              {stayDateRangeText}
            </Text>

            <div className="mt-8">
              <Calendar
                currentMonth={currentMonth}
                dateRange={dateRange}
                occupiedDates={occupiedDates}
                onDateClick={handleInlineCalendarDateClick}
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
                100% rembolsable hasta 14 días antes de la llegada <br />
                50% rembolsable hasta 7 días antes de la llegada
              </Text>
            </div>
          </div>
        </section>

        <section className="sticky top-30 hidden self-start sm:block">
          <BookingWidget
            price={property.price}
            maxCapacity={property.personCapacity}
            occupiedDates={occupiedDates}
            priceByDate={priceByDate}
            listingMapId={property.id.toString()}
            onBookingClick={handleBookingClick}
            sharedDateRange={dateRange}
            onSharedDateRangeChange={setDateRange}
          />
        </section>
      </div>
    </section>
  );
};
