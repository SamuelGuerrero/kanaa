import { Text } from '@/components/atoms';

import type { FC } from "react";

export type Experience = {
    id: number;
    title: string;
    description: string;
    Icon: FC<React.SVGProps<SVGSVGElement>>;
};

type CardProps = {
    experience: Experience;
    textClassName?: string;
    descriptionClassName?: string;
};

export const AppliedExperience = ({ experience, textClassName, descriptionClassName }: CardProps) => {
    const { Icon, title, description } = experience;

    return (
        <div className="bg-gold-light rounded-xl p-6 flex flex-col gap-4">
            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center">
                <Icon />
            </div>

            <Text
                className={`${textClassName} text-green-normal`}
                size="2xl"
                weight="bold"
                font="gilroy"
                dangerouslySetInnerHTML={{ __html: title }}
            />
            <Text
                font="gilroy"
                size="lg"
                weight="medium"
                className={`${descriptionClassName} text-grey-darker`}
                dangerouslySetInnerHTML={{ __html: description }}
            />
        </div>
    );
};

