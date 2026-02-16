import type { ReactNode } from "react";

import { Text } from "@/components/atoms";
import { InfoCard } from "@/components/molecules";

type PropertyKnowBeforeSectionProps = {
  title: string;
  cancellationContent: ReactNode;
  houseRules: string[];
  safetyItems: string[];
};

export const PropertyKnowBeforeSection = ({
  title,
  cancellationContent,
  houseRules,
  safetyItems,
}: PropertyKnowBeforeSectionProps) => {
  return (
    <section className="mt-12 w-full border-t border-t-[#D9D4CC] pt-10">
      <Text className="text-green-normal" size="2xl" weight="bold" font="gilroy">
        {title}
      </Text>

      <div className="mt-8 grid w-full grid-cols-1 gap-10 md:grid-cols-3">
        <InfoCard title="Política de cancelación" icon={<i className="fa-solid fa-users"></i>}>
          <Text className="text-grey-darker" font="gilroy" size="base">
            {cancellationContent}
          </Text>
        </InfoCard>

        <InfoCard title="Reglas de la casa" icon={<i className="fa-solid fa-users"></i>}>
          <div className="text-grey-darker font-gilroy space-y-1 text-base">
            {houseRules.map((rule) => (
              <div key={rule}>{rule}</div>
            ))}
          </div>
        </InfoCard>

        <InfoCard title="Seguridad y propiedad" icon={<i className="fa-solid fa-users"></i>}>
          <div className="text-grey-darker font-gilroy space-y-1 text-base">
            {safetyItems.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </InfoCard>
      </div>
    </section>
  );
};
