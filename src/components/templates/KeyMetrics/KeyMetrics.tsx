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
      className={`${bgColor} flex w-full flex-row flex-wrap items-center justify-center gap-x-10 pay-y-6 px-6 md:px-15 py-12 md:py-20`}
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-2 md:gap-4 min-w-30"
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
            className="text-grey-darker mb-10 md:mb-0 w-max font-medium"
          >
            {metric.label}
          </Text>
        </div>
      ))}
    </section>
  );
};
