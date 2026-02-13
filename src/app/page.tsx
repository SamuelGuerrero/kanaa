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
        title="Property Management <br /> pensado para propietarios"
        description="En KANNA administramos tu propiedad de manera profesional, cuidando <br /> 
        cada espacio, optimizando la ocupación y ofreciendo una experiencia <br /> 
        excepcional a los huéspedes, mientras tú disfrutas de total tranquilidad."
        image={PropertyManagement}
        imageAlt="Property Management"
        imagePosition="right"
        backgroundColor="bg-green-dark-hover"
        descriptionClassName="text-white mt-8"
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
        description="Calcula el potencial de ingresos de tu inmueble en minutos y recibe una <br /> 
        estimación anual personalizada, clara y transparente."
        image={DiscoverGenerate}
        imageAlt="DiscoverGenerate"
        imagePosition="left"
        backgroundColor="bg-white"
        textClassName="md:mt-20 mx-2 text-green-normal "
        descriptionClassName="text-green-normal mt-8"
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
