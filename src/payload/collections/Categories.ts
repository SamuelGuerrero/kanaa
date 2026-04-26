import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "Categoría",
    plural: "Categorías",
  },
  admin: {
    group: "Blog",
    useAsTitle: "label",
    defaultColumns: ["label", "slug", "order"],
    description:
      "Categorías de artículos del blog. Aparecen como filtros en /blog y como etiqueta en cada post.",
  },
  fields: [
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'Identificador estable usado en la URL (?cat=...). Ej: "travelers", "owners".',
      },
    },
    {
      name: "label",
      type: "text",
      label: "Nombre",
      localized: true,
      required: true,
      admin: {
        description: "Texto visible en los filtros y tarjetas",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 0,
      admin: {
        description:
          "Posición en la barra de filtros. Menor = aparece primero.",
      },
    },
  ],
};
