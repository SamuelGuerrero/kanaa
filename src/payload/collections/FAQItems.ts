import type { CollectionConfig } from "payload";

export const FAQItems: CollectionConfig = {
  slug: "faq-items",
  labels: {
    singular: "Pregunta Frecuente",
    plural: "Preguntas Frecuentes",
  },
  admin: {
    group: "Home",
    useAsTitle: "question",
    defaultColumns: ["question", "page", "order"],
    description: "Preguntas frecuentes por sección del sitio",
  },
  fields: [
    {
      name: "question",
      type: "text",
      label: "Pregunta",
      localized: true,
      required: true,
    },
    {
      name: "answer",
      type: "textarea",
      label: "Respuesta",
      localized: true,
      required: true,
    },
    {
      name: "page",
      type: "select",
      label: "Página",
      required: true,
      options: [
        { label: "Home", value: "home" },
        { label: "Gestión de Propiedades", value: "property-management" },
        { label: "Calculadora", value: "calculator" },
      ],
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 0,
    },
  ],
};
