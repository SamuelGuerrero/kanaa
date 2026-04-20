import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Seguimiento de reserva",
  description:
    "Consulta el estado de tu reserva vacacional con Kanaa ingresando tu número de reserva y correo electrónico.",
  path: "/reservation-tracking",
  noIndex: true,
});

export default function ReservationTrackingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
