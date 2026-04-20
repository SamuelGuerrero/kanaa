import Image from "next/image";

import { AccordionQuestions } from "@/components/molecules";
import FAQBg from "@assets/images/Home/FAQBg.png";

import type { FAQItem } from "@/data/faqData";

type FrequentlyQuestionsProps = {
  data: FAQItem[];
};
export const FrequentlyQuestions = ({ data }: FrequentlyQuestionsProps) => {
  return (
    <section className="flex flex-col gap-8 bg-white px-3 py-10 xl:flex-row xl:justify-between xl:space-x-10 xl:px-14 xl:py-16">
      <div className="w-87 xl:mt-5 xl:w-full">
        <Image
          src={FAQBg}
          alt="FAQ Background"
          className="mt-5 hidden w-full rounded-lg object-cover xl:block"
        />
      </div>

      <AccordionQuestions items={data} />
    </section>
  );
};
