import Link from "next/link";

import { Text } from "@/components/atoms";

import type { ReactNode } from "react";

interface NavItemProps {
  href: string;
  children: ReactNode;
  active?: boolean;
  className?: string;
}

export const NavItem = ({
  href,
  children,
  active,
  className,
}: NavItemProps) => {
  return (
    <Link href={href} className="cursor-pointer">
      <Text
        as="span"
        font="gilroy"
        weight={active ? "bold" : "normal"}
        className={`text-white transition-opacity hover:opacity-80 ${className}`}
      >
        {children}
      </Text>
    </Link>
  );
};
