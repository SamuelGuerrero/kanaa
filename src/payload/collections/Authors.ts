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
      name: "avatarUrl",
      type: "text",
      label: "URL del avatar",
      required: true,
      admin: {
        description:
          "URL pública de la foto de perfil (usar Media si se prefiere subir)",
      },
    },
    {
      name: "avatar",
      type: "upload",
      label: "Avatar (upload)",
      relationTo: "media",
      admin: {
        description:
          "Opcional: sobreescribe avatarUrl si se sube una imagen aquí",
      },
    },
  ],
};
