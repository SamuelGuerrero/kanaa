import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image, { type StaticImageData } from "next/image";
import React from "react";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";

type FeatureItem = {
  text: string;
  icon?: React.ReactNode;
};
interface ImageConfig {
  src: StaticImageData;
  alt: string;
  className?: string;
}

type InfoSectionProps = {
  title: string;
  description: string;
  image?: StaticImageData;
  imageAlt?: string;
  imagesConfig?: ImageConfig[];
  imagePosition?: "left" | "right";
  backgroundColor?: string;
  textClassName?: string;
  descriptionClassName?: string;
  featuresClassName?: string;
  features?: FeatureItem[];
  buttonProps?: {
    textWeight?: "bold" | "normal" | "light";
    className?: string;
    children: string;
    circleButtonClassName?: string;
  };
};

export const InfoSection = ({
  title,
  description,
  image,
  imageAlt,
  imagesConfig,
  imagePosition = "right",
  backgroundColor = "bg-green-dark-hover",
  textClassName = "text-white",
  descriptionClassName = "text-grey-darker",
  features,
  featuresClassName,
  buttonProps,
}: InfoSectionProps) => {
  const textContent = (
    <div>
      <Text
        className={`${textClassName} leading-[66.2px]`}
        size="5xl"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <Text
        font="gilroy"
        size="lg"
        className={`mt-6 ml-4 leading-8 ${descriptionClassName}`}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {features?.length ? (
        <ul className="mt-6 ml-4 space-y-3">
          {features.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              {item.icon && (
                <span className="bg-green-normal flex h-12.5 w-12.5 items-center justify-center rounded-full">
                  {item.icon}
                </span>
              )}
              <Text
                font="gilroy"
                size="lg"
                className={`${featuresClassName} ml-2`}
              >
                {item.text}
              </Text>
            </li>
          ))}
        </ul>
      ) : (
        buttonProps && (
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
        )
      )}
    </div>
  );

  const imageContent = (
    <div className="flex items-center justify-center">
      {imagesConfig?.length ? (
        <div className="relative h-163.75 w-163.75">
          {imagesConfig?.map((img, index) => (
            <Image
              key={index}
              src={img.src}
              alt={img.alt}
              className={img.className}
              priority
            />
          ))}
        </div>
      ) : image && imageAlt ? (
        <Image
          src={image}
          alt={imageAlt}
          className="h-auto w-full object-contain"
          priority
        />
      ) : null}
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
