import type { CollectionConfig } from "payload";

export const GuideCards: CollectionConfig = {
  slug: "guide-cards",
  labels: {
    singular: "Guía",
    plural: "Guías y Consejos",
  },
  admin: {
    group: "Home",
    useAsTitle: "name",
    defaultColumns: ["name", "category", "date", "order"],
    description: "Tarjetas de guías y consejos para el blog del home",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Título",
      localized: true,
      required: true,
    },
    {
      name: "category",
      type: "text",
      label: "Categoría",
      localized: true,
      required: true,
    },
    {
      name: "date",
      type: "text",
      label: "Fecha",
      localized: true,
      required: true,
    },
    {
      name: "image",
      type: "upload",
      label: "Imagen",
      relationTo: "media",
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 0,
    },
  ],
};
