import {
  FeaturedProperties,
  Hero,
  KeyMetrics,
  ValueProposition,
  InfoSection,
  BackedExperience,
  type KeyMetricsProps,
} from "@/components/templates";
import DiscoverGenerate from "@assets/images/Home/DiscoverGenerate.png";
import PropertyManagement from "@assets/images/Home/PropertyManagement.png";

const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+120", label: "Huéspedes felices" },
  { value: "+8", label: "Años de experiencia" },
  { value: "+300", label: "estancias realizadas" },
  { value: "4.8★", label: "Valoración promedio" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-6">
      <Hero />
      <FeaturedProperties />
      <ValueProposition />
      <KeyMetrics metrics={METRICS} />

      <InfoSection
        title="Property Management <br /> pensado para propietarios"
        description="En KANNA administramos tu propiedad de manera profesional, cuidando <br /> 
        cada espacio, optimizando la ocupación y ofreciendo una experiencia <br /> 
        excepcional a los huéspedes, mientras tú disfrutas de total tranquilidad."
        image={PropertyManagement}
        imageAlt="Property Management"
        imagePosition="right"
        backgroundColor="bg-green-dark-hover"
        textClassName="mt-20 ml-2 text-white"
        buttonProps={{
          children: "Conocer más",
          className: "mt-6",
          textWeight: "bold",
          circleButtonClassName: "bg-gold-light-active!",
        }}
      />

      <InfoSection
        title="Descubre cuánto puede <br /> generar tu propiedad"
        description="Calcula el potencial de ingresos de tu inmueble en minutos y recibe una <br /> 
        estimación anual personalizada, clara y transparente."
        image={DiscoverGenerate}
        imageAlt="Calculadora de ingresos"
        imagePosition="left"
        backgroundColor="bg-white"
        textClassName="mt-20 ml-4 text-green-normal"
        buttonProps={{
          children: "Ir a la calculadora",
          className: "mt-6",
          textWeight: "bold",
        }}
      />

      <BackedExperience />
    </main>
  );
}
