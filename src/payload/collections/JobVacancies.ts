import type { CollectionConfig } from "payload";

export const JobVacancies: CollectionConfig = {
  slug: "job-vacancies",
  labels: {
    singular: "Vacante",
    plural: "Vacantes",
  },
  admin: {
    group: "Join",
    useAsTitle: "title",
    defaultColumns: ["title", "type", "isActive", "order"],
    description: "Posiciones abiertas que aparecen en la página Únete al equipo",
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Puesto",
      localized: true,
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Descripción",
      localized: true,
      required: true,
    },
    {
      name: "type",
      type: "text",
      label: "Tipo de empleo",
      localized: true,
      required: true,
      admin: {
        description: 'Ej: "Tiempo Completo", "Medio Tiempo", "Freelance"',
      },
    },
    {
      name: "applyUrl",
      type: "text",
      label: "URL para aplicar",
      admin: {
        description: "Enlace externo al formulario o página de aplicación",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Activa",
      defaultValue: true,
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 0,
    },
  ],
};
