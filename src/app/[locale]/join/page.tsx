import { getPayload } from "payload";

import { HeroJoin, IdealVacancy, JoinOurTeam } from "@/components/templates";
import { createPageMetadata } from "@/lib/seo";
import configPromise from "@payload-config";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Únete al Equipo",
  description:
    "Descubre oportunidades para formar parte del equipo Kanaa y construir proyectos con impacto en hospitalidad y real estate.",
  path: "/join",
});

type JoinPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function JoinPage({ params }: JoinPageProps) {
  const { locale } = await params;
  const payloadLocale = locale === "en" ? "en" : "es";

  const payload = await getPayload({ config: configPromise });

  const vacanciesResult = await payload.find({
    collection: "job-vacancies",
    where: { isActive: { equals: true } },
    sort: "order",
    locale: payloadLocale,
  });

  const jobs = vacanciesResult.docs.map((doc) => ({
    title: doc.title,
    description: doc.description,
    type: doc.type,
  }));

  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <HeroJoin />
      <JoinOurTeam jobs={jobs} />
      <IdealVacancy />
    </main>
  );
}
