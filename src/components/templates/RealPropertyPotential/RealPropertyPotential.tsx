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
    <section className="bg-green-dark-hover py-8 sm:py-16">
      <div className="flex flex-col px-3 md:flex-row md:justify-between md:pr-15 md:pl-10">
        <div className="md:mt-10">
          <Text
            size="5xl"
            className="pr-4 text-white sm:max-w-150"
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <Text
            size="xl"
            className="text-grey-light mt-8 mb-10 max-w-162.5 md:mb-0"
            font="gilroy"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <EarningsCalculatorForm />
      </div>
    </section>
  );
};
