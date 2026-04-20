import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Reserva confirmada",
  description: "Resumen y confirmación de tu reserva vacacional con Kanaa.",
  path: "/booking-success",
  noIndex: true,
});

export default function BookingSuccessLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
