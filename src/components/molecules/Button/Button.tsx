import { type ButtonHTMLAttributes, type DetailedHTMLProps, type ReactNode } from "react";

import { Text } from "@/components/atoms";

type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    variant: "primary" | "secondary";
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    textWeight?: "light" | "normal" | "medium" | "semibold" | "bold";
    textSize?: "xxs" | "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
    textClassName?: string;
};

export const Button = (props: ButtonProps) => {
    const {
        variant,
        className,
        children,
        icon,
        iconPosition = "right",
        textWeight = "normal",
        textSize = "base",
        textClassName = "",
        ...rest
    } = props;

    const variantStyles =
        variant === "secondary"
            ? ""
            : variant === "primary"
                ? "bg-gold-light-hover text-gold-normal"
                : "";

    const baseStyles =
        "rounded-[10px] py-[14px] px-[24px] flex items-center cursor-pointer";

    return (
        <button {...rest} className={`${baseStyles} ${variantStyles} ${className}`}>
            {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
            <Text
                font="gilroy"
                weight={textWeight}
                size={textSize}
                className={textClassName}
            >
                {children}
            </Text>
            {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </button>
    );
};
