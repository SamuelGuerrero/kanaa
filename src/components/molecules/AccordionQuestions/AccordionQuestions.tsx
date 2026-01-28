'use client';

import { useState } from "react";

import { Text } from '@/components/atoms'

type FAQ = {
    question: string;
    answer: string;
};

type Props = {
    data: FAQ[];
};

export const AccordionQuestions = ({ data }: Props) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="w-full max-w-3xl space-y-4">
            {data.map((item, index) => {
                const isOpen = activeIndex === index;

                return (
                    <div
                        key={index}
                        className="  bg-gold-light-hover"
                    >

                        <button
                            onClick={() => toggle(index)}
                            className="relative w-full px-6 text-left"
                        >
                            <Text
                                weight="bold"
                                font="gilroy"
                                size="2xl"
                                className="pr-10 py-4 text-green-normal"
                            >
                                {item.question}
                            </Text>

                            <span
                                className={`absolute right-2.5 top-3.75 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                                    }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={3.33}
                                    stroke="currentColor"
                                    className="w-4 h-8 text-gold-normal-hover"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </span>
                        </button>


                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 px-6 pb-5" : "max-h-0 px-6"
                                }`}
                        >
                            <Text className="text-grey-darker" weight="medium" font="gilroy" size="xl">{item.answer}</Text>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
