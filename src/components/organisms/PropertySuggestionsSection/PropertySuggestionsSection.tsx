import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
import { PropertyCarousel } from "@/components/organisms";

import type { Property } from "@/types/property";

type PropertySuggestionsSectionProps = {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  listings: Property[];
  loading: boolean;
  error: string | null;
  itemsPerPage: number;
};

export const PropertySuggestionsSection = ({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  listings,
  loading,
  error,
  itemsPerPage,
}: PropertySuggestionsSectionProps) => {
  return (
    <section className="mt-14 w-full border-t border-t-[#D9D4CC] pt-14 text-center">
      <Text className="text-green-normal" size="5xl">
        {title}
      </Text>
      <Text className="text-grey-darker mt-3" font="gilroy" size="lg">
        {subtitle}
      </Text>

      <Button
        variant="primary"
        textWeight="bold"
        className="text-gold-normal-hover! mt-6 font-bold"
        href={ctaHref}
        icon={
          <CircleButton>
            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        }
      >
        {ctaLabel}
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
