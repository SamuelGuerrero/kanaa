"use client";

import { isValidElement } from "react";

import { useI18n } from "@/i18n";

import type { ElementType, ReactNode } from "react";

type FontFamily = "roboto" | "gilroy";

type FontSize =
  | "xxs"
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl";

type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";

type TextProps = {
  children?: ReactNode;
  font?: FontFamily;
  size?: FontSize;
  weight?: FontWeight;
  as?: ElementType;
  className?: string;
  dangerouslySetInnerHTML?: { __html: string };
  id?: string;
};

const fontFamilies: Record<FontFamily, string> = {
  roboto: "font-roboto",
  gilroy: "font-gilroy",
};

const fontSizes: Record<FontSize, string> = {
  xxs: "text-xxs",
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-lg",
  "2xl": "text-xl md:text-2xl",
  "3xl": "text-2xl md:text-3xl",
  "4xl": "text-2xl md:text-4xl",
  "5xl": "text-3xl md:text-5xl",
  "6xl": "text-3xl md:text-6xl",
  "7xl": "text-5xl md:text-7xl",
};

const fontWeights: Record<FontWeight, string> = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const Text = ({
  children,
  font = "roboto",
  size = "base",
  weight = "normal",
  as: Component = "p",
  className = "",
  dangerouslySetInnerHTML,
  id,
}: TextProps) => {
  const { t } = useI18n();

  const translateNode = (node: ReactNode): ReactNode => {
    if (typeof node === "string") return t(node);
    if (Array.isArray(node))
      return node.map((item) => translateNode(item as ReactNode));
    if (isValidElement(node)) return node;
    return node;
  };

  const translatedHTML = dangerouslySetInnerHTML
    ? { __html: t(dangerouslySetInnerHTML.__html) }
    : undefined;

  const classes = [
    fontFamilies[font],
    fontSizes[size],
    fontWeights[weight],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      className={classes}
      dangerouslySetInnerHTML={translatedHTML}
      id={id}
    >
      {translateNode(children)}
    </Component>
  );
};
