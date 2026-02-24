import {
  IconApplied,
  Management,
  Optimization,
  ProiconsDocument,
  PropertyCare,
  ReservationsManagementIcon,
  SupportIcon,
  Vector,
} from "@/components/atoms";
import {
  BackedExperience,
  EarningsCalculator,
  FrequentlyQuestions,
  InfoSection,
  KeyMetrics,
  RealPropertyPotential,
  type KeyMetricsProps,
} from "@/components/templates";
import { DataCalculator } from "@/data/faqData";
import ChooseKANNA from "@assets/images/Home/ChooseKANNA.png";
import ReservationManagement from "@assets/images/Home/ReservationManagement.png";
import RevenueOptimization from "@assets/images/Home/RevenueOptimization.png";
import RevenueOptimizationBase from "@assets/images/Home/RevenueOptimizationBase.png";
const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+100", label: "Propiedades gestionadas" },
  { value: "+2", label: "Años de experiencia" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <EarningsCalculator />
      <InfoSection
        title="¿Por qué elegir Kanaa para gestionar tu propiedad?"
        description="Porque cuidamos tu propiedad, optimizamos tus ingresos y nos encargamos de todo para que tú disfrutes tranquilidad y resultados."
        image={ChooseKANNA}
        imageAlt="Calculadora de ingresos"
        imagePosition="left"
        block="hidden md:block"
        backgroundColor="bg-white"
        textClassName="ml-2 mt-4 text-green-normal"
        descriptionClassName="text-green-normal max-w-[600px]"
        features={[
          {
            titulo: "Reservas y canales",
            text: "Más visibilidad, mayor ocupación.",
            icon: <IconApplied />,
          },
          {
            titulo: "Cuidado de la propiedad",
            text: "Tu inmueble siempre en óptimas condiciones.",
            icon: <PropertyCare />,
          },
          {
            titulo: "Gestión integral",
            text: "Nos encargamos de todo.",
            icon: <Management />,
          },
          {
            titulo: "Optimización de ingresos",
            text: "Precios inteligentes, mejores resultados.",
            icon: <Optimization />,
          },
        ]}
        featuresTextClassName="text-green-normal"
        featuresIcon="bg-grey-light h-20 w-20"
        featureClassName="bg-gold-light px-5 py-3"
      />
      <InfoSection
        title="Optimización de ingresos"
        description="Asegúrate de obtener la mayor rentabilidad posible. Utilizamos 
                estrategias integrales y modelos de inteligencia artificial para optimizar el potencial de ingresos de tu propiedad."
        imagesConfig={[
          {
            src: RevenueOptimization,
            alt: "Top",
            className: "absolute top-[29%] left-0 w-[70%] object-contain z-20",
          },
          {
            src: RevenueOptimizationBase,
            alt: "Base",
            className: "absolute top-[0%] left-[37%] w-[75%] z-10",
          },
        ]}
        imagePosition="right"
        backgroundColor="bg-grey-light pb-20 bg-gold-normal"
        descriptionClassName="text-grey-darker w-[346px] md:w-[525px]"
        textClassName="ml-2 text-green-normal mt-4 sm:mt-15"
        features={[
          { text: "Análisis de datos", icon: <Vector /> },
          {
            text: "Estrategia de precios dinámicos",
            icon: <SupportIcon />,
          },
          {
            text: "Predicciones de tendencias",
            icon: <ReservationsManagementIcon />,
          },
          { text: "Informes transparentes", icon: <ProiconsDocument /> },
        ]}
        featuresTextClassName="text-grey-darker"
        featuresIcon="bg-green-normal h-12.5 w-12.5"
      />
      <InfoSection
        title="Gestión de reservas"
        description="Nos encargamos de administrar todas tus reservas y publicar 
        tu propiedad en las principales plataformas de renta vacacional para 
        maximizar su visibilidad y ocupación.
        <br />
        <br />
        Además, damos seguimiento continuo a cada huésped, asegurando una comunicación
         clara, ágil y sin fricciones en todo momento."
        image={ReservationManagement}
        imageAlt="Property Management2"
        imagePosition="left"
        backgroundColor="bg-green-dark-hover py-8"
        descriptionClassName="text-grey-light max-w-[630px]"
        textClassName="ml-2 text-grey-light sm:mt-12 mt-4"
        features={[
          { text: "Administración de listados", icon: <Vector /> },
          { text: "Marketing y publicidad", icon: <SupportIcon /> },
          { text: "Gestión de reservas", icon: <ReservationsManagementIcon /> },
          {
            text: "Asistencia en línea para huéspedes",
            icon: <ProiconsDocument />,
          },
        ]}
        featuresTextClassName="text-grey-light"
        featuresIcon="bg-green-normal h-12.5 w-12.5"
      />
      <KeyMetrics
        className="justify-center! space-x-5"
        metrics={METRICS}
        bgColor="bg-grey-light"
      />
      <BackedExperience />
      <FrequentlyQuestions data={DataCalculator} />
      <RealPropertyPotential
        title="Conoce el potencial real de tu propiedad"
        description="Ingresa algunos datos clave y obtén una estimación de ingresos anual basada en el tipo de inmueble, su capacidad y su ubicación."
      />
    </main>
  );
}
