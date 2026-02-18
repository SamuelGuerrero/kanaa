import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton, Text } from "@/components/atoms";

import { Button } from "../Button";

export type JobCardProps = {
    title: string;
    description: string;
    type: string;
};

export const CardJob = ({ title, description, type, }: JobCardProps) => {


    return (
        <div className="w-full rounded-2xl border border-gold-light-active  bg-white px-4 py-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">

            <div>
                <Text
                    className="inline-block px-4 py-1 rounded-full bg-gold-light text-gold-normal mb-6"
                    size="xxs"
                    font="gilroy"
                    weight="bold"
                >
                    {type}
                </Text>

                <Text
                    className="text-green-dark-active"
                    size="2xl"
                    font="gilroy"
                    weight="bold">
                    {title}
                </Text>

                <Text
                    className="mt-4 text-[#4B5563] max-w-xl"
                    size="base"
                    font="gilroy"
                    weight="medium">
                    {description}
                </Text>
            </div>

            <Button
                variant="secondary"
                textClassName="text-base font-bold text-gold-dark!"
                className="w-fit bg-gold-light-hover! rounded-[10px]"
                icon={
                    <CircleButton className="bg-grey-light!">
                        <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                    </CircleButton>
                }
            >
                Aplicar
            </Button>

        </div>
    );
};
