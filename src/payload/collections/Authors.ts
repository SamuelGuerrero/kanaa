import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  labels: {
    singular: "Autor",
    plural: "Autores",
  },
  admin: {
    group: "Blog",
    useAsTitle: "name",
    defaultColumns: ["name", "role"],
    description: "Autores que firman los artículos del blog",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre",
      required: true,
    },
    {
      name: "role",
      type: "text",
      label: "Rol / puesto",
      localized: true,
      required: true,
      admin: { description: 'Ej: "Editora de viajes"' },
    },
    {
      name: "bio",
      type: "textarea",
      label: "Biografía",
      localized: true,
      admin: {
        description: "Aparece en la tarjeta de autor al pie del artículo",
      },
    },
    {
      name: "avatar",
      type: "upload",
      label: "Avatar",
      relationTo: "media",
      admin: {
        description: "Sube la foto de perfil del autor",
      },
    },
    {
      name: "avatarUrl",
      type: "text",
      label: "URL del avatar (legado)",
      admin: {
        hidden: true,
        description:
          "Campo de respaldo histórico. Para autores nuevos usa Avatar.",
      },
    },
  ],
};
