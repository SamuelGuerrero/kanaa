import { Text } from "@/components/atoms";

export type KeyMetric = {
  value: string;
  label: string;
};

export type KeyMetricsProps = {
  metrics: KeyMetric[];
  bgColor: string;
  className?: string;
};

export const KeyMetrics = ({
  metrics,
  bgColor,
  className,
}: KeyMetricsProps) => {
  return (
    <section
      className={`${bgColor} flex w-full flex-col flex-wrap items-center py-8 shadow sm:justify-between xl:flex-row xl:gap-x-8 xl:px-6 xl:py-20 ${className}`}
    >
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex min-w-30 flex-col items-center gap-2 text-center xl:flex-row xl:items-center xl:gap-4 xl:text-left"
        >
          <Text
            size="3xl"
            weight="bold"
            className="text-gold-normal text-center font-bold"
          >
            {metric.value}
          </Text>
          <Text
            font="gilroy"
            size="xl"
            className="text-grey-darker w-max font-medium"
          >
            {metric.label}
          </Text>
        </div>
      ))}
    </section>
  );
};
