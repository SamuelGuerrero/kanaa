import { UserGroupIcon } from "@heroicons/react/24/solid";

import { AmenityItem, BedIcon, Text, ToiletIcon } from "@/components/atoms";

type PropertyOverviewProps = {
  city: string;
  state: string;
  country: string;
  personCapacity: number;
  bedroomsNumber: number;
  bathroomsNumber: number;
  className?: string;
};

export const PropertyOverview = ({
  city,
  state,
  country,
  personCapacity,
  bedroomsNumber,
  bathroomsNumber,
  className,
}: PropertyOverviewProps) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-6">
        <Text size="lg" font="gilroy">
          {city}, {state}, {country}
        </Text>

        <div className="flex items-center gap-4.25">
          <AmenityItem
            icon={<UserGroupIcon className="text-gold-normal h-4 w-4" />}
            value={personCapacity}
          />
          <AmenityItem icon={<BedIcon />} value={bedroomsNumber} />
          <AmenityItem icon={<ToiletIcon />} value={bathroomsNumber} />
        </div>
      </div>
    </div>
  );
};
