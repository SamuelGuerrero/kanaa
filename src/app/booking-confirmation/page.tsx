
import { Text } from "@/components/atoms";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Confirmación de Reserva",
  description: "Página de confirmación de proceso de reserva.",
  path: "/booking-confirmation",
  noIndex: true,
});

export default function BookingConfirmationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <Text size="5xl" className="text-green-normal">
        Confirmación de reserva
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-4">
        Recibimos tu solicitud. Te contactaremos con los siguientes pasos.
      </Text>
    </main>
  );
}
