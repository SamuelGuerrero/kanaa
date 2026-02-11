import React from "react";

import { Text } from "@/components/atoms";
import { EarningsCalculatorForm } from "@/components/organisms";

type RealPropertyPotentialProps = {
  title: string;
  description: string;
};
export const RealPropertyPotential = ({
  title,
  description,
}: RealPropertyPotentialProps) => {
  return (
    <section className="bg-green-dark-hover py-8">
      <div className="flex h-full justify-between pr-15 pl-10">
        <div className="mt-10">
          <Text
            size="6xl"
            className="text-white"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <Text
            size="xl"
            className="text-grey-light mt-8"
            font="gilroy"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <EarningsCalculatorForm />
      </div>
    </section>
  );
};
