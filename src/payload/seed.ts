import type { Payload } from "payload";

export async function seed(payload: Payload): Promise<void> {
  const { totalDocs } = await payload.count({ collection: "testimonials" });
  if (totalDocs > 0) return;

  payload.logger.info("Seeding initial Payload CMS data…");

  // ── Testimonials ──────────────────────────────────────────────────────────
  const testimonialData = [
    {
      name: "Jaime",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/User-229491415/original/38f81329-fd41-4610-b923-6caacc69af03.png?im_w=720",
      order: 1,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "Es un lugar genial, con una arquitectura preciosa y ubicado en la mejor parte de la ciudad. La casa se ve y es exactamente como las fotos. Recomiendo encarecidamente este alojamiento para disfrutar de la belleza que la ciudad tiene para ofrecer a su manera única.",
      },
      en: {
        role: "Guest",
        testimonial:
          "It's a great place, with beautiful architecture located in the best part of the city. The house looks exactly like the photos. I highly recommend this accommodation to enjoy the beauty the city has to offer in its unique way.",
      },
    },
    {
      name: "John",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/16437f8e-5e51-4be7-b29c-21f59de5e58d.jpg?im_w=720",
      order: 2,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "Kanaa me ha ayudado a gestionar mis propiedades de manera eficiente. El soporte técnico es excelente.",
      },
      en: {
        role: "Guest",
        testimonial:
          "Kanaa has helped me manage my properties efficiently. The technical support is excellent.",
      },
    },
    {
      name: "Fernanda",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/4f86e60e-fbb4-4dd9-b461-4bc904780c47.jpg?im_w=720",
      order: 3,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "Increíble atención al cliente y una propiedad de primera clase. Sin duda mi primera opción para futuras vacaciones.",
      },
      en: {
        role: "Guest",
        testimonial:
          "Incredible customer service and a first-class property. Definitely my first choice for future vacations.",
      },
    },
    {
      name: "Kseniia",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/User-243472200/original/555397f4-79a2-4cdf-aa69-a5e3641f6f74.jpeg?im_w=720",
      order: 4,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "Wow! Casa increíble! Este lugar muy bonito, limpio, tranquilo. Habitaciones muy espaciosas, las camas muy cómodas. Tiene todo lo que necesitas. Este airbnb es la mejor de la ciudad.",
      },
      en: {
        role: "Guest",
        testimonial:
          "Wow! Incredible house! This place is very beautiful, clean, quiet. Very spacious rooms, very comfortable beds. It has everything you need. This Airbnb is the best in the city.",
      },
    },
    {
      name: "Alejandro",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/User/original/68cd0545-a2da-48b3-bbd2-4759aff0f54a.jpeg?im_w=720",
      order: 5,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "Casa preciosa súper bien ubicada, a solo unas cuadras del centro, súper atentos y muy al pendiente de tus necesidades",
      },
      en: {
        role: "Guest",
        testimonial:
          "Beautiful house, super well located, just a few blocks from the center, super attentive and very aware of your needs.",
      },
    },
    {
      name: "Susan",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/bcca4b30-dfc7-4b60-aa22-218234e0d0f1.jpg?im_w=240",
      order: 6,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "Tuvimos una gran estadía aquí. El departamento está perfectamente ubicado pero en una calle tranquila, por lo que hay muy poco ruido. El apartamento estaba limpio y el complejo era seguro. Con mucho gusto me hospedaría de nuevo.",
      },
      en: {
        role: "Guest",
        testimonial:
          "We had a great stay here. The apartment is perfectly located but on a quiet street, so there is very little noise. The apartment was clean and the complex was safe. I would gladly stay again.",
      },
    },
    {
      name: "André",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/94bb7871-2ea2-405c-a504-c47db6b4510b.jpg?im_w=720",
      order: 7,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "¡Uno de los mejores alojamientos que hemos alquilado en los últimos años! Y el anfitrión fue muy servicial, ¡fue perfecto!",
      },
      en: {
        role: "Guest",
        testimonial:
          "One of the best accommodations we have rented in recent years! And the host was very helpful — it was perfect!",
      },
    },
    {
      name: "Alix",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/User/original/521cea88-93c2-44ba-82e2-e258f1632493.jpeg?im_w=720",
      order: 8,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "Reserva de último minuto, por la mañana para esa misma noche. Todo el mundo quedó encantado con la casa. Todo estuvo perfecto. La casa es magnífica, bien equipada. Comunicación perfecta y fluida.",
      },
      en: {
        role: "Guest",
        testimonial:
          "Last-minute booking, in the morning for that same night. Everyone was delighted with the house. Everything was perfect. The house is magnificent, well equipped. Perfect and fluid communication.",
      },
    },
    {
      name: "Alayna",
      rating: 5,
      avatarUrl:
        "https://a0.muscache.com/im/pictures/user/User/original/2e0dc84a-ab73-4781-9ca8-22afdd196eeb.jpeg?im_w=720",
      order: 9,
      isActive: true,
      es: {
        role: "Huésped",
        testimonial:
          "¡Eugenio fue un anfitrión maravilloso y siempre respondió! ¡Dio excelentes opciones para actividades que hacer en la ciudad, y la casa está justo en el centro de Mérida! 10/10 me hospedaría de nuevo.",
      },
      en: {
        role: "Guest",
        testimonial:
          "Eugenio was a wonderful host and always responded! He gave excellent suggestions for activities in the city, and the house is right in the center of Merida! 10/10 would stay again.",
      },
    },
  ];

  for (const { es, en, ...base } of testimonialData) {
    const doc = await payload.create({
      collection: "testimonials",
      data: { ...base, ...es },
      locale: "es",
    });
    await payload.update({
      collection: "testimonials",
      id: doc.id,
      data: en,
      locale: "en",
    });
  }

  // ── Guide Cards ───────────────────────────────────────────────────────────
  const guideCardData = [
    {
      order: 1,
      es: { name: "Los mejores planes de fin de semana en Mérida", category: "Para viajeros", date: "20 de agosto, 2025" },
      en: { name: "Best weekend plans in Merida", category: "For travelers", date: "August 20, 2025" },
    },
    {
      order: 2,
      es: { name: "Errores comunes que los propietarios deben evitar", category: "Para propietarios", date: "20 de agosto, 2025" },
      en: { name: "Common mistakes owners should avoid", category: "For owners", date: "August 20, 2025" },
    },
    {
      order: 3,
      es: { name: "Tips para viajar con familia o mascotas", category: "Lifestyle", date: "20 de agosto, 2025" },
      en: { name: "Tips for traveling with family or pets", category: "Lifestyle", date: "August 20, 2025" },
    },
  ];

  for (const { es, en, ...base } of guideCardData) {
    const doc = await payload.create({
      collection: "guide-cards",
      data: { ...base, ...es },
      locale: "es",
    });
    await payload.update({
      collection: "guide-cards",
      id: doc.id,
      data: en,
      locale: "en",
    });
  }

  // ── FAQ Items ─────────────────────────────────────────────────────────────
  const faqData: {
    page: "home" | "property-management" | "calculator";
    order: number;
    es: { question: string; answer: string };
    en: { question: string; answer: string };
  }[] = [
    {
      page: "home",
      order: 1,
      es: {
        question: "¿Qué es Kanaa?",
        answer:
          "Somos una empresa especializada en la gestión, operación y optimización de propiedades para renta, enfocada en maximizar el retorno de inversión de los propietarios mientras ofrecemos experiencias premium a los huéspedes.",
      },
      en: {
        question: "What is Kanaa?",
        answer:
          "We are a company specialized in managing, operating, and optimizing rental properties, focused on maximizing owners' return on investment while delivering premium guest experiences.",
      },
    },
    {
      page: "home",
      order: 2,
      es: {
        question: "¿Cómo funciona el modelo de Kanaa?",
        answer:
          "Nos encargamos de todo el proceso: desde la adecuación y optimización del inmueble, hasta la publicación, gestión de reservas, atención a huéspedes y mantenimiento operativo.",
      },
      en: {
        question: "How does Kanaa's model work?",
        answer:
          "We handle the entire process: from preparing and optimizing the property to publishing, reservation management, guest support, and operational maintenance.",
      },
    },
    {
      page: "home",
      order: 3,
      es: {
        question: "¿Qué tipo de propiedades aceptan?",
        answer:
          "Trabajamos principalmente con propiedades en ubicaciones estratégicas y con alto potencial de renta. Evaluamos cada inmueble para asegurar su viabilidad y rentabilidad.",
      },
      en: {
        question: "What types of properties do you accept?",
        answer:
          "We mainly work with properties in strategic locations and with high rental potential. We evaluate each property to ensure viability and profitability.",
      },
    },
    {
      page: "home",
      order: 4,
      es: {
        question: "¿Cuál es el beneficio para el propietario?",
        answer:
          "El propietario obtiene ingresos sin preocuparse por la operación diaria. Nuestro objetivo es maximizar ocupación, optimizar tarifas y mantener el inmueble en excelente estado.",
      },
      en: {
        question: "What is the benefit for the owner?",
        answer:
          "Owners earn income without worrying about daily operations. Our goal is to maximize occupancy, optimize rates, and keep the property in excellent condition.",
      },
    },
    {
      page: "home",
      order: 5,
      es: {
        question: "¿Cómo garantizan la rentabilidad?",
        answer:
          "Utilizamos análisis de mercado, estrategias dinámicas de precios y optimización continua del rendimiento para mantener la propiedad competitiva y rentable.",
      },
      en: {
        question: "How do you ensure profitability?",
        answer:
          "We use market analysis, dynamic pricing strategies, and continuous performance optimization to keep the property competitive and profitable.",
      },
    },
    {
      page: "home",
      order: 6,
      es: {
        question: "¿Quién se encarga del mantenimiento?",
        answer:
          "Nosotros coordinamos el mantenimiento preventivo y correctivo, así como limpieza profesional después de cada estancia.",
      },
      en: {
        question: "Who is in charge of maintenance?",
        answer:
          "We coordinate preventive and corrective maintenance, as well as professional cleaning after each stay.",
      },
    },
    {
      page: "home",
      order: 7,
      es: {
        question: "¿Qué pasa si hay daños en la propiedad?",
        answer:
          "Contamos con procesos de verificación, políticas de seguridad y protocolos para proteger el inmueble ante cualquier eventualidad.",
      },
      en: {
        question: "What happens if there is damage to the property?",
        answer:
          "We have verification processes, security policies, and protocols to protect the property against any eventuality.",
      },
    },
    {
      page: "home",
      order: 8,
      es: {
        question: "¿Cómo puedo empezar?",
        answer:
          "Solo necesitas contactarnos para una evaluación inicial. Analizamos tu propiedad y te presentamos una propuesta personalizada.",
      },
      en: {
        question: "How can I get started?",
        answer:
          "You only need to contact us for an initial assessment. We analyze your property and present a personalized proposal.",
      },
    },
    {
      page: "home",
      order: 9,
      es: {
        question: "¿Cobran una comisión fija o variable?",
        answer:
          "Nuestro modelo de ingresos está alineado con el desempeño de la propiedad. Los detalles se presentan en la propuesta personalizada.",
      },
      en: {
        question: "Do you charge a fixed or variable commission?",
        answer:
          "Our revenue model is aligned with the property's performance. Details are presented in the personalized proposal.",
      },
    },
  ];

  for (const { es, en, ...base } of faqData) {
    const doc = await payload.create({
      collection: "faq-items",
      data: { ...base, ...es },
      locale: "es",
    });
    await payload.update({
      collection: "faq-items",
      id: doc.id,
      data: en,
      locale: "en",
    });
  }

  // ── HomePageContent global — ES ───────────────────────────────────────────
  await payload.updateGlobal({
    slug: "home-page-content",
    locale: "es",
    data: {
      hero: {
        title: "Siéntete como en casa, en cualquier lugar",
        subtitle: "Hospédate con nosotros",
      },
      metrics: [
        { value: "+1,300", label: "Huéspedes felices" },
        { value: "+3", label: "Años de experiencia" },
        { value: "+1200", label: "estancias realizadas" },
        { value: "4.92★", label: "Valoración promedio" },
      ],
      featuredProperties: {
        title: "Conoce nuestros alojamientos",
        subtitle: "Alojamientos pensados para tu descanso.",
        buttonText: "Ver todos los alojamientos",
      },
      valueProposition: {
        title: "Encuentra tu espacio ideal para sentirte en calma",
        description:
          "Cada lugar está diseñado para brindarte calma, confort y una experiencia que se siente desde que llegas.",
        buttonText: "Contáctanos",
      },
      propertyManagement: {
        title: "Manejo de propiedades pensado para propietarios",
        buttonText: "Conocer más",
        features: [
          { text: "Gestión profesional de propiedades" },
          { text: "Optimización de ocupación" },
          { text: "Experiencia excepcional para huéspedes" },
        ],
      },
      calculatorSection: {
        title: "Descubre cuánto puede generar tu propiedad",
        description:
          "Calcula el potencial de ingresos de tu inmueble en minutos y recibe una estimación anual personalizada, clara y transparente.",
        buttonText: "Ir a la calculadora",
      },
      experienceSection: {
        title: "Experiencias que se sienten",
        description:
          "Descubre cómo cada estancia con Kanaa se convierte en momentos memorables, pensados para disfrutar sin preocupaciones.",
      },
      guideSection: {
        title: "Guías y consejos para viajeros y propietarios",
        description:
          "Artículos, tips y recomendaciones para tomar mejores decisiones al momento de reservar.",
        buttonText: "Visita nuestro blog",
      },
    },
  });

  // ── HomePageContent global — EN ───────────────────────────────────────────
  await payload.updateGlobal({
    slug: "home-page-content",
    locale: "en",
    data: {
      hero: {
        title: "Feel at home, anywhere",
        subtitle: "Stay with us",
      },
      metrics: [
        { value: "+1,300", label: "Happy guests" },
        { value: "+3", label: "Years of experience" },
        { value: "+1200", label: "Completed stays" },
        { value: "4.92★", label: "Average rating" },
      ],
      featuredProperties: {
        title: "Discover our properties",
        subtitle: "Accommodations designed for your rest.",
        buttonText: "View all accommodations",
      },
      valueProposition: {
        title: "Find your ideal space to feel at ease",
        description:
          "Every place is designed to offer you calm, comfort, and an experience you feel from the moment you arrive.",
        buttonText: "Contact us",
      },
      propertyManagement: {
        title: "Property management designed for owners",
        buttonText: "Learn more",
        features: [
          { text: "Professional property management" },
          { text: "Occupancy optimization" },
          { text: "Exceptional guest experience" },
        ],
      },
      calculatorSection: {
        title: "Discover how much your property can generate",
        description:
          "Calculate your property's earning potential in minutes and get a clear, personalized annual estimate.",
        buttonText: "Go to calculator",
      },
      experienceSection: {
        title: "Experiences you can feel",
        description:
          "Discover how every stay with Kanaa becomes memorable moments, designed for worry-free enjoyment.",
      },
      guideSection: {
        title: "Guides and tips for travelers and owners",
        description:
          "Articles, tips, and recommendations to make better decisions when booking.",
        buttonText: "Visit our blog",
      },
    },
  });

  payload.logger.info("Seeding complete ✓");
}
