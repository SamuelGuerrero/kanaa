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
    <section className={`${bgColor} flex w-full flex-row items-center justify-center space-x-10 px-15 py-20`}>
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="gap-4.2 flex flex-row items-center space-x-6"
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
            className="text-grey-darker text-center font-medium"
          >
            {metric.label}
          </Text>
        </div>
      ))}
    </section>
  );
};
