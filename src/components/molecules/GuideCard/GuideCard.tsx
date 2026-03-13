import Image, { type StaticImageData } from "next/image";

import { Text } from "@/components/atoms";

export type GuideCardProps = {
  name: string;
  category: string;
  date: string;
  image?: StaticImageData;
  imageUrl?: string;
};

export const GuideCard = ({ name, image, imageUrl, category, date }: GuideCardProps) => {
  const src = imageUrl ?? image;
  return (
    <div className="mx-auto w-full rounded-xl border bg-white p-2 pb-4 text-left lg:h-120 lg:w-98 lg:p-0">
      {src && (
        <Image
          className="mx-auto w-full rounded-xl rounded-b-none lg:mt-4 lg:h-60 lg:w-90 lg:rounded-none"
          src={src}
          alt={name}
          width={imageUrl ? 360 : undefined}
          height={imageUrl ? 240 : undefined}
        />
      )}

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
          className="text-secondary-400 mt-4 lg:mt-15"
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
