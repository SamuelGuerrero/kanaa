import Image, { type StaticImageData } from "next/image";

import { Text } from "@/components/atoms";

export type GuideCardProps = {
  name: string;
  category: string;
  date: string;
  image: StaticImageData;
};

export const GuideCard = ({ name, image, category, date }: GuideCardProps) => {
  return (
    <div className="mx-auto w-[90%] rounded-xl border bg-white pb-4 text-left sm:h-120 sm:w-98">
      <Image
        className="mx-auto w-98 rounded-xl rounded-b-none sm:mt-4 sm:h-60 sm:w-90 sm:rounded-none"
        src={image}
        alt={name}
      />

      <div className="mx-6 mt-5">
        <div className="bg-green-light inline-block rounded-3xl p-2 py-1.5">
          <Text
            className="text-green-normal"
            font="gilroy"
            size="xs"
            weight="bold"
          >
            {category}
          </Text>
        </div>

        <Text
          className="text-secondary-800 mt-4"
          font="gilroy"
          size="xl"
          weight="bold"
        >
          {name}
        </Text>

        <Text
          className="text-secondary-400 mt-4 sm:mt-15"
          font="roboto"
          weight="medium"
          size="base"
        >
          {date}
        </Text>
      </div>
    </div>
  );
};
