import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image, { type StaticImageData } from "next/image";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";

import type { ReactNode } from "react";

type FeatureItem = {
  text: string;
  icon?: ReactNode;
  title?: string;
};

type ImageConfig = {
  src: StaticImageData;
  alt: string;
  className?: string;
};

type ImageProps =
  | { image: StaticImageData; imageAlt: string; imagesConfig?: never }
  | { imagesConfig: ImageConfig[]; image?: never; imageAlt?: never }
  | { image?: never; imageAlt?: never; imagesConfig?: never };

type InfoSectionProps = ImageProps & {
  title: string;
  description?: string;
  imagePosition?: "left" | "right";
  imageClassName?: string;
  className?: string;
  textClassName?: string;
  descriptionClassName?: string;
  featuresTextClassName?: string;
  featuresIcon?: string;
  featureClassName?: string;
  imagesContainerClassName?: string;
  features?: FeatureItem[];
  buttonProps?: {
    textWeight?: "bold" | "normal" | "light";
    className?: string;
    children: string;
    circleButtonClassName?: string;
    href?: string;
  };
};

export const InfoSection = ({
  title,
  description,
  image,
  imageAlt,
  imagesConfig,
  imagePosition = "right",
  imageClassName,
  className = "bg-green-dark-hover",
  textClassName = "text-white",
  descriptionClassName = "text-grey-darker",
  features,
  featuresTextClassName,
  featuresIcon,
  featureClassName,
  imagesContainerClassName,
  buttonProps,
}: InfoSectionProps) => {
  const textContent = (
    <div className="order-1 w-full xl:order-0">
      <Text
        className={`${textClassName} xl:leading-[66.2px]`}
        size="5xl"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <Text
        font="gilroy"
        size="lg"
        className={`mt-6 ml-3 xl:leading-8 ${descriptionClassName}`}
        dangerouslySetInnerHTML={{ __html: description ?? "" }}
      />

      {features?.length ? (
        <ul className="mt-8 mb-10 space-y-4 px-1 xl:ml-4 xl:px-0">
          {features.map((item, index) => (
            <li
              key={index}
              className={`${featureClassName} flex ${item.title ? "flex-col items-start xl:flex-row xl:items-center" : "items-center"} gap-3 rounded-[10px]`}
            >
              {item.icon && (
                <span
                  className={`${featuresIcon} flex items-center justify-center rounded-full`}
                >
                  {item.icon}
                </span>
              )}
              {item.title ? (
                <div className="mt-2 xl:mt-0">
                  <Text
                    font="gilroy"
                    size="2xl"
                    weight="bold"
                    className={`${featuresTextClassName} ml-2`}
                  >
                    {item.title}
                  </Text>
                  <Text
                    weight="medium"
                    font="gilroy"
                    size="lg"
                    className={`${featuresTextClassName} ml-2`}
                  >
                    {item.text}
                  </Text>
                </div>
              ) : (
                <Text
                  font="gilroy"
                  size="lg"
                  className={`${featuresTextClassName} ml-2`}
                >
                  {item.text}
                </Text>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {buttonProps && (
        <Button
          textWeight={buttonProps.textWeight}
          variant="primary"
          className={`${buttonProps.className} mt-10 mb-11 ml-3 xl:ml-2`}
          href={buttonProps.href}
          icon={
            <CircleButton className={buttonProps.circleButtonClassName}>
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          {buttonProps.children}
        </Button>
      )}
    </div>
  );

  const imageContent = (
    <div className="order-2 flex w-full items-center justify-center xl:order-0">
      {imagesConfig?.length ? (
        <div className={`relative mx-auto mr-11 -mb-10 aspect-655/680 w-full max-w-163.75 xl:mr-15 xl:mb-0 ${imagesContainerClassName ?? ""}`}>
          {imagesConfig.map((img, index) => (
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
          className={`h-auto w-full object-contain ${imageClassName ?? ""}`}
          priority
        />
      ) : null}
    </div>
  );

  return (
    <div className={`${className} w-full px-2 py-3 xl:px-8.5`}>
      <div
        className={`grid grid-cols-1 xl:grid-cols-2 xl:gap-8 ${imagePosition === "left" ? "direction-rtl" : ""}`}
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
