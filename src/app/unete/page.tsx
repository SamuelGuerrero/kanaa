import { HeroJoin, IdealVacancy, JoinOurTeam } from "@/components/templates";

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <HeroJoin />
      <JoinOurTeam />
      <IdealVacancy />
    </main>
  );
}
