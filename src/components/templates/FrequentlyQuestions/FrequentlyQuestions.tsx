import { Text } from "@/components/atoms";
import { AccordionQuestions } from "@/components/molecules";

import type { FAQItem } from "@/data/faqData";

type FrequentlyQuestionsProps = {
  data: FAQItem[];
};
export const FrequentlyQuestions = ({ data }: FrequentlyQuestionsProps) => {
  return (
    <section className="flex flex-col gap-8 bg-white px-3 py-10 md:flex-row md:justify-between md:space-x-10 md:px-14 md:py-16">
      <div className="w-87 md:mt-5 md:w-full">
        <Text size="5xl" weight="medium" className="text-green-normal">
          Preguntas frecuentes
        </Text>
      </div>

      <AccordionQuestions items={data} />
    </section>
  );
};
