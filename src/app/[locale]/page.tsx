import { NoteIcon, PeopleIcon, TrendingRoundIcon } from "@/components/atoms";
import {
  FeaturedProperties,
  Hero,
  KeyMetrics,
  ValueProposition,
  InfoSection,
  BackedExperience,
  type KeyMetricsProps,
  GuideAndTips,
  FrequentlyQuestions,
} from "@/components/templates";
import { DataHome } from "@/data/faqData";
import { createPageMetadata } from "@/lib/seo";
import DiscoverGenerate from "@assets/images/Home/DiscoverGenerate.png";
import PropertyManagement from "@assets/images/Home/PropertyManagement.png";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Inicio",
  description:
    "Gestión profesional de propiedades vacacionales en México. En Kanaa optimizamos ingresos, ocupación y experiencia del huésped.",
  path: "/",
});

const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+1,300", label: "Huéspedes felices" },
  { value: "+3", label: "Años de experiencia" },
  { value: "+1200", label: "Estancias realizadas" },
  { value: "4.92★", label: "Valoración promedio" },
];

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-col space-y-6">
      <Hero />
      <FeaturedProperties />
      <ValueProposition />
      {/* Espacios pensados para ti */}
      <KeyMetrics metrics={METRICS} bgColor="bg-gold-light" />
    </main>
  );
}
