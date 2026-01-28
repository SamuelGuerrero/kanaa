import Image, { type StaticImageData } from "next/image"

import { Text } from "@/components/atoms"

export type GuideCardProps = {
  id: number;
  name: string;
  category: string;
  date: string;
  image: StaticImageData;
}

export const GuideCard = ({ name, image, category, date }: GuideCardProps) => {
  return (
    <div className="bg-white border border-secondary-100 shadow-md rounded-xl w-98 h-120" >

      <div className="flex justify-center">
        <Image
          className="w-90 h-60 justify-center mt-4"
          src={image}
          alt={name}
        />
      </div>

      <div className="mx-6 mt-4">
        <div className="bg-green-light p-2 py-1.5 inline-block rounded-3xl">
          <Text className="text-green-normal" font="gilroy" size="xs" weight="bold">
            {category}
          </Text>
        </div>

        <Text className="text-secondary-800 mt-4" font="gilroy" size="xl" weight="bold">
          {name}
        </Text>

        <Text className="text-secondary-400 mt-15" font="roboto" weight="medium" size="base">
          {date}
        </Text>
      </div>
    </div>
  )
}


