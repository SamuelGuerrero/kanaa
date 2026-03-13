import { Text } from "@/components/atoms";
import { AccordionQuestions } from "@/components/molecules";

import type { FAQItem } from "@/data/faqData";

type FrequentlyQuestionsProps = {
  data: FAQItem[];
  title?: string | null;
  subtitle?: string | null;
};

export const FrequentlyQuestions = ({
  data,
  title,
  subtitle,
}: FrequentlyQuestionsProps) => {
  return (
    <section className="flex flex-col gap-8 bg-white px-3 py-10 md:flex-row md:justify-between md:space-x-10 md:px-14 md:py-16">
      <div className="w-87 md:mt-5 md:w-full">
        <Text size="5xl" weight="medium" className="text-green-normal">
          {title ?? "Preguntas frecuentes"}
        </Text>
        <Text className="text-grey-darker mt-5" size="lg" font="gilroy">
          {subtitle ??
            "Consulta las preguntas más frecuentes y obtén información rápida y clara sobre cómo trabajamos."}
        </Text>
      </div>

      <AccordionQuestions items={data} />
    </section>
  );
};
