export type FAQItem = {
    question: string;
    answer: string;
};

export const DataPropertyManagment: FAQItem[] = [
    {
        question: "¿Qué incluye el servicio de gestión de propiedades?",
        answer:
            "Nuestro servicio incluye administración integral del inmueble: publicación y optimización del anuncio, gestión de reservas, atención a huéspedes, limpieza profesional, mantenimiento preventivo y reportes periódicos de ingresos.",
    },
    {
        question:
            "¿Puedo usar el servicio aunque no viva en la misma ciudad que mi propiedad?",
        answer:
            "Sí. Nos encargamos de todo de forma remota para que no tengas que estar presente. Tú puedes monitorear el desempeño de tu propiedad desde cualquier lugar, con total tranquilidad.",
    },
    {
        question: "¿Mi propiedad estará disponible todo el año?",
        answer:
            "La estimación se basa en factores como ubicación, tipo de propiedad, número de habitaciones, temporada y demanda del mercado. Con esta información te damos una proyección realista y personalizada.",
    },
    {
        question:
            "¿Qué pasa si surge un problema con un huésped o con la propiedad?",
        answer:
            "Depende de tu preferencia. Puedes definir fechas de uso personal y nosotros gestionamos el calendario para maximizar ingresos cuando esté disponible para renta.",
    },
    {
        question: "¿Cómo y cuándo recibo mis ingresos?",
        answer:
            "Nuestro equipo se encarga de resolver cualquier incidencia de manera inmediata, tanto con huéspedes como con temas operativos o de mantenimiento, para proteger tu inversión.",
    },
] as const;

export const DataHome: FAQItem[] = [
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


export const DataCalculator: FAQItem[] = [
    {
        question: "¿Cómo funciona la calculadora de ingresos?",
        answer:
            "La calculadora analiza datos como ubicación, tipo de propiedad, número de huéspedes, habitaciones y temporada para ofrecerte una estimación clara y realista del ingreso potencial de tu propiedad.",
    },
    {
        question: "¿La estimación de ingresos es gratuita?",
        answer: "Sí. La estimación es 100% gratuita y no implica ningún compromiso. Es una herramienta diseñada para ayudarte a tomar decisiones informadas.",
    },
    {
        question: "¿Qué plataformas de reservas gestionan?",
        answer: "Trabajamos con las principales plataformas de renta vacacional, optimizando tu anuncio para maximizar visibilidad, ocupación y rentabilidad.",
    },
    {
        question: "¿Cómo optimizan los precios de mi propiedad?",
        answer: "Utilizamos análisis de datos, tendencias del mercado y herramientas de pricing dinámico para ajustar tarifas en tiempo real y maximizar tus ingresos sin afectar la ocupación.",
    },
    {
        question: "¿Quién se encarga de la atención a los huéspedes?",
        answer: "Nuestro equipo se encarga de la comunicación antes, durante y después de la estancia, asegurando una experiencia fluida tanto para los huéspedes como para ti.",
    },
] as const;


