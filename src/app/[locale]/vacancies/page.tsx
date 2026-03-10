import { Text } from "@/components/atoms";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Vacantes",
  description:
    "Consulta próximas vacantes en Kanaa para roles en operaciones, hospitalidad y crecimiento inmobiliario.",
  path: "/vacancies",
});

export default function VacantesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <Text size="5xl" className="text-green-normal">
        Vacantes
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-4">
        Próximamente.
      </Text>
    </main>
  );
}
