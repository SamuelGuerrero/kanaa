import {
  CleanIcon,
  NoteIcon,
  NoteTimeIcon,
  TrendingRoundIcon,
} from "@/components/atoms";
import {
  BackedExperience,
  BecomeHost,
  FrequentlyQuestions,
  InfoSection,
  KeyMetrics,
  RealPropertyPotential,
  type KeyMetricsProps,
} from "@/components/templates";
import { DataPropertyManagment } from "@/data/faqData";
import { createPageMetadata } from "@/lib/seo";
import rentalManagement1 from "@assets/images/Home/rentalManagement1.png";
import rentalManagement2 from "@assets/images/Home/rentalManagement2.png";
// import PeaceAndResults from "@assets/images/Home/PeaceAndResults.png";
import RentProperty from "@assets/images/Home/RentProperty.png";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Gestión de Propiedades",
  description:
    "Servicio integral de gestión de alquiler vacacional: operación diaria, limpieza, mantenimiento y optimización de ocupación.",
  path: "/property-management",
});

const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+100", label: "Propiedades gestionadas" },
  { value: "+2", label: "Años de experiencia" },
];

type GestionPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: GestionPageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <BecomeHost />
      {/* <InfoSection
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
          href: `/${locale}/contact`,
        }}
      /> */}
      <InfoSection
        title="Gestión de propiedades inteligente"
        description="Maximiza el potencial de sus inmuebles a través de un modelo de gestión profesional, transparente y respaldado por datos. <br /> <br />
Desde la estrategia de renta hasta la operación diaria, nos ocupamos de todo."
        imagePosition="left"
        className="pb-36 md:pb-10"
        descriptionClassName="text-grey-darker !max-w-[520px] mb-10"
        textClassName="mt-15 mx-2 mr-6 text-green-normal"
        featuresIcon="bg-green-normal w-[50px] h-[50px]"
        featuresTextClassName="text-grey-darker"
        features={[
          { text: "Administración de listados", icon: <TrendingRoundIcon /> },
          { text: "Gestión de reserva", icon: <NoteIcon /> },
          { text: "Limpieza y mantenimiento profesional", icon: <CleanIcon /> },
          {
            text: "Optimización de ingresos",
            icon: <NoteTimeIcon />,
          },
        ]}
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
      />
      <RealPropertyPotential
        title="Descubre el verdadero valor de tu alquiler vacacional."
        description="Completa el formulario a continuación para obtener una  estimación personalizada de tus ingresos anuales."
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
          href: `/${locale}/contact`,
        }}
      />
    </main>
  );
}
