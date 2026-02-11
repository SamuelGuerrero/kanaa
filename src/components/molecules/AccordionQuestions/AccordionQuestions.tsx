"use client";

import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { Text } from "@/components/atoms";

import type { FAQItem } from "@/data/faqData";

export type AccordionQuestionsProps = {
  items: FAQItem[];
};

export const AccordionQuestions = ({ items }: AccordionQuestionsProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleToggle = (index: number): void => {
    setActiveIndex(activeIndex === index ? 0 : index);
  };

  return (
    <div className="w-full max-w-3xl space-y-4">
      {items.map((faqItem, index) => {
        const isOpen = activeIndex === index;

        return (
          <div key={`faq-${index}`} className="bg-gold-light-hover">
            <button
              onClick={() => handleToggle(index)}
              className="relative w-full cursor-pointer px-6 text-left"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <Text
                weight="bold"
                font="gilroy"
                size="2xl"
                className="text-green-normal w-[638px] py-4 pr-10"
              >
                {faqItem.question}
              </Text>

              <ChevronDownIcon
                className={`text-gold-normal-hover absolute top-3.75 right-2.5 h-8 w-8 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-40 px-6 pb-5" : "max-h-0 px-6"
              }`}
            >
              <Text
                className="text-grey-darker w-[638px]"
                weight="medium"
                font="gilroy"
                size="xl"
              >
                {faqItem.answer}
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};
