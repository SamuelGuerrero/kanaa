import { HeroJoin, IdealVacancy, JoinOurTeam } from "@/components/templates";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Únete al Equipo",
  description:
    "Descubre oportunidades para formar parte del equipo Kanaa y construir proyectos con impacto en hospitalidad y real estate.",
  path: "/join",
});

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <HeroJoin />
      <JoinOurTeam />
      <IdealVacancy />
    </main>
  );
}
