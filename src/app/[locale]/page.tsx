import { NoteIcon, PeopleIcon, StructuredData, TrendingRoundIcon } from "@/components/atoms";
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
import { faqPageSchema, localBusinessSchema } from "@/lib/schemas";
import { createPageMetadata } from "@/lib/seo";
import DiscoverGenerate from "@assets/images/Home/DiscoverGenerate.png";
import PropertyManagement from "@assets/images/Home/PropertyManagement.png";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Inicio",
  description:
    "Gestión profesional de propiedades vacacionales en México. En Kanaa optimizamos ingresos, ocupación y experiencia del huésped.",
  path: "/",
  keywords: [
    "gestión propiedades vacacionales",
    "renta vacacional México",
    "property management",
    "ingresos por renta",
    "administración de propiedades",
  ],
});

const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+1,300", label: "Huéspedes felices" },
  { value: "+3", label: "Años de experiencia" },
  { value: "+1200", label: "estancias realizadas" },
  { value: "4.92★", label: "Valoración promedio" },
];

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      {/* Structured data: LocalBusiness + FAQPage */}
      <StructuredData data={localBusinessSchema()} />
      <StructuredData data={faqPageSchema(DataHome)} />

      <main className="flex flex-col space-y-6">
        <Hero />
        <FeaturedProperties />
        <ValueProposition />
        {/* Espacios pensados para ti */}
        <KeyMetrics metrics={METRICS} bgColor="bg-gold-light" />
        <InfoSection
          title="Manejo de propiedades pensado para propietarios"
          image={PropertyManagement}
          imageAlt="Property Management"
          imagePosition="right"
          className="bg-green-dark-hover py-7 pb-2 sm:pb-7"
          descriptionClassName="text-white mt-8 mr-4 max-w-[600px]"
          textClassName="md:mt-20 ml-2 text-white mb-10"
          buttonProps={{
            children: "Conocer más",
            className: "justify-center md:w-auto md:px-6 md:py-4",
            textWeight: "bold",
            circleButtonClassName: "bg-gold-light-active!",
            href: `/${locale}/property-management`,
          }}
          featuresTextClassName="text-white"
          featuresIcon="bg-gold-normal !h-[50px] !w-[50px]"
          features={[
            {
              text: "Gestión profesional de propiedades",
              icon: <TrendingRoundIcon />,
            },
            {
              text: "Optimización de ocupación",
              icon: <NoteIcon />,
            },
            {
              text: "Experiencia excepcional para huéspedes",
              icon: <PeopleIcon />,
            },
          ]}
        />
        <InfoSection
          title="Descubre cuánto puede generar tu propiedad"
          description="Calcula el potencial de ingresos de tu inmueble en minutos y recibe una
        estimación anual personalizada, clara y transparente."
          image={DiscoverGenerate}
          imageAlt="DiscoverGenerate"
          imagePosition="left"
          className="bg-white"
          textClassName="md:mt-20 mx-2 text-green-normal "
          descriptionClassName="text-green-normal mt-8 max-w-[600px]"
          buttonProps={{
            children: "Ir a la calculadora",
            className:
              " justify-center md:w-auto md:px-6 md:py-2 text-gold-dark!",
            textWeight: "bold",
            href: `/${locale}/calculator`,
          }}
        />
        <BackedExperience />
        <GuideAndTips />
        <FrequentlyQuestions data={DataHome} />
      </main>
    </>
  );
}
