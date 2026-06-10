import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Solicitud de factura",
  description:
    "Solicita tu factura electrónica (CFDI) por tu hospedaje en Kanaa. Llena tus datos fiscales y la recibimos en contabilidad automáticamente.",
  path: "/facturacion",
  noIndex: true,
});

export default function FacturacionLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
