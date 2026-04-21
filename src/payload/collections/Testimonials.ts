import type { CollectionConfig } from "payload";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: {
    singular: "Testimonio",
    plural: "Testimonios",
  },
  admin: {
    group: "Home",
    useAsTitle: "name",
    defaultColumns: ["name", "rating", "isActive", "order"],
    description: "Reseñas y testimonios de huéspedes",
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
      label: "Rol",
      localized: true,
      defaultValue: "Huésped",
    },
    {
      name: "rating",
      type: "number",
      label: "Calificación",
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: "testimonial",
      type: "textarea",
      label: "Testimonio",
      localized: true,
      required: true,
    },
    {
      name: "avatarUrl",
      type: "text",
      label: "URL del Avatar",
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 0,
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Activo",
      defaultValue: true,
    },
  ],
};
