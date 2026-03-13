import { HeroJoin, IdealVacancy, JoinOurTeam } from "@/components/templates";
import { getJoinData } from "@/lib/strapi";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Únete al Equipo",
  description:
    "Descubre oportunidades para formar parte del equipo Kanaa y construir proyectos con impacto en hospitalidad y real estate.",
  path: "/join",
});

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const cms = await getJoinData(locale);

  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <HeroJoin
        title={cms.page?.hero_title}
        subtitle={cms.page?.hero_subtitle}
      />
      <JoinOurTeam
        title={cms.page?.team_title}
        subtitle={cms.page?.team_subtitle}
        jobs={cms.vacancies.length ? cms.vacancies : undefined}
      />
      <IdealVacancy
        title={cms.page?.ideal_title}
        description={cms.page?.ideal_description}
        email={cms.page?.ideal_email}
      />
    </main>
  );
}
