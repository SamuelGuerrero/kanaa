import {
  FeaturedProperties,
  Hero,
  KeyMetrics,
  ValueProposition,
  InfoSection,
  BackedExperience,
  GuideAndTips,
  FrequentlyQuestions,
} from "@/components/templates";
import { DataHome } from "@/data/faqData";
import { createPageMetadata } from "@/lib/seo";
import { getHomeData, mediaUrl } from "@/lib/strapi";
import DiscoverGenerate from "@assets/images/Home/DiscoverGenerate.png";
import PropertyManagement from "@assets/images/Home/PropertyManagement.png";

import type { Metadata } from "next";
import type { FAQItem } from "@/data/faqData";

export const metadata: Metadata = createPageMetadata({
  title: "Inicio",
  description:
    "Gestión profesional de propiedades vacacionales en México. En Kanaa optimizamos ingresos, ocupación y experiencia del huésped.",
  path: "/",
});

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const cms = await getHomeData(locale);

  const metrics =
    cms.metrics.length > 0
      ? cms.metrics.map((m) => ({ value: m.value, label: m.label }))
      : [
          { value: "+1,300", label: "Huéspedes felices" },
          { value: "+3", label: "Años de experiencia" },
          { value: "+1200", label: "Estancias realizadas" },
          { value: "4.92★", label: "Valoración promedio" },
        ];

  const pmSection = cms.infoSections.find((s) => s.slug === "property-management");
  const calcSection = cms.infoSections.find((s) => s.slug === "calculator");

  const faqItems: FAQItem[] =
    cms.faqItems.length > 0
      ? cms.faqItems.map((f) => ({ question: f.question, answer: f.answer }))
      : DataHome;

  return (
    <main className="flex flex-col space-y-6">
      <Hero
        title={cms.hero?.title}
        subtitle={cms.hero?.subtitle}
        backgroundImageUrl={mediaUrl(cms.hero?.background_image)}
      />

      <FeaturedProperties
        title={cms.featuredProperties?.title}
        subtitle={cms.featuredProperties?.subtitle}
        buttonLabel={cms.featuredProperties?.button_label}
      />

      <ValueProposition
        title={cms.valueProposition?.title}
        description={cms.valueProposition?.description}
        buttonLabel={cms.valueProposition?.button_label}
        leftImageUrl={mediaUrl(cms.valueProposition?.left_image)}
        rightImageUrl={mediaUrl(cms.valueProposition?.right_image)}
      />

      <KeyMetrics metrics={metrics} bgColor="bg-gold-light" />

      <InfoSection
        title={pmSection?.title ?? "Property Management pensado para propietarios"}
        description={
          pmSection?.description ??
          `En Kanaa administramos tu propiedad de manera profesional, cuidando
          cada espacio, optimizando la ocupación y ofreciendo una experiencia
          excepcional a los huéspedes, mientras tú disfrutas de total tranquilidad.`
        }
        {...(pmSection?.image
          ? { imageUrl: mediaUrl(pmSection.image) ?? "" }
          : { image: PropertyManagement })}
        imageAlt="Property Management"
        imagePosition={pmSection?.image_position ?? "right"}
        className="bg-green-dark-hover py-7 pb-2 sm:pb-7"
        descriptionClassName="text-white mt-8 mr-4 max-w-[600px]"
        textClassName="md:mt-20 ml-2 text-white  "
        buttonProps={{
          children: pmSection?.button_label ?? "Conocer más",
          className: " justify-center md:w-auto md:px-6 md:py-2",
          textWeight: "bold",
          circleButtonClassName: "bg-gold-light-active!",
          href: pmSection?.button_href ?? `/${locale}/property-management`,
        }}
      />

      <InfoSection
        title={calcSection?.title ?? "Descubre cuánto puede generar tu propiedad"}
        description={
          calcSection?.description ??
          `Calcula el potencial de ingresos de tu inmueble en minutos y recibe una
          estimación anual personalizada, clara y transparente.`
        }
        {...(calcSection?.image
          ? { imageUrl: mediaUrl(calcSection.image) ?? "" }
          : { image: DiscoverGenerate })}
        imageAlt="DiscoverGenerate"
        imagePosition={calcSection?.image_position ?? "left"}
        className="bg-white"
        textClassName="md:mt-20 mx-2 text-green-normal "
        descriptionClassName="text-green-normal mt-8 max-w-[600px]"
        buttonProps={{
          children: calcSection?.button_label ?? "Ir a la calculadora",
          className: " justify-center md:w-auto md:px-6 md:py-2 text-gold-dark!",
          textWeight: "bold",
          href: calcSection?.button_href ?? `/${locale}/calculator`,
        }}
      />

      <BackedExperience
        title={cms.backedExperience?.title}
        subtitle={cms.backedExperience?.subtitle}
        testimonials={
          cms.testimonials.length > 0
            ? cms.testimonials.map((t) => ({
                id: t.id,
                name: t.name,
                role: t.role,
                rating: t.rating,
                testimonial: t.content,
                avatarUrl: t.avatar_url ?? "",
              }))
            : undefined
        }
      />

      <GuideAndTips
        title={cms.guidesSection?.title}
        subtitle={cms.guidesSection?.subtitle}
        buttonLabel={cms.guidesSection?.button_label}
        cards={
          cms.guideCards.length > 0
            ? cms.guideCards.map((c) => ({
                name: c.title,
                category: c.category,
                date: c.date ?? "",
                imageUrl: c.image ? (mediaUrl(c.image) ?? undefined) : undefined,
              }))
            : undefined
        }
      />

      <FrequentlyQuestions
        title={cms.faqSection?.title}
        subtitle={cms.faqSection?.subtitle}
        data={faqItems}
      />
    </main>
  );
}
