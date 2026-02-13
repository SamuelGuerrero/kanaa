import { Text } from "@/components/atoms";

export type KeyMetric = {
  value: string;
  label: string;
};

export type KeyMetricsProps = {
  metrics: KeyMetric[];
  bgColor: string;
};

export const KeyMetrics = ({ metrics, bgColor }: KeyMetricsProps) => {
  return (
    <section
      className={`${bgColor} pay-y-6 flex w-full md:flex-row  flex-col flex-wrap items-center justify-center gap-y-5 md:gap-x-8 py-8 shadow md:px-6 md:py-20`}
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex min-w-30 flex-col items-center gap-2 text-center md:flex-row md:items-center md:gap-4 md:text-left"
        >
          <Text
            size="4xl"
            weight="bold"
            className="text-gold-normal text-center font-bold"
          >
            {metric.value}
          </Text>
          <Text
            font="gilroy"
            size="2xl"
            className="text-grey-darker w-max font-medium "
          >
            {metric.label}
          </Text>
        </div>
      ))}
    </section>
  );
};
