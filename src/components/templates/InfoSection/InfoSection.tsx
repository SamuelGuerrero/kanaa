import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image, { type StaticImageData } from "next/image";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";
interface InfoSectionProps {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  imagePosition?: "left" | "right";
  backgroundColor?: string;
  textClassName?: string;
  buttonProps: {
    textWeight?: "bold" | "normal" | "light";
    className?: string;
    children: string;
    circleButtonClassName?: string;
  };
}

export const InfoSection = ({
  title,
  description,
  image,
  imageAlt,
  imagePosition = "right",
  backgroundColor = "bg-green-dark-hover",
  textClassName = "text-white",
  buttonProps,
}: InfoSectionProps) => {
  const textContent = (
    <div className={`${textClassName}`}>
      <Text
        className="leading-[66.2px]"
        size="5xl"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <Text
        font="gilroy"
        size="lg"
        className="mt-6 leading-8"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      <Button
        textWeight={buttonProps.textWeight}
        variant="primary"
        className={buttonProps.className}
        icon={
          <CircleButton className={buttonProps.circleButtonClassName}>
            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        }
      >
        {buttonProps.children}
      </Button>
    </div>
  );

  const imageContent = (
    <div className="flex items-center">
      <Image
        src={image}
        alt={imageAlt}
        className="h-auto w-full object-contain"
        priority
      />
    </div>
  );

  return (
    <div className={`${backgroundColor} w-full px-8.5 py-6.25`}>
      <div
        className={`grid grid-cols-2 gap-8 ${imagePosition === "left" ? "direction-rtl" : ""}`}
      >
        {imagePosition === "left" ? (
          <>
            {imageContent}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {imageContent}
          </>
        )}
      </div>
    </div>
  );
};
