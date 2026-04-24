import Link from "next/link";
import {
  type ButtonHTMLAttributes,
  type DetailedHTMLProps,
  type ReactNode,
} from "react";

import { Text } from "@/components/atoms";

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  href?: string;
  target?: string;
  rel?: string;
  variant: "primary" | "secondary";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  textWeight?: "light" | "normal" | "medium" | "semibold" | "bold";
  textSize?:
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
  textClassName?: string;
};

export const Button = (props: ButtonProps) => {
  const {
    href,
    target,
    rel,
    variant,
    className,
    children,
    icon,
    iconPosition = "right",
    textWeight = "normal",
    textSize = "base",
    textClassName = "",
    disabled = false,
    ...rest
  } = props;

  const variantStyles =
    variant === "secondary"
      ? "bg-white"
      : variant === "primary"
        ? "bg-gold-light-hover text-gold-normal"
        : "";

  const baseStyles =
    "rounded-[10px] py-[14px] px-[24px] inline-flex items-center gap-[10.49px] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-normal/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none";

  const textVariantOverrides =
    variant === "secondary"
      ? {
          weight: "bold" as const,
          className: "text-gold-normal text-gold-normal!",
        }
      : {};

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      <Text
        font="gilroy"
        weight={textVariantOverrides.weight ?? textWeight}
        size={textSize}
        className={`${textVariantOverrides.className ?? ""} ${textClassName}`}
      >
        {children}
      </Text>
      {icon && iconPosition === "right" && icon}
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={`${baseStyles} ${variantStyles} ${className ?? ""}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      {...rest}
      disabled={disabled}
      type={props.type ?? "button"}
      className={`${baseStyles} ${variantStyles} ${className ?? ""}`}
    >
      {content}
    </button>
  );
};
