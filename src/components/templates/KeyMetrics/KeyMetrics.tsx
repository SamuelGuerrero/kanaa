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
      className={`${bgColor} pay-y-6 flex w-full flex-row flex-wrap items-center justify-center gap-x-10 px-6 py-12 md:px-6 md:py-20`}
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
            className="text-grey-darker mb-10 w-max font-medium md:mb-0"
          >
            {metric.label}
          </Text>
        </div>
      ))}
    </section>
  );
};
