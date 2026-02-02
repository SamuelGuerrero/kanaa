import { Text } from "@/components/atoms";
import { PropertyOverview } from "@/components/molecules";

import { PropertyImages } from "../PropertyImages";

import type { Property } from "@/types/property";

type PropertyDetailsProps = {
  property: Property;
};

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const images = property.listingImages || [];

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
          <figure className="bg-green-normal h-109.25 w-154 rounded-[10px] px-12.5 py-10">
            <div className="flex space-x-2.5">
              <Text
                size="4xl"
                font="gilroy"
                weight="bold"
                className="text-white"
              >
                ${property.price * 2} MXN
              </Text>
              <Text size="lg" font="gilroy" className="mt-2.5 text-white">
                por 2 noches
              </Text>
            </div>

            <figure className="mt-5 h-44.25 w-full rounded-[10px] bg-white">
              <div className="border-grey-normal-hover flex h-1/2 w-full border-b">
                <div className="border-grey-normal-hover w-1/2 border-r pt-2.5 pr-10 pb-5 pl-5">
                  <Text
                    font="gilroy"
                    size="xl"
                    weight="bold"
                    className="text-green-darker"
                  >
                    Llegada
                  </Text>
                  {/* Placeholder for date picker */}
                </div>
                <div className="border-grey-normal-hover w-1/2 border-l pt-2.5 pr-10 pb-5 pl-5">
                  <Text
                    font="gilroy"
                    size="xl"
                    weight="bold"
                    className="text-green-darker"
                  >
                    Salida
                  </Text>
                  {/* Placeholder for date picker */}
                </div>
              </div>
              <div>
                <div className="w-1/2 pt-2.5 pr-10 pb-5 pl-5">
                  <Text
                    font="gilroy"
                    size="xl"
                    weight="bold"
                    className="text-green-darker"
                  >
                    Héspedes
                  </Text>
                </div>
              </div>
            </figure>
          </figure>
        </section>
      </div>
    </main>
  );
};
