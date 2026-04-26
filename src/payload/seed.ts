import type { Payload } from "payload";

export async function seed(payload: Payload): Promise<void> {
  const { totalDocs: testimonialCount } = await payload.count({
    collection: "testimonials",
  });
  const { totalDocs: blogCount } = await payload.count({
    collection: "blog-posts",
  });

  if (testimonialCount > 0 && blogCount > 0) return;

  payload.logger.info("Seeding Payload CMS data…");

  if (testimonialCount === 0) {
    await seedInitialData(payload);
  }
  if (blogCount === 0) {
    await seedBlogData(payload);
  }

}

async function seedInitialData(payload: Payload): Promise<void> {

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
      es: {
        name: "Los mejores planes de fin de semana en Mérida",
        category: "Para viajeros",
        date: "20 de agosto, 2025",
      },
      en: {
        name: "Best weekend plans in Merida",
        category: "For travelers",
        date: "August 20, 2025",
      },
    },
    {
      order: 2,
      es: {
        name: "Errores comunes que los propietarios deben evitar",
        category: "Para propietarios",
        date: "20 de agosto, 2025",
      },
      en: {
        name: "Common mistakes owners should avoid",
        category: "For owners",
        date: "August 20, 2025",
      },
    },
    {
      order: 3,
      es: {
        name: "Tips para viajar con familia o mascotas",
        category: "Lifestyle",
        date: "20 de agosto, 2025",
      },
      en: {
        name: "Tips for traveling with family or pets",
        category: "Lifestyle",
        date: "August 20, 2025",
      },
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

}

async function seedBlogData(payload: Payload): Promise<void> {
  payload.logger.info("Seeding blog posts…");

  // ── Authors ───────────────────────────────────────────────────────────────
  const authorSeeds = [
    {
      key: "valeria",
      name: "Valeria Solís",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      es: {
        role: "Editora de viajes",
        bio: "Editora de viajes en Kanaa. Lleva diez años recorriendo el sureste mexicano y escribiendo sobre lo que encuentra cuando decide salir del camino marcado.",
      },
      en: {
        role: "Travel editor",
        bio: "Travel editor at Kanaa. Ten years spent criss-crossing southeast Mexico and writing about what she finds when she steps off the beaten path.",
      },
    },
    {
      key: "mateo",
      name: "Mateo Carrillo",
      avatarUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
      es: {
        role: "Especialista en hospedaje",
        bio: "Consultor de operaciones para anfitriones en el sureste. Escribe sobre cómo convertir una propiedad vacía en un hogar para otros.",
      },
      en: {
        role: "Hospitality specialist",
        bio: "Hospitality operations consultant. Writes about turning empty properties into homes for other people.",
      },
    },
    {
      key: "lucia",
      name: "Lucía Montes",
      avatarUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      es: {
        role: "Periodista gastronómica",
        bio: "Periodista enfocada en gastronomía yucateca y cocinas familiares. Cree que los mejores viajes empiezan en un mercado.",
      },
      en: {
        role: "Food journalist",
        bio: "Journalist focused on Yucatecan food and home kitchens. Believes the best trips start at a market.",
      },
    },
  ];

  const authorIds: Record<string, number> = {};
  for (const author of authorSeeds) {
    const doc = await payload.create({
      collection: "authors",
      data: {
        name: author.name,
        avatarUrl: author.avatarUrl,
        role: author.es.role,
        bio: author.es.bio,
      },
      locale: "es",
    });
    await payload.update({
      collection: "authors",
      id: doc.id,
      data: { role: author.en.role, bio: author.en.bio },
      locale: "en",
    });
    authorIds[author.key] = doc.id as number;
  }

  // ── Blog Posts ────────────────────────────────────────────────────────────
  // Lexical richText helpers (minimal shape accepted by @payloadcms/richtext-lexical)
  const txt = (text: string, bold = false) => ({
    type: "text" as const,
    detail: 0,
    format: bold ? 1 : 0,
    mode: "normal" as const,
    style: "",
    text,
    version: 1,
  });
  const p = (...children: ReturnType<typeof txt>[]) => ({
    type: "paragraph",
    version: 1,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    children,
  });
  const h2 = (id: string, text: string) => ({
    type: "heading",
    tag: "h2",
    version: 1,
    direction: "ltr" as const,
    format: "" as const,
    indent: 0,
    id, // the frontend can read this to render the anchor
    children: [txt(text)],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = (...nodes: any[]): any => ({
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: nodes,
    },
  });

  type PostSeed = {
    slug: string;
    category:
      | "travelers"
      | "owners"
      | "lifestyle"
      | "management"
      | "merida"
      | "gastronomy";
    coverImageUrl: string;
    publishedAt: string; // ISO
    isFeatured?: boolean;
    authorKey: "valeria" | "mateo" | "lucia";
    es: {
      title: string;
      excerpt: string;
      lead: string;
      heroCaption: string;
      readTime: string;
      tags: string[];
      toc: { id: string; label: string }[];
      content: ReturnType<typeof doc>;
      metaTitle?: string;
      metaDescription?: string;
    };
    en: {
      title: string;
      excerpt: string;
      lead: string;
      heroCaption: string;
      readTime: string;
      tags: string[];
      toc: { id: string; label: string }[];
      content: ReturnType<typeof doc>;
      metaTitle?: string;
      metaDescription?: string;
    };
  };

  const postSeeds: PostSeed[] = [
    // ─ FEATURED ────────────────────────────────────────────────────────────
    {
      slug: "merida-sin-prisa",
      category: "travelers",
      coverImageUrl:
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1920&auto=format&fit=crop",
      publishedAt: "2026-04-15",
      isFeatured: true,
      authorKey: "valeria",
      es: {
        title: "Mérida sin prisa: una guía para descubrirla como local",
        excerpt:
          "Entre plazas empedradas, cenotes escondidos y cocinas que huelen a recado rojo, Mérida se vive mejor cuando se camina despacio.",
        lead: "Entre plazas empedradas, cenotes escondidos y cocinas que huelen a recado rojo, Mérida se vive mejor cuando se camina despacio. Te contamos cómo convertir tu estancia en una experiencia que se queda.",
        heroCaption: "El Paseo de Montejo al atardecer — Mérida, Yucatán.",
        readTime: "8 min de lectura",
        tags: ["Mérida", "Guía de viaje", "Yucatán", "Gastronomía", "Cenotes"],
        toc: [
          { id: "llegando", label: "Cómo llegar y moverse" },
          { id: "barrios", label: "Los barrios que valen la pena" },
          { id: "gastronomia", label: "Qué comer (y dónde)" },
          { id: "cenotes", label: "Los cenotes cercanos" },
          { id: "consejos", label: "Consejos para viajeros lentos" },
        ],
        content: doc(
          p(
            txt(
              "Hay ciudades que te piden prisa. Mérida no es una de ellas. Desde que aterrizas en el aeropuerto y el olor a copal y a tortilla recién hecha se cuela por la ventana del taxi, algo en tu cuerpo entiende que aquí el tiempo funciona distinto.",
            ),
          ),
          h2("llegando", "Cómo llegar y moverse"),
          p(
            txt(
              "El Aeropuerto Internacional de Mérida conecta con Ciudad de México, Cancún, Monterrey y algunas rutas directas desde Houston y Miami.",
            ),
          ),
          h2("barrios", "Los barrios que valen la pena"),
          p(
            txt(
              "El Centro Histórico es el corazón obvio, pero si te quedas solo ahí te pierdes lo mejor. Santa Ana, García Ginerés y Santiago son barrios donde los meridanos viven de verdad.",
            ),
          ),
          h2("gastronomia", "Qué comer (y dónde)"),
          p(
            txt(
              "La cocina yucateca no se parece a ninguna otra cocina mexicana. Cochinita pibil, sopa de lima, panuchos, queso relleno: una herencia maya, española y libanesa que convive sin pedir permiso.",
            ),
          ),
          h2("cenotes", "Los cenotes cercanos"),
          p(
            txt(
              "A menos de una hora de Mérida existe una red de cenotes que hace que cualquier tarde calurosa tenga solución. Xlacah, Sambulá y los cenotes de Sotuta de Peón son buenos puntos de partida.",
            ),
          ),
          h2("consejos", "Consejos para viajeros lentos"),
          p(
            txt(
              "Elige un barrio por día, desayuna en el mercado, reserva un viernes para la música en vivo de la Plaza Grande, y aprende al menos tres palabras en maya. Mérida te va a dar exactamente lo que le pidas. Pídele despacio.",
            ),
          ),
        ),
      },
      en: {
        title: "Mérida, unhurried: a guide to seeing it like a local",
        excerpt:
          "Cobblestone squares, hidden cenotes and kitchens that smell of recado rojo — Mérida is better lived slowly.",
        lead: "Cobblestone squares, hidden cenotes and kitchens that smell of recado rojo — Mérida is better lived slowly. Here's how to turn a short stay into a trip that sticks.",
        heroCaption: "Paseo de Montejo at dusk — Mérida, Yucatán.",
        readTime: "8 min read",
        tags: ["Mérida", "Travel guide", "Yucatán", "Food", "Cenotes"],
        toc: [
          { id: "llegando", label: "Getting there and around" },
          { id: "barrios", label: "Neighborhoods worth your time" },
          { id: "gastronomia", label: "What to eat (and where)" },
          { id: "cenotes", label: "The nearby cenotes" },
          { id: "consejos", label: "Tips for slow travelers" },
        ],
        content: doc(
          p(
            txt(
              "Some cities ask for speed. Mérida isn't one of them. From the moment the smell of copal and fresh tortilla drifts through the taxi window, something in you understands that time works differently here.",
            ),
          ),
          h2("llegando", "Getting there and around"),
          p(
            txt(
              "Mérida International Airport connects with Mexico City, Cancun, Monterrey and direct routes from Houston and Miami.",
            ),
          ),
          h2("barrios", "Neighborhoods worth your time"),
          p(
            txt(
              "The Centro Histórico is the obvious heart, but staying only there means missing the best part. Santa Ana, García Ginerés and Santiago are where meridanos actually live.",
            ),
          ),
          h2("gastronomia", "What to eat (and where)"),
          p(
            txt(
              "Yucatecan cuisine doesn't taste like any other Mexican cuisine — Mayan, Spanish and Lebanese traditions living side by side.",
            ),
          ),
          h2("cenotes", "The nearby cenotes"),
          p(
            txt(
              "Within an hour of Mérida there's a network of cenotes that makes any hot afternoon bearable. Xlacah, Sambulá and Sotuta de Peón are great starting points.",
            ),
          ),
          h2("consejos", "Tips for slow travelers"),
          p(
            txt(
              "Pick one neighborhood per day, have breakfast at the market, save a Friday for live music at Plaza Grande, and learn three words in Maya. Mérida gives you exactly what you ask of it. Ask slowly.",
            ),
          ),
        ),
      },
    },

    // ─ POST 2 ──────────────────────────────────────────────────────────────
    {
      slug: "planes-fin-de-semana-merida",
      category: "travelers",
      coverImageUrl:
        "https://images.unsplash.com/photo-1583418007992-a1c1e5b93c78?q=80&w=1200&auto=format&fit=crop",
      publishedAt: "2025-08-20",
      authorKey: "valeria",
      es: {
        title: "Los mejores planes de fin de semana en Mérida",
        excerpt:
          "Mercados, conciertos al aire libre y rincones que se sienten solo los viernes por la noche.",
        lead: "Si tienes un fin de semana en Mérida y quieres aprovecharlo, esta es la ruta que seguiríamos nosotros.",
        heroCaption: "Plaza Grande un viernes por la noche.",
        readTime: "5 min de lectura",
        tags: ["Mérida", "Fin de semana", "Planes"],
        toc: [
          { id: "viernes", label: "Viernes: noche meridana" },
          { id: "sabado", label: "Sábado: mercado y cenote" },
          { id: "domingo", label: "Domingo: bici y brunch" },
        ],
        content: doc(
          p(
            txt(
              "Un buen fin de semana en Mérida se arma con poca planeación y mucha disposición a dejarse llevar.",
            ),
          ),
          h2("viernes", "Viernes: noche meridana"),
          p(
            txt(
              "La Plaza Grande se llena de música en vivo. Llega antes de las 8 pm para alcanzar buen lugar.",
            ),
          ),
          h2("sabado", "Sábado: mercado y cenote"),
          p(
            txt(
              "Desayuna temprano en el Mercado Lucas de Gálvez y sal a un cenote cercano para la tarde.",
            ),
          ),
          h2("domingo", "Domingo: bici y brunch"),
          p(
            txt(
              "La Bici Ruta convierte Paseo de Montejo en ciclovía. Termina con brunch en García Ginerés.",
            ),
          ),
        ),
      },
      en: {
        title: "Best weekend plans in Mérida",
        excerpt:
          "Markets, open-air concerts and corners that only come alive on Friday night.",
        lead: "If you have a weekend in Mérida and want to make it count, this is the route we'd take.",
        heroCaption: "Plaza Grande on a Friday night.",
        readTime: "5 min read",
        tags: ["Mérida", "Weekend", "Things to do"],
        toc: [
          { id: "viernes", label: "Friday: Meridano night" },
          { id: "sabado", label: "Saturday: market and cenote" },
          { id: "domingo", label: "Sunday: bike and brunch" },
        ],
        content: doc(
          p(
            txt(
              "A good weekend in Mérida needs little planning and a willingness to wander.",
            ),
          ),
          h2("viernes", "Friday: Meridano night"),
          p(
            txt(
              "Plaza Grande fills up with live music. Arrive before 8 pm for a good spot.",
            ),
          ),
          h2("sabado", "Saturday: market and cenote"),
          p(
            txt(
              "Breakfast at Mercado Lucas de Gálvez, then head to a nearby cenote for the afternoon.",
            ),
          ),
          h2("domingo", "Sunday: bike and brunch"),
          p(
            txt(
              "The Bici Ruta turns Paseo de Montejo into a bike lane. Finish with brunch in García Ginerés.",
            ),
          ),
        ),
      },
    },

    // ─ POST 3 ──────────────────────────────────────────────────────────────
    {
      slug: "errores-comunes-propietarios",
      category: "owners",
      coverImageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
      publishedAt: "2025-08-20",
      authorKey: "mateo",
      es: {
        title: "Errores comunes que los propietarios deben evitar",
        excerpt:
          "Desde fijar tarifas sin datos hasta descuidar las reseñas: lo que separa a una propiedad rentable del resto.",
        lead: "Después de trabajar con cientos de anfitriones, estos son los tropiezos que vemos una y otra vez.",
        heroCaption: "Cada decisión sin datos es una decisión costosa.",
        readTime: "6 min de lectura",
        tags: ["Propietarios", "Rentabilidad", "Gestión"],
        toc: [
          { id: "precios", label: "Precios sin datos" },
          { id: "fotos", label: "Fotos amateurs" },
          { id: "resenas", label: "Ignorar las reseñas" },
        ],
        content: doc(
          p(
            txt(
              "Operar una propiedad sin datos es como manejar con los ojos cerrados. Esto es lo que más vemos.",
            ),
          ),
          h2("precios", "Precios sin datos"),
          p(
            txt(
              "Fijar una tarifa basándose en 'lo que cobraba el vecino' es la forma más rápida de perder ingresos.",
            ),
          ),
          h2("fotos", "Fotos amateurs"),
          p(
            txt(
              "Las primeras tres fotos de un listado determinan el 80% de los clicks. Invierte en un profesional.",
            ),
          ),
          h2("resenas", "Ignorar las reseñas"),
          p(
            txt(
              "Cada reseña negativa sin respuesta es una oportunidad perdida de mostrar que te importa.",
            ),
          ),
        ),
      },
      en: {
        title: "Common mistakes owners should avoid",
        excerpt:
          "From setting rates without data to ignoring reviews — what separates a profitable property from the rest.",
        lead: "After working with hundreds of hosts, these are the traps we see again and again.",
        heroCaption: "Every decision made without data is a costly one.",
        readTime: "6 min read",
        tags: ["Owners", "Profitability", "Management"],
        toc: [
          { id: "precios", label: "Pricing without data" },
          { id: "fotos", label: "Amateur photos" },
          { id: "resenas", label: "Ignoring reviews" },
        ],
        content: doc(
          p(
            txt(
              "Operating a rental without data is driving with your eyes closed. Here's what we see most.",
            ),
          ),
          h2("precios", "Pricing without data"),
          p(
            txt(
              "Setting a rate based on 'what the neighbor charges' is the fastest way to lose revenue.",
            ),
          ),
          h2("fotos", "Amateur photos"),
          p(
            txt(
              "The first three photos drive 80% of clicks. Invest in a professional.",
            ),
          ),
          h2("resenas", "Ignoring reviews"),
          p(
            txt(
              "Every unanswered negative review is a missed chance to show you care.",
            ),
          ),
        ),
      },
    },

    // ─ POST 4 ──────────────────────────────────────────────────────────────
    {
      slug: "viajar-con-familia-o-mascotas",
      category: "lifestyle",
      coverImageUrl:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=1200&auto=format&fit=crop",
      publishedAt: "2025-08-20",
      authorKey: "valeria",
      es: {
        title: "Tips para viajar con familia o mascotas",
        excerpt:
          "Lo que realmente importa al elegir un alojamiento cuando viajas en grupo o con tu compañero de cuatro patas.",
        lead: "Viajar con niños o con perro no debería ser un dolor de cabeza. La clave está en lo que preguntas antes de reservar.",
        heroCaption: "Un buen alojamiento pet-friendly cambia el viaje.",
        readTime: "4 min de lectura",
        tags: ["Familia", "Mascotas", "Viajes"],
        toc: [
          { id: "espacio", label: "Espacio y distribución" },
          { id: "entorno", label: "Entorno pet-friendly" },
          { id: "basicos", label: "Los básicos que importan" },
        ],
        content: doc(
          p(
            txt(
              "Cuando el viaje incluye niños o mascotas, los detalles importan más que la postal.",
            ),
          ),
          h2("espacio", "Espacio y distribución"),
          p(
            txt(
              "Dos habitaciones separadas y una sala con sofá cama suelen valer más que el mejor gimnasio.",
            ),
          ),
          h2("entorno", "Entorno pet-friendly"),
          p(
            txt(
              "No basta con aceptar mascotas: pregunta si hay parques, restaurantes perro-friendly y veterinarios cerca.",
            ),
          ),
          h2("basicos", "Los básicos que importan"),
          p(
            txt(
              "Lavadora, cafetera y Wi-Fi estable. Son los básicos que separan una buena estancia de una memorable.",
            ),
          ),
        ),
      },
      en: {
        title: "Tips for traveling with family or pets",
        excerpt:
          "What really matters when choosing accommodation when you travel as a group or with a four-legged companion.",
        lead: "Traveling with kids or a dog shouldn't be a headache. It's all in what you ask before booking.",
        heroCaption: "A truly pet-friendly place changes the whole trip.",
        readTime: "4 min read",
        tags: ["Family", "Pets", "Travel"],
        toc: [
          { id: "espacio", label: "Space and layout" },
          { id: "entorno", label: "Pet-friendly surroundings" },
          { id: "basicos", label: "The basics that matter" },
        ],
        content: doc(
          p(
            txt(
              "When a trip includes kids or pets, the details matter more than the postcard.",
            ),
          ),
          h2("espacio", "Space and layout"),
          p(
            txt(
              "Two separate bedrooms and a living room with a sofa bed usually beat the best gym.",
            ),
          ),
          h2("entorno", "Pet-friendly surroundings"),
          p(
            txt(
              "Accepting pets isn't enough: ask about parks, pet-friendly restaurants and nearby vets.",
            ),
          ),
          h2("basicos", "The basics that matter"),
          p(
            txt(
              "Laundry, a coffee maker and stable Wi-Fi separate a good stay from a memorable one.",
            ),
          ),
        ),
      },
    },

    // ─ POST 5 ──────────────────────────────────────────────────────────────
    {
      slug: "como-equipar-tu-propiedad",
      category: "management",
      coverImageUrl:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
      publishedAt: "2025-08-12",
      authorKey: "mateo",
      es: {
        title: "Cómo equipar tu propiedad para recibir huéspedes",
        excerpt:
          "Esenciales, detalles y pequeños lujos que transforman una estancia promedio en una experiencia memorable.",
        lead: "Equipar una propiedad no es llenarla: es curar lo que realmente va a usar el huésped.",
        heroCaption: "Los detalles son lo que los huéspedes recuerdan.",
        readTime: "7 min de lectura",
        tags: ["Propietarios", "Equipamiento", "Operación"],
        toc: [
          { id: "esenciales", label: "Esenciales sin excusa" },
          { id: "cocina", label: "La cocina" },
          { id: "detalles", label: "Los detalles que sobresalen" },
        ],
        content: doc(
          p(
            txt(
              "Equipar una casa para huéspedes es un ejercicio de empatía: imaginar cada paso que dará tu visita.",
            ),
          ),
          h2("esenciales", "Esenciales sin excusa"),
          p(
            txt(
              "Sábanas de calidad, toallas suficientes, papel de baño para el primer día y Wi-Fi que funcione sin drama.",
            ),
          ),
          h2("cocina", "La cocina"),
          p(
            txt(
              "Una sartén decente, dos ollas, un buen cuchillo y una cafetera. Más allá de eso, depende del perfil de tu propiedad.",
            ),
          ),
          h2("detalles", "Los detalles que sobresalen"),
          p(
            txt(
              "Una mini-guía impresa del barrio, dos botellas de agua fría en la llegada y un cargador universal. Cuestan poco, se recuerdan mucho.",
            ),
          ),
        ),
      },
      en: {
        title: "How to equip your property to welcome guests",
        excerpt:
          "Essentials, touches and small luxuries that turn an average stay into a memorable one.",
        lead: "Equipping a rental isn't filling it — it's curating what the guest will actually use.",
        heroCaption: "Guests remember the details.",
        readTime: "7 min read",
        tags: ["Owners", "Setup", "Operations"],
        toc: [
          { id: "esenciales", label: "No-excuse essentials" },
          { id: "cocina", label: "The kitchen" },
          { id: "detalles", label: "Details that stand out" },
        ],
        content: doc(
          p(
            txt(
              "Equipping a home for guests is an exercise in empathy — imagining every step they'll take.",
            ),
          ),
          h2("esenciales", "No-excuse essentials"),
          p(
            txt(
              "Quality linens, enough towels, toilet paper for the first day, and Wi-Fi that just works.",
            ),
          ),
          h2("cocina", "The kitchen"),
          p(
            txt(
              "A decent pan, two pots, a good knife and a coffee maker. Beyond that, depends on your property profile.",
            ),
          ),
          h2("detalles", "Details that stand out"),
          p(
            txt(
              "A printed neighborhood guide, two cold waters on arrival, a universal charger. Cheap to add, long to remember.",
            ),
          ),
        ),
      },
    },

    // ─ POST 6 ──────────────────────────────────────────────────────────────
    {
      slug: "cinco-cenotes-cerca-de-merida",
      category: "merida",
      coverImageUrl:
        "https://images.unsplash.com/photo-1551776235-dde6d482980b?q=80&w=1200&auto=format&fit=crop",
      publishedAt: "2025-08-05",
      authorKey: "lucia",
      es: {
        title: "Cinco cenotes cerca de Mérida que valen el camino",
        excerpt:
          "Aguas turquesa, silencios verdes y rutas que puedes hacer en una mañana sin salir demasiado de la ciudad.",
        lead: "Yucatán tiene más de seis mil cenotes. Estos cinco están a menos de una hora de Mérida y son la mejor forma de empezar.",
        heroCaption: "El agua de los cenotes se siente distinta al mediodía.",
        readTime: "6 min de lectura",
        tags: ["Cenotes", "Mérida", "Naturaleza", "Yucatán"],
        toc: [
          { id: "xlacah", label: "Cenote Xlacah" },
          { id: "sambula", label: "Cenote Sambulá" },
          { id: "yokdzonot", label: "Cenote Yokdzonot" },
        ],
        content: doc(
          p(
            txt(
              "No todos los cenotes cercanos a Mérida son iguales: algunos son turísticos, otros guardan silencio.",
            ),
          ),
          h2("xlacah", "Cenote Xlacah"),
          p(
            txt(
              "Dentro de la zona arqueológica de Dzibilchaltún. Aguas cristalinas, peces que no te temen, y una hora y media de historia antes de nadar.",
            ),
          ),
          h2("sambula", "Cenote Sambulá"),
          p(
            txt(
              "Una caverna en Homún donde la luz entra en diagonal. Si hay suerte, lo tienes casi para ti solo.",
            ),
          ),
          h2("yokdzonot", "Cenote Yokdzonot"),
          p(
            txt(
              "Operado por una cooperativa de mujeres. Además de nadar, desayuna cochinita pibil a la orilla.",
            ),
          ),
        ),
      },
      en: {
        title: "Five cenotes near Mérida worth the drive",
        excerpt:
          "Turquoise water, green silences and routes you can do in a morning without leaving the city behind.",
        lead: "Yucatán has more than six thousand cenotes. These five are less than an hour from Mérida — a solid way to start.",
        heroCaption: "Cenote water feels different at noon.",
        readTime: "6 min read",
        tags: ["Cenotes", "Mérida", "Nature", "Yucatán"],
        toc: [
          { id: "xlacah", label: "Cenote Xlacah" },
          { id: "sambula", label: "Cenote Sambulá" },
          { id: "yokdzonot", label: "Cenote Yokdzonot" },
        ],
        content: doc(
          p(
            txt(
              "Not all cenotes near Mérida are the same: some are busy, others hold silence.",
            ),
          ),
          h2("xlacah", "Cenote Xlacah"),
          p(
            txt(
              "Inside the Dzibilchaltún archaeological site. Crystal water, fearless fish, and an hour and a half of history before you dive in.",
            ),
          ),
          h2("sambula", "Cenote Sambulá"),
          p(
            txt(
              "A cavern in Homún where light cuts diagonally. If you're lucky, it's almost yours alone.",
            ),
          ),
          h2("yokdzonot", "Cenote Yokdzonot"),
          p(
            txt(
              "Run by a women's cooperative. Swim, then eat cochinita pibil right on the water.",
            ),
          ),
        ),
      },
    },

    // ─ POST 7 ──────────────────────────────────────────────────────────────
    {
      slug: "leer-los-numeros-de-tu-propiedad",
      category: "owners",
      coverImageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      publishedAt: "2025-07-28",
      authorKey: "mateo",
      es: {
        title: "Cómo leer los números de tu propiedad mes a mes",
        excerpt:
          "Ocupación, tarifa media, ingreso por noche disponible: los indicadores que realmente cuentan la historia.",
        lead: "Un reporte mensual bien leído te dice si el mes fue bueno antes de que termine el siguiente.",
        heroCaption: "Los números no mienten, pero hay que saber preguntarles.",
        readTime: "5 min de lectura",
        tags: ["Propietarios", "Métricas", "Rentabilidad"],
        toc: [
          { id: "ocupacion", label: "Tasa de ocupación" },
          { id: "adr", label: "Tarifa promedio" },
          { id: "revpar", label: "RevPAR" },
        ],
        content: doc(
          p(
            txt(
              "Tres indicadores resumen casi todo lo que necesitas entender de tu propiedad.",
            ),
          ),
          h2("ocupacion", "Tasa de ocupación"),
          p(
            txt(
              "Porcentaje de noches vendidas sobre noches disponibles. Arriba del 70% es excelente en Mérida.",
            ),
          ),
          h2("adr", "Tarifa promedio"),
          p(
            txt(
              "Ingreso total dividido entre noches vendidas. Subir este número sin bajar ocupación es la meta.",
            ),
          ),
          h2("revpar", "RevPAR"),
          p(
            txt(
              "Ingreso por noche disponible. Combina ocupación y tarifa: el indicador definitivo de salud.",
            ),
          ),
        ),
      },
      en: {
        title: "How to read your property's numbers month by month",
        excerpt:
          "Occupancy, average rate, revenue per available night — the indicators that actually tell the story.",
        lead: "A well-read monthly report tells you how the month went before the next one is over.",
        heroCaption: "Numbers don't lie — but you have to know how to ask.",
        readTime: "5 min read",
        tags: ["Owners", "Metrics", "Profitability"],
        toc: [
          { id: "ocupacion", label: "Occupancy rate" },
          { id: "adr", label: "Average daily rate" },
          { id: "revpar", label: "RevPAR" },
        ],
        content: doc(
          p(
            txt(
              "Three indicators sum up most of what you need to understand about your rental.",
            ),
          ),
          h2("ocupacion", "Occupancy rate"),
          p(
            txt(
              "Nights sold over nights available. Above 70% is excellent in Mérida.",
            ),
          ),
          h2("adr", "Average daily rate"),
          p(
            txt(
              "Total revenue divided by nights sold. Raising this without lowering occupancy is the goal.",
            ),
          ),
          h2("revpar", "RevPAR"),
          p(
            txt(
              "Revenue per available night. Blends occupancy and rate — the ultimate health signal.",
            ),
          ),
        ),
      },
    },
  ];

  // Create posts in ES first, then translate to EN. Related posts assigned in second pass.
  const postIds: Record<string, number> = {};
  for (const post of postSeeds) {
    const created = await payload.create({
      collection: "blog-posts",
      draft: false,
      data: {
        slug: post.slug,
        category: post.category,
        coverImageUrl: post.coverImageUrl,
        publishedAt: post.publishedAt,
        isFeatured: post.isFeatured ?? false,
        isPublished: true,
        order: 0,
        author: authorIds[post.authorKey]!,
        title: post.es.title,
        excerpt: post.es.excerpt,
        lead: post.es.lead,
        heroCaption: post.es.heroCaption,
        readTime: post.es.readTime,
        tags: post.es.tags.map((label) => ({ label })),
        tableOfContents: post.es.toc,
        content: post.es.content,
        seo: {
          metaTitle: post.es.metaTitle,
          metaDescription: post.es.metaDescription,
        },
      },
      locale: "es",
    });
    await payload.update({
      collection: "blog-posts",
      id: created.id,
      data: {
        title: post.en.title,
        excerpt: post.en.excerpt,
        lead: post.en.lead,
        heroCaption: post.en.heroCaption,
        readTime: post.en.readTime,
        tags: post.en.tags.map((label) => ({ label })),
        tableOfContents: post.en.toc,
        content: post.en.content,
        seo: {
          metaTitle: post.en.metaTitle,
          metaDescription: post.en.metaDescription,
        },
      },
      locale: "en",
    });
    postIds[post.slug] = created.id as number;
  }

  // Link related posts (pick 3 other posts for each)
  const allSlugs = postSeeds.map((p) => p.slug);
  for (const post of postSeeds) {
    const related = allSlugs.filter((s) => s !== post.slug).slice(0, 3);
    const relatedIds = related.map((slug) => postIds[slug]).filter(Boolean);
    await payload.update({
      collection: "blog-posts",
      id: postIds[post.slug]!,
      data: {
        relatedPosts: relatedIds,
      },
    });
  }
}
