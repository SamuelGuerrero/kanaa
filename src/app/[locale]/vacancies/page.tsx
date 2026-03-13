import { Text } from "@/components/atoms";
import { getVacanciesPageData } from "@/lib/strapi";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Vacantes",
  description:
    "Consulta próximas vacantes en Kanaa para roles en operaciones, hospitalidad y crecimiento inmobiliario.",
  path: "/vacancies",
});

type Props = { params: Promise<{ locale: string }> };

export default async function VacantesPage({ params }: Props) {
  const { locale } = await params;
  const cms = await getVacanciesPageData(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <Text size="5xl" className="text-green-normal">
        {cms?.heading ?? "Vacantes"}
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-4">
        {cms?.coming_soon ?? "Próximamente."}
      </Text>
    </main>
  );
}
