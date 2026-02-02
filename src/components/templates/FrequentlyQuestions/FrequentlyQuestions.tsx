import { Text } from "@/components/atoms";
import { AccordionQuestions, type FAQItem } from "@/components/molecules";

const FAQ_DATA: FAQItem[] = [
  {
    question: "¿Cómo funciona nuestro servicio?",
    answer:
      "Nuestro servicio está diseñado para ser simple y eficiente. Solo necesitas registrarte, elegir lo que necesitas y nosotros nos encargamos del resto.",
  },
  {
    question: "¿Cuánto tiempo tarda en completarse una solicitud?",
    answer: "Tarda",
  },
  {
    question: "¿Puedo modificar o cancelar mi reservación?",
    answer: "Sí",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos",
  },
  {
    question: "¿Cómo contacto al soporte si tengo un problema?",
    answer: "Contacta",
  },
] as const;

export const FrequentlyQuestions = () => {
  return (
    <section className="flex justify-between space-x-10 bg-white px-14 py-16">
      <div>
        <Text size="5xl" weight="medium" className="text-green-normal">
          Preguntas frecuentes
        </Text>
        <Text className="text-grey-darker mt-5" size="lg" font="gilroy">
          Consulta las preguntas más frecuentes y obtén información
          <br />
          rápida y clara sobre cómo trabajamos.
        </Text>
      </div>

      <AccordionQuestions items={FAQ_DATA} />
    </section>
  );
};
