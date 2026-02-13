import { Text } from "@/components/atoms";
import { AccordionQuestions } from "@/components/molecules";

import type { FAQItem } from "@/data/faqData";

type FrequentlyQuestionsProps = {
  data: FAQItem[];
};
export const FrequentlyQuestions = ({ data }: FrequentlyQuestionsProps) => {
  return (
    <section className="flex flex-col gap-8 bg-white px-3 md:px-14 py-10 md:flex-row md:justify-between md:space-x-10 md:py-16">
      <div className="md:w-full w-87 md:mt-5">
        <Text
          size="5xl"
          weight="medium"
          className="text-green-normal"
        >
          Preguntas frecuentes
        </Text>
        <Text
          className="text-grey-darker mt-5"
          size="lg"
          font="gilroy"
        >
          Consulta las preguntas más frecuentes y obtén información
          rápida y clara sobre cómo trabajamos.
        </Text>
      </div>

      <AccordionQuestions items={data} />
    </section>
  );
};
