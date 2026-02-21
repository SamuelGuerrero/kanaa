import { Text } from "@/components/atoms";

import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const InfoCard = ({
  title,
  icon,
  children,
  className = "",
}: InfoCardProps) => {
  return (
    <div className={`flex gap-4 ${className}`}>
      {icon && <div className="text-gold-normal mt-1">{icon}</div>}
      <div>
        <Text
          className="text-green-normal"
          font="gilroy"
          size="xl"
          weight="bold"
        >
          {title}
        </Text>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
};
