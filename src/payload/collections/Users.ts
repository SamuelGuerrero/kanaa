import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    group: "Sistema",
    useAsTitle: "email",
    description: "Usuarios con acceso al panel de administración",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre",
    },
  ],
};
