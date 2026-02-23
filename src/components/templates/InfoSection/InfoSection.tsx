import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image, { type StaticImageData } from "next/image";

import { CircleButton, Text } from "@/components/atoms";
import { Button } from "@/components/molecules";

import type { ReactNode } from "react";

type FeatureItem = {
  text: string;
  icon?: ReactNode;
  titulo?: string;
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
  block?: string;
  backgroundColor?: string;
  textClassName?: string;
  descriptionClassName?: string;
  featuresTextClassName?: string;
  featuresIcon?: string;
  featureClassName?: string;
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
  block,
  backgroundColor = "bg-green-dark-hover",
  textClassName = "text-white",
  descriptionClassName = "text-grey-darker",
  features,
  featuresTextClassName,
  featuresIcon,
  featureClassName,
  buttonProps,
}: InfoSectionProps) => {
  const textContent = (
    <div className="order-1 w-full md:order-0">
      <Text
        className={`${textClassName} md:leading-[66.2px]`}
        size="5xl"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <Text
        font="gilroy"
        size="lg"
        className={`mt-6 ml-3 md:leading-8 ${descriptionClassName}`}
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {features?.length ? (
        <ul className="mt-8 mb-10 space-y-4 px-1 md:ml-4 md:px-0">
          {features.map((item, index) => (
            <li
              key={index}
              className={` ${featureClassName} flex ${item.titulo ? "flex-col items-start md:flex-row md:items-center" : "items-center"} gap-3 rounded-[10px]`}
            >
              {item.icon && (
                <span
                  className={`${featuresIcon} flex items-center justify-center rounded-full`}
                >
                  {item.icon}
                </span>
              )}
              {title ? (
                <div className="mt-2 md:mt-0">
                  <Text
                    font="gilroy"
                    size="2xl"
                    weight="bold"
                    className={`${featuresTextClassName} ml-2`}
                  >
                    {item.titulo}
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
      ) : (
        buttonProps && (
          <Button
            textWeight={buttonProps.textWeight}
            variant="primary"
            className={`${buttonProps.className} mt-10 mb-11 ml-3 md:ml-2`}
            href={buttonProps.href}
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
    <div className="order-2 flex w-full items-center justify-center md:order-0">
      {imagesConfig?.length ? (
        <div className="relative mx-auto mr-11 -mb-10 aspect-655/680 w-full max-w-163.75 md:mr-15 md:mb-0">
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
          className={`h-auto w-full object-contain ${block}`}
          priority
        />
      ) : null}
    </div>
  );

  return (
    <div className={`${backgroundColor} w-full px-2 py-3 md:px-8.5`}>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 md:gap-8 ${imagePosition === "left" ? "direction-rtl" : ""}`}
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
