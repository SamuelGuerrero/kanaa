import type { CollectionConfig } from "payload";

export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  labels: {
    singular: "Artículo",
    plural: "Artículos del blog",
  },
  admin: {
    group: "Blog",
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "category",
      "publishedAt",
      "isFeatured",
      "isPublished",
    ],
    description: "Entradas publicadas en /blog y /blog/[slug]",
  },

  fields: [
    // ── Identificación y clasificación ────────────────────────────────────
    {
      type: "tabs",
      tabs: [
        {
          label: "Contenido",
          fields: [
            {
              name: "slug",
              type: "text",
              label: "Slug (URL)",
              required: true,
              unique: true,
              index: true,
              admin: {
                description:
                  'Identificador único en la URL. Ej: "merida-sin-prisa"',
              },
            },
            {
              name: "title",
              type: "text",
              label: "Título",
              localized: true,
              required: true,
            },
            {
              name: "excerpt",
              type: "textarea",
              label: "Resumen corto (listado)",
              localized: true,
              required: true,
              admin: {
                description:
                  "Aparece en la tarjeta del listado. 1-2 líneas.",
              },
            },
            {
              name: "lead",
              type: "textarea",
              label: "Entradilla (post)",
              localized: true,
              required: true,
              admin: {
                description:
                  "Párrafo introductorio que aparece debajo del título en la página del artículo.",
              },
            },
            {
              name: "content",
              type: "richText",
              label: "Cuerpo del artículo",
              localized: true,
              required: true,
            },
          ],
        },
        {
          label: "Portada",
          fields: [
            {
              name: "coverImageUrl",
              type: "text",
              label: "URL de la imagen de portada",
              required: true,
              admin: {
                description: "URL pública del hero + card del listado",
              },
            },
            {
              name: "coverImage",
              type: "upload",
              label: "Imagen de portada (upload)",
              relationTo: "media",
              admin: {
                description:
                  "Opcional: sobreescribe coverImageUrl cuando se sube archivo",
              },
            },
            {
              name: "heroCaption",
              type: "text",
              label: "Pie de foto del hero",
              localized: true,
              admin: {
                description: "Texto que aparece debajo de la imagen principal",
              },
            },
          ],
        },
        {
          label: "Clasificación",
          fields: [
            {
              name: "category",
              type: "relationship",
              relationTo: "categories",
              label: "Categoría",
              required: true,
              admin: {
                description:
                  "Aparece como etiqueta y filtro. Se administra desde la colección Categorías.",
              },
            },
            {
              name: "tags",
              type: "array",
              label: "Etiquetas",
              localized: true,
              admin: {
                description:
                  "Chips que aparecen al pie del artículo. Pueden traducirse.",
              },
              fields: [
                {
                  name: "label",
                  type: "text",
                  label: "Etiqueta",
                  required: true,
                },
              ],
            },
            {
              name: "readTime",
              type: "text",
              label: "Tiempo de lectura",
              localized: true,
              required: true,
              admin: {
                description: 'Ej: "8 min de lectura"',
              },
            },
            {
              name: "publishedAt",
              type: "date",
              label: "Fecha de publicación",
              required: true,
              admin: {
                date: {
                  pickerAppearance: "dayOnly",
                  displayFormat: "d MMM yyyy",
                },
                description: "Fecha visible en el listado y en el post",
              },
            },
          ],
        },
        {
          label: "Autor",
          fields: [
            {
              name: "author",
              type: "relationship",
              label: "Autor",
              relationTo: "authors",
              required: true,
            },
          ],
        },
        {
          label: "Tabla de contenidos",
          fields: [
            {
              name: "tableOfContents",
              type: "array",
              label: "Secciones del artículo",
              localized: true,
              admin: {
                description:
                  "Lista de anclas que aparece en la columna derecha. El anchor debe coincidir con el id de la sección en el cuerpo del artículo.",
              },
              fields: [
                {
                  name: "anchor",
                  type: "text",
                  label: "Anchor",
                  required: true,
                  admin: {
                    description: 'Ej: "gastronomia", "cenotes"',
                  },
                },
                {
                  name: "label",
                  type: "text",
                  label: "Etiqueta",
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: "Relacionados",
          fields: [
            {
              name: "relatedPosts",
              type: "relationship",
              label: "Artículos relacionados",
              relationTo: "blog-posts",
              hasMany: true,
              admin: {
                description:
                  "Hasta 3 artículos que aparecerán al pie del post. Si queda vacío se toman los últimos de la misma categoría.",
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              label: "SEO",
              fields: [
                {
                  name: "metaTitle",
                  type: "text",
                  label: "Meta título",
                  localized: true,
                  admin: {
                    description:
                      "Si se deja vacío se usa el título del artículo",
                  },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  label: "Meta descripción",
                  localized: true,
                  admin: {
                    description:
                      "Si se deja vacío se usa el resumen (excerpt)",
                  },
                },
              ],
            },
          ],
        },
      ],
    },

    // ── Flags laterales ────────────────────────────────────────────────────
    {
      name: "isFeatured",
      type: "checkbox",
      label: "Destacado",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Marca el artículo como el destacado del listado",
      },
    },
    {
      name: "isPublished",
      type: "checkbox",
      label: "Publicado",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Si está desactivado no aparece en /blog",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Orden (opcional)",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description:
          "Orden manual dentro del listado. 0 = ordenar por fecha.",
      },
    },
  ],
};
