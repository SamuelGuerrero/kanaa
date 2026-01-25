import { Text } from "@/components/atoms";

import type { ReactNode } from "react";

type AmenityItemProps = {
    icon: ReactNode;
    value: number;
};

export const AmenityItem = ({ icon, value }: AmenityItemProps) => {
    return (
        <div className='flex items-center justify-center gap-2.5'>
            {icon}
            <Text
                font="gilroy"
                className="text-green-darker text-[16.79px] leading-7.5"
            >
                {value}
            </Text>
        </div>
    );
};