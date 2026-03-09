import { Text } from "@/components/atoms";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Reserva Confirmada",
  description: "Resumen de confirmación de reserva.",
  path: "/booking-success",
  noIndex: true,
});

export default function BookingSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <Text size="5xl" className="text-green-normal">
        Reserva confirmada
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-4">
        Gracias por tu reserva. Te enviaremos los detalles por correo.
      </Text>
    </main>
  );
}
