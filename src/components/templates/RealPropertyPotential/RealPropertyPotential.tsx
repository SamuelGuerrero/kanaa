import { Text } from "@/components/atoms";
import { EarningsCalculatorForm } from "@/components/organisms";

type RealPropertyPotentialProps = {
  title: string;
  description: string;
  titleClassName?: string;
  descriptionClassName?: string;
};
export const RealPropertyPotential = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
}: RealPropertyPotentialProps) => {
  return (
    <section className="bg-green-dark-hover py-8 sm:py-16">
      <div className="flex flex-col items-center px-3 xl:flex-row xl:items-start xl:justify-between xl:pr-15 xl:pl-10">
        <div className="text-center xl:mt-10 xl:text-left">
          <Text
            size="5xl"
            className={`pr-4 leading-16.5! text-white xl:max-w-150 ${titleClassName ?? ""}`}
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <Text
            size="xl"
            className={`text-grey-light mt-8 mb-10 xl:mb-0 xl:max-w-162.5 ${descriptionClassName ?? ""}`}
            font="gilroy"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <EarningsCalculatorForm />
      </div>
    </section>
  );
};
