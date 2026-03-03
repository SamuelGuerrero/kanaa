import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kanaa",
    short_name: "Kanaa",
    description:
      "Gestión profesional de propiedades vacacionales y optimización de ingresos.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#154734",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
