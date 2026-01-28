import {
    type AnchorHTMLAttributes,
    type DetailedHTMLProps,
    type ReactNode,
} from "react";

import { Text } from "@/components/atoms";

type LinkProps = DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
> & {
    variant?: "primary" | "secondary";
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

export const TextLink = (props: LinkProps) => {
    const {
        variant = "primary",
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
            : "text-green-light-active";

    const baseStyles = "inline-flex items-center gap-2 cursor-pointer";

    return (
        <a
            {...rest}
            className={`${baseStyles} ${variantStyles} ${className ?? ""}`}
        >
            <span className="flex items-center gap-2">
                {icon && iconPosition === "left" && icon}

                <Text
                    font="gilroy"
                    weight={textWeight}
                    size={textSize}
                    className={textClassName}
                >
                    {children}
                </Text>

                {icon && iconPosition === "right" && icon}
            </span>
        </a>
    );
};
