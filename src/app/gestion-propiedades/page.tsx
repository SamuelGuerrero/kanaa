import {
  Group,
  ProiconsDocument,
  SupportIcon,
  Vector,
} from "@/components/atoms";
import {
  BackedExperience,
  BecomeHost,
  FrequentlyQuestions,
  InfoSection,
  IntelligentManagement,
  KeyMetrics,
  type KeyMetricsProps,
} from "@/components/templates";
import PeaceAndResults from "@assets/images/Home/PeaceAndResults.png";
import rentalManagement1 from "@assets/images/Home/rentalManagement1.png";
import rentalManagement2 from "@assets/images/Home/rentalManagement2.png";
import RentProperty from "@assets/images/Home/RentProperty.png";

const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+100", label: "Propiedades gestionadas" },
  { value: "+2", label: "Años de experiencia" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-6">
      <BecomeHost />
      <IntelligentManagement />
      <InfoSection
        title="Pensado para quienes <br/> buscan tranquilidad <br/> y resultados"
        description="Ideal para propietarios que buscan maximizar ingresos sin <br/> encargarse de la gestión diaria de su propiedad."
        image={PeaceAndResults}
        imageAlt="Property Management2"
        imagePosition="right"
        backgroundColor="bg-green-dark-hover"
        descriptionClassName="text-grey-light"
        textClassName="mt-20 ml-2 text-grey-light"
        buttonProps={{
          children: "Conocer más",
          className: "mt-10",
          textWeight: "bold",
          circleButtonClassName: "bg-grey-light!",
        }}
      />

      <InfoSection
        title="Gestión de alquileres <br/> vacacionales simplificada "
        description="agiliza la gestión del alquiler vacacional para su tranquilidad  <br />  y una mayor rentabilidad."
        imagesConfig={[
          {
            src: rentalManagement1,
            alt: "Top",
            className:
              "absolute inset-0 top-[186px] left-[0px] object-contain z-20",
          },
          {
            src: rentalManagement2,
            alt: "Base",
            className: "absolute top-[26px] left-[244.2px] z-10",
          },
        ]}
        imagePosition="left"
        backgroundColor="bg-grey-light pb-20 bg-gold-normal"
        descriptionClassName="text-grey-darker"
        textClassName="mt-20 ml-4 text-green-normal"
        features={[
          { text: "Soporte digital y presencial", icon: <Vector /> },
          { text: "Seguro de alquiler integral", icon: <SupportIcon /> },
          { text: "Servicios de limpieza profesional", icon: <Group /> },
          {
            text: "Controles de mantenimiento periódicos",
            icon: <ProiconsDocument />,
          },
        ]}
        featuresTextClassName="text-grey-darker"
        featuresIcon="bg-green-normal h-12.5 w-12.5"

      />

      <KeyMetrics metrics={METRICS} bgColor="bg-grey-light" />

      <BackedExperience />
      <FrequentlyQuestions />

      <InfoSection
        title="Convierte tu propiedad  <br/> en un activo rentable"
        description="Nos encargamos de la gestión completa de tu inmueble para que tú  <br/> obtengas ingresos constantes sin preocuparte por la operación diaria."
        image={RentProperty}
        imageAlt="RentProperty"
        imagePosition="left"
        backgroundColor="bg-green-dark-hover"
        descriptionClassName="text-grey-light"
        textClassName="mt-20 ml-2 text-grey-light"
        buttonProps={{
          children: "Habla con un asesor",
          className: "mt-10",
          textWeight: "bold",
          circleButtonClassName: "bg-grey-light!",
        }}
      />
    </main>
  );
}
