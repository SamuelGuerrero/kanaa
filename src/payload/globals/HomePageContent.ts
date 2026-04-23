import type { GlobalConfig } from "payload";

export const HomePageContent: GlobalConfig = {
  slug: "home-page-content",
  label: "Contenido del Home",
  admin: {
    group: "Home",
    description:
      "Administra todos los textos y contenidos de la página de inicio",
  },
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Sección Hero",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Título principal",
          localized: true,
          defaultValue: "Siéntete como en casa, en cualquier lugar",
        },
        {
          name: "subtitle",
          type: "text",
          label: "Subtítulo",
          localized: true,
          defaultValue: "Hospédate con nosotros",
        },
      ],
    },
    {
      name: "featuredProperties",
      type: "group",
      label: "Sección Alojamientos Destacados",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Título",
          localized: true,
          defaultValue: "Conoce nuestros alojamientos",
        },
        {
          name: "subtitle",
          type: "text",
          label: "Subtítulo",
          localized: true,
          defaultValue: "Alojamientos pensados para tu descanso.",
        },
        {
          name: "buttonText",
          type: "text",
          label: "Texto del botón",
          localized: true,
          defaultValue: "Ver todos los alojamientos",
        },
      ],
    },
    {
      name: "valueProposition",
      type: "group",
      label: "Sección Propuesta de Valor",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Título",
          localized: true,
          defaultValue: "Encuentra tu espacio ideal para sentirte en calma",
        },
        {
          name: "description",
          type: "textarea",
          label: "Descripción",
          localized: true,
          defaultValue:
            "Cada lugar está diseñado para brindarte calma, confort y una experiencia que se siente desde que llegas.",
        },
        {
          name: "buttonText",
          type: "text",
          label: "Texto del botón",
          localized: true,
          defaultValue: "Contáctanos",
        },
      ],
    },
    {
      name: "metrics",
      type: "array",
      label: "Métricas clave",
      fields: [
        {
          name: "value",
          type: "text",
          label: "Valor",
          required: true,
        },
        {
          name: "label",
          type: "text",
          label: "Etiqueta",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "propertyManagement",
      type: "group",
      label: "Sección Gestión de Propiedades",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Título",
          localized: true,
          defaultValue: "Manejo de propiedades pensado para propietarios",
        },
        {
          name: "buttonText",
          type: "text",
          label: "Texto del botón",
          localized: true,
          defaultValue: "Conocer más",
        },
        {
          name: "features",
          type: "array",
          label: "Características",
          fields: [
            {
              name: "text",
              type: "text",
              label: "Texto",
              localized: true,
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "calculatorSection",
      type: "group",
      label: "Sección Calculadora",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Título",
          localized: true,
          defaultValue: "Descubre cuánto puede generar tu propiedad",
        },
        {
          name: "description",
          type: "textarea",
          label: "Descripción",
          localized: true,
          defaultValue:
            "Calcula el potencial de ingresos de tu inmueble en minutos y recibe una estimación anual personalizada, clara y transparente.",
        },
        {
          name: "buttonText",
          type: "text",
          label: "Texto del botón",
          localized: true,
          defaultValue: "Ir a la calculadora",
        },
      ],
    },
    {
      name: "experienceSection",
      type: "group",
      label: "Sección Experiencias",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Título",
          localized: true,
          defaultValue: "Experiencias que se sienten",
        },
        {
          name: "description",
          type: "textarea",
          label: "Descripción",
          localized: true,
          defaultValue:
            "Descubre cómo cada estancia con Kanaa se convierte en momentos memorables, pensados para disfrutar sin preocupaciones.",
        },
      ],
    },
    {
      name: "guideSection",
      type: "group",
      label: "Sección Guías y Consejos",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Título",
          localized: true,
          defaultValue: "Guías y consejos para viajeros y propietarios",
        },
        {
          name: "description",
          type: "textarea",
          label: "Descripción",
          localized: true,
          defaultValue:
            "Artículos, tips y recomendaciones para tomar mejores decisiones al momento de reservar.",
        },
        {
          name: "buttonText",
          type: "text",
          label: "Texto del botón",
          localized: true,
          defaultValue: "Visita nuestro blog",
        },
      ],
    },
  ],
};
