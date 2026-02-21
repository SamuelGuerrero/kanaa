import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton, Text } from "@/components/atoms";

import { Button } from "../Button";

export type JobCardProps = {
  title: string;
  description: string;
  type: string;
};

export const CardJob = ({ title, description, type }: JobCardProps) => {
  return (
    <div className="border-gold-light-active flex w-full flex-col gap-6 rounded-2xl border bg-white px-4 py-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
      <div>
        <Text
          className="bg-gold-light text-gold-normal mb-6 inline-block rounded-full px-4 py-1"
          size="xxs"
          font="gilroy"
          weight="bold"
        >
          {type}
        </Text>

        <Text
          className="text-green-dark-active"
          size="2xl"
          font="gilroy"
          weight="bold"
        >
          {title}
        </Text>

        <Text
          className="mt-4 max-w-xl text-[#4B5563]"
          size="base"
          font="gilroy"
          weight="medium"
        >
          {description}
        </Text>
      </div>

      <Button
        variant="secondary"
        textClassName="text-base font-bold text-gold-dark!"
        className="bg-gold-light-hover! w-fit rounded-[10px]"
        icon={
          <CircleButton className="bg-grey-light!">
            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        }
      >
        Aplicar
      </Button>
    </div>
  );
};
