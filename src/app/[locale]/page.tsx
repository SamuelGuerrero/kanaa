import { getPayload } from "payload";

import {
  NoteIcon,
  PeopleIcon,
  StructuredData,
  TrendingRoundIcon,
} from "@/components/atoms";
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
import { faqPageSchema, localBusinessSchema } from "@/lib/schemas";
import { createPageMetadata } from "@/lib/seo";
import DiscoverGenerate from "@assets/images/Home/DiscoverGenerate.png";
import PropertyManagement from "@assets/images/Home/PropertyManagement.png";
import configPromise from "@payload-config";

import type { Testimonial } from "@/components/organisms";
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

const FALLBACK_METRICS: KeyMetricsProps["metrics"] = [
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

  const payload = await getPayload({ config: configPromise });

  const payloadLocale = locale === "en" ? "en" : "es";

  const [homeContent, testimonialsResult, guideCardsResult, faqResult] =
    await Promise.all([
      payload.findGlobal({ slug: "home-page-content", locale: payloadLocale }),
      payload.find({
        collection: "testimonials",
        where: { isActive: { equals: true } },
        sort: "order",
        limit: 9,
        locale: payloadLocale,
      }),
      payload.find({
        collection: "guide-cards",
        sort: "order",
        limit: 3,
        locale: payloadLocale,
      }),
      payload.find({
        collection: "faq-items",
        where: { page: { equals: "home" } },
        sort: "order",
        limit: 20,
        locale: payloadLocale,
      }),
    ]);

  const testimonials: Testimonial[] = testimonialsResult.docs.map((t, i) => ({
    id: i + 1,
    name: t.name,
    role: (t.role as string | undefined) ?? "Huésped",
    rating: (t.rating as number | undefined) ?? 5,
    testimonial: t.testimonial,
    avatarUrl: (t.avatarUrl as string | undefined) ?? "",
  }));

  const guideCards = guideCardsResult.docs.map((g) => ({
    name: g.name,
    category: g.category,
    date: g.date,
    imageUrl:
      g.image && typeof g.image === "object" && "url" in g.image
        ? g.image.url!
        : null,
  }));

  const faqItems = faqResult.docs.map((f) => ({
    question: f.question,
    answer: f.answer,
  }));

  const metrics: KeyMetricsProps["metrics"] =
    Array.isArray(homeContent.metrics) && homeContent.metrics.length > 0
      ? (homeContent.metrics as KeyMetricsProps["metrics"])
      : FALLBACK_METRICS;

  const pm = homeContent.propertyManagement as
    | {
        title?: string;
        buttonText?: string;
        features?: { text: string }[];
      }
    | undefined;

  const calc = homeContent.calculatorSection as
    | { title?: string; description?: string; buttonText?: string }
    | undefined;

  const pmFeatures = pm?.features ?? [
    { text: "Gestión profesional de propiedades" },
    { text: "Optimización de ocupación" },
    { text: "Experiencia excepcional para huéspedes" },
  ];

  return (
    <>
      <StructuredData data={localBusinessSchema()} />
      <StructuredData data={faqPageSchema(faqItems)} />

      <main className="flex flex-col space-y-6">
        <Hero
          title={(homeContent.hero as { title?: string } | undefined)?.title}
          subtitle={
            (homeContent.hero as { subtitle?: string } | undefined)?.subtitle
          }
        />

        <FeaturedProperties
          title={
            (homeContent.featuredProperties as { title?: string } | undefined)
              ?.title
          }
          subtitle={
            (
              homeContent.featuredProperties as
                | { subtitle?: string }
                | undefined
            )?.subtitle
          }
          buttonText={
            (
              homeContent.featuredProperties as
                | { buttonText?: string }
                | undefined
            )?.buttonText
          }
        />

        <ValueProposition
          title={
            (homeContent.valueProposition as { title?: string } | undefined)
              ?.title
          }
          description={
            (
              homeContent.valueProposition as
                | { description?: string }
                | undefined
            )?.description
          }
          buttonText={
            (
              homeContent.valueProposition as
                | { buttonText?: string }
                | undefined
            )?.buttonText
          }
        />

        <KeyMetrics metrics={metrics} bgColor="bg-gold-light" />

        <InfoSection
          title={pm?.title ?? "Manejo de propiedades pensado para propietarios"}
          image={PropertyManagement}
          imageAlt="Property Management"
          imagePosition="right"
          className="bg-green-dark-hover py-7 pb-2 sm:pb-7"
          descriptionClassName="text-white mt-8 mr-4 max-w-[600px]"
          textClassName="md:mt-20 ml-2 text-white mb-10"
          buttonProps={{
            children: pm?.buttonText ?? "Conocer más",
            className: "justify-center md:w-auto md:px-6 md:py-4",
            textWeight: "bold",
            circleButtonClassName: "bg-gold-light-active!",
            href: `/${locale}/property-management`,
          }}
          featuresTextClassName="text-white"
          featuresIcon="bg-gold-normal !h-[50px] !w-[50px]"
          features={pmFeatures.map((f, i) => ({
            text: f.text,
            icon:
              i === 0 ? (
                <TrendingRoundIcon />
              ) : i === 1 ? (
                <NoteIcon />
              ) : (
                <PeopleIcon />
              ),
          }))}
        />

        <InfoSection
          title={calc?.title ?? "Descubre cuánto puede generar tu propiedad"}
          description={
            calc?.description ??
            "Calcula el potencial de ingresos de tu inmueble en minutos y recibe una estimación anual personalizada, clara y transparente."
          }
          image={DiscoverGenerate}
          imageAlt="DiscoverGenerate"
          imagePosition="left"
          className="bg-white"
          textClassName="md:mt-20 mx-2 text-green-normal "
          descriptionClassName="text-green-normal mt-8 max-w-[600px]"
          buttonProps={{
            children: calc?.buttonText ?? "Ir a la calculadora",
            className:
              " justify-center md:w-auto md:px-6 md:py-2 text-gold-dark!",
            textWeight: "bold",
            href: `/${locale}/calculator`,
          }}
        />

        <BackedExperience
          title={
            (homeContent.experienceSection as { title?: string } | undefined)
              ?.title
          }
          description={
            (
              homeContent.experienceSection as
                | { description?: string }
                | undefined
            )?.description
          }
          testimonials={testimonials.length > 0 ? testimonials : undefined}
        />

        <GuideAndTips
          title={
            (homeContent.guideSection as { title?: string } | undefined)?.title
          }
          description={
            (homeContent.guideSection as { description?: string } | undefined)
              ?.description
          }
          buttonText={
            (homeContent.guideSection as { buttonText?: string } | undefined)
              ?.buttonText
          }
          cards={guideCards.length > 0 ? guideCards : undefined}
          locale={locale}
        />

        <FrequentlyQuestions
          data={faqItems.length > 0 ? faqItems : undefined}
        />
      </main>
    </>
  );
}
