import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Sistema",
    description: "Imágenes y archivos multimedia del sitio (S3)",
  },
  upload: {
    // Storage is handled by the s3Storage plugin in payload.config.ts.
    // Image sizes are still generated locally with sharp and uploaded
    // to S3 alongside the original.
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 576, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      required: true,
    },
  ],
};
