import { CleanIcon, Group, ProiconsDocument, Vector } from "@/components/atoms";
import {
  BackedExperience,
  BecomeHost,
  FrequentlyQuestions,
  InfoSection,
  IntelligentManagement,
  KeyMetrics,
  RealPropertyPotential,
  type KeyMetricsProps,
} from "@/components/templates";
import { DataPropertyManagment } from "@/data/faqData";
import { createPageMetadata } from "@/lib/seo";
import PeaceAndResults from "@assets/images/Home/PeaceAndResults.png";
import rentalManagement1 from "@assets/images/Home/rentalManagement1.png";
import rentalManagement2 from "@assets/images/Home/rentalManagement2.png";
import RentProperty from "@assets/images/Home/RentProperty.png";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Gestión de Propiedades",
  description:
    "Servicio integral de gestión de alquiler vacacional: operación diaria, limpieza, mantenimiento y optimización de ocupación.",
  path: "/gestion-propiedades",
});

const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+100", label: "Propiedades gestionadas" },
  { value: "+2", label: "Años de experiencia" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <BecomeHost />
      <InfoSection
        title="Pensado para quienes buscan tranquilidad y resultados"
        description="Ideal para propietarios que buscan maximizar ingresos sin encargarse de la gestión diaria de tu propiedad."
        image={PeaceAndResults}
        imageAlt="Property Management2"
        imagePosition="right"
        className="bg-green-dark-hover py-8"
        descriptionClassName="text-grey-light max-w-[550px]"
        textClassName="mt-5 md:mt-15 ml-2 text-grey-light max-w-[600px]"
        buttonProps={{
          children: "Conocer más",
          className: "mt-10 text-gold-dark!",
          textWeight: "bold",
          circleButtonClassName: "bg-grey-light! !inline-flex",
          href: "/contactanos",
        }}
      />
      <IntelligentManagement />
      <RealPropertyPotential
        title="Descubre el verdadero valor de tu alquiler vacacional."
        description="Completa el formulario a continuación para obtener una  estimación personalizada de tus ingresos anuales."
      />
      <InfoSection
        title="Gestión de alquileres vacacionales simplificada"
        description="Agiliza la gestión del alquiler vacacional para tu tranquilidad y mayor rentabilidad."
        imagesConfig={[
          {
            src: rentalManagement1,
            alt: "Top",
            className: "absolute top-[29%] left-0 w-[70%] object-contain z-20",
          },
          {
            src: rentalManagement2,
            alt: "Base",
            className: "absolute top-[0%] left-[37%] w-[75%] z-10",
          },
        ]}
        imagePosition="left"
        className="bg-white! pb-20"
        descriptionClassName="text-grey-darker"
        textClassName="ml-3 mt-10 text-green-normal"
        features={[
          { text: "Soporte digital y presencial", icon: <Vector /> },
          { text: "Servicios de limpieza profesional", icon: <CleanIcon /> },
          {
            text: "Controles de mantenimiento periódicos",
            icon: <ProiconsDocument />,
          },
          { text: "Servicios de concierge", icon: <Group /> },
        ]}
        featuresTextClassName="text-grey-darker"
        featuresIcon="bg-green-normal h-12.5 w-12.5"
      />

      <KeyMetrics
        className="justify-center! space-x-5"
        metrics={METRICS}
        bgColor="bg-grey-light"
      />

      <BackedExperience />
      <FrequentlyQuestions data={DataPropertyManagment} />

      <InfoSection
        title="Convierte tu propiedad  en un activo rentable"
        description="Nos encargamos de la gestión completa de tu inmueble para que tú obtengas ingresos constantes sin preocuparte por la operación diaria."
        image={RentProperty}
        imageAlt="RentProperty"
        imagePosition="left"
        className="bg-green-dark-hover"
        descriptionClassName="text-grey-light"
        textClassName="mt-15 mx-2 mr-6 text-grey-light"
        buttonProps={{
          children: "Contáctanos",
          className: "text-gold-dark!",
          textWeight: "bold",
          circleButtonClassName: "bg-grey-light!",
          href: "/contactanos",
        }}
      />
    </main>
  );
}
