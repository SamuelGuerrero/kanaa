import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";
import type { ReactNode } from "react";


export const metadata: Metadata = createPageMetadata({
  title: "Checkout",
  description: "Flujo de pago y confirmación de reserva.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
