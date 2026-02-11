import { Text } from "@/components/atoms";
import { AccordionQuestions } from "@/components/molecules";

import type { FAQItem } from "@/data/faqData";

type FrequentlyQuestionsProps = {
  data: FAQItem[]
}
export const FrequentlyQuestions = ({ data }: FrequentlyQuestionsProps) => {
  return (
    <section className="flex flex-col md:flex-row  md:justify-between  gap-8 md:space-x-10  bg-white px-6 md:px-14   py-10 md:py-16">
      <div>
        <Text size="5xl" weight="medium" className="text-green-normal text-center md:text-left">
          Preguntas frecuentes
        </Text>
        <Text className="text-grey-darker mt-5 text-center md:text-left" size="lg" font="gilroy">
          Consulta las preguntas más frecuentes y obtén información
          <br />
          rápida y clara sobre cómo trabajamos.
        </Text>
      </div>

      <AccordionQuestions items={data} />
    </section>
  );
};
