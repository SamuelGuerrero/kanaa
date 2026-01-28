import { Text } from '@/components/atoms'
import { AccordionQuestions } from '@/components/molecules';

const faqData = [
    {
        question: "¿Cómo funciona nuestro servicio?",
        answer:
            "Nuestro servicio está diseñado para ser simple y eficiente. Solo necesitas registrarte, elegir lo que necesitas y nosotros nos encargamos del resto.",
    },
    {
        question: "¿Cuánto tiempo tarda en completarse una solicitud?",
        answer:
            "Tarda",
    },
    {
        question: "¿Puedo modificar o cancelar mi reservación?",
        answer:
            "Sí",
    },
    {
        question: "¿Qué métodos de pago aceptan?",
        answer:
            "Aceptamos",
    },
    {
        question: "¿Cómo contacto al soporte si tengo un problema?",
        answer:
            "Contacta",
    },
];

export const FrequentlyQuestions = () => {
    return (
        <section className='bg-white flex justify-center space-x-10 py-10'>
            <div>
                <Text size='5xl' weight='medium' className='text-green-normal'>
                    Preguntas frecuentes
                </Text>
                <Text className='mt-5 text-grey-dark' size='lg' weight='medium'>
                    Consulta las preguntas más frecuentes y obtén información
                    <br />
                    rápida y clara sobre cómo trabajamos.
                </Text>
            </div>
            <AccordionQuestions data={faqData} />
        </section >
    )
}
