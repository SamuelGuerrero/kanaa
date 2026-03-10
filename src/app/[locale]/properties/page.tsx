import { Suspense } from "react";

import { PropertiesSearch } from "@/components/templates";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Propiedades Vacacionales",
  description:
    "Explora propiedades vacacionales administradas por Kanaa con información detallada, disponibilidad y amenidades.",
  path: "/properties",
});

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando propiedades...</div>}>
      <PropertiesSearch />
    </Suspense>
  );
}
