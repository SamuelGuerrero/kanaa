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
import DiscoverGenerate from "@assets/images/Home/DiscoverGenerate.png";
import PropertyManagement from "@assets/images/Home/PropertyManagement.png";

const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+1,300", label: "Huéspedes felices" },
  { value: "+3", label: "Años de experiencia" },
  { value: "+1200", label: "Estancias realizadas" },
  { value: "4.92★", label: "Valoración promedio" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-6">
      <Hero />
      <FeaturedProperties />
      <ValueProposition />
      <KeyMetrics metrics={METRICS} bgColor="bg-gold-light" />

      <InfoSection
        title="Property Management pensado para propietarios"
        description="En Kanaa administramos tu propiedad de manera profesional, cuidando 
        cada espacio, optimizando la ocupación y ofreciendo una experiencia 
        excepcional a los huéspedes, mientras tú disfrutas de total tranquilidad."
        image={PropertyManagement}
        imageAlt="Property Management"
        imagePosition="right"
        backgroundColor="bg-green-dark-hover py-7 sm:pb-7 pb-2"
        descriptionClassName="text-white mt-8 mr-4 max-w-[600px]"
        textClassName="md:mt-20 ml-2 text-white  "
        buttonProps={{
          children: "Conocer más",
          className: " justify-center md:w-auto md:px-6 md:py-2",
          textWeight: "bold",
          circleButtonClassName: "bg-gold-light-active!",
          href: "/gestion-propiedades",
        }}
      />

      <InfoSection
        title="Descubre cuánto puede generar tu propiedad"
        description="Calcula el potencial de ingresos de tu inmueble en minutos y recibe una
        estimación anual personalizada, clara y transparente."
        image={DiscoverGenerate}
        imageAlt="DiscoverGenerate"
        imagePosition="left"
        backgroundColor="bg-white"
        textClassName="md:mt-20 mx-2 text-green-normal "
        descriptionClassName="text-green-normal mt-8 max-w-[600px]"
        buttonProps={{
          children: "Ir a la calculadora",
          className:
            " justify-center md:w-auto md:px-6 md:py-2 text-gold-dark!",
          textWeight: "bold",
          href: "/calculadora",
        }}
      />

      <BackedExperience />
      <GuideAndTips />
      <FrequentlyQuestions data={DataHome} />
    </main>
  );
}
