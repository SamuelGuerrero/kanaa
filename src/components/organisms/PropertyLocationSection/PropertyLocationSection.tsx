import { Text } from "@/components/atoms";

type PropertyLocationSectionProps = {
  title: string;
  subtitle: string;
  mapTitle: string;
  hasCoordinates: boolean;
  mapSrc: string;
  emptyStateText: string;
};

export const PropertyLocationSection = ({
  title,
  subtitle,
  mapTitle,
  hasCoordinates,
  mapSrc,
  emptyStateText,
}: PropertyLocationSectionProps) => {
  return (
    <section className="w-full">
      <Text className="text-green-normal" size="4xl">
        {title}
      </Text>
      <Text className="text-gold-darker mt-2" font="gilroy" size="lg">
        {subtitle}
      </Text>
      <div className="mt-8 w-full">
        {hasCoordinates && mapSrc ? (
          <iframe
            title={mapTitle}
            src={mapSrc}
            className="h-[570px] w-full rounded-xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex h-[570px] w-full items-center justify-center rounded-xl bg-white text-center">
            <Text className="text-grey-darker" font="gilroy" size="lg">
              {emptyStateText}
            </Text>
          </div>
        )}
      </div>
    </section>
  );
};
