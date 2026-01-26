import Link from "next/link";

import { Text } from "@/components/atoms";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export const NavItem = ({ href, children, active }: NavItemProps) => {
  return (
    <Link href={href} className="cursor-pointer">
      <Text
        as="span"
        font="gilroy"
        weight={active ? "bold" : "normal"}
        className={`transition-opacity hover:opacity-80 ${active ? "text-white" : ""}`}
      >
        {children}
      </Text>
    </Link>
  );
};
