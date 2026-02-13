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
      <div className="flex flex-col md:flex-row  md:justify-between px-3 md:pr-15 md:pl-10 ">
        <div className="md:mt-10 ">
          <Text
            size="5xl"
            className="text-white max-w-150"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <Text
            size="xl"
            className="text-grey-light mt-8 max-w-162.5 mb-10 md:mb-0"
            font="gilroy"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <EarningsCalculatorForm />
      </div>
    </section>
  );
};
