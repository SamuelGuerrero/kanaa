import { type ButtonHTMLAttributes, type DetailedHTMLProps, type ReactNode } from "react";

import { Text } from "@/components/atoms";

type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    variant: "primary" | "secondary";
    icon?: ReactNode;
    iconPosition?: "left" | "right";
};

export const Button = (props: ButtonProps) => {
    const { variant, className, children, icon, iconPosition = "left", ...rest } = props;

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
            <Text font="gilroy">
                {children}
            </Text>
            {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
        </button>
    );
};
