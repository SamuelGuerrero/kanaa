import {
  Management,
  Optimization,
  ProiconsDocument,
  PropertyCare,
  Reservations,
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
import rentalManagement1 from "@assets/images/Home/rentalManagement1.png";
import rentalManagement2 from "@assets/images/Home/rentalManagement2.png";
import ReservationManagement from "@assets/images/Home/ReservationManagement.png";

const METRICS: KeyMetricsProps["metrics"] = [
  { value: "+100", label: "Propiedades gestionadas" },
  { value: "+2", label: "Años de experiencia" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-6">
      <EarningsCalculator />
      <InfoSection
        title="¿Por qué elegir KANNA para <br/> gestionar tu propiedad?"
        description="Porque cuidamos tu propiedad, optimizamos tus ingresos y nos <br/> encargamos de todo para que tú disfrutes tranquilidad y resultados."
        image={ChooseKANNA}
        imageAlt="Calculadora de ingresos"
        imagePosition="left"
        backgroundColor="bg-white"
        textClassName="mt-20 ml-4 text-green-normal"
        descriptionClassName="text-green-normal"
        features={[
          {
            titulo: "Reservas y canales",
            text: "Más visibilidad, mayor ocupación.",
            icon: <Reservations />,
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
        title="Optimización de ingresos "
        description="Asegúrese de obtener la mayor rentabilidad posible. Utilizamos <br/>
                estrategias integrales y tecnología de vanguardia para  <br/> optimizar el potencial de ingresos de su propiedad"
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
        imagePosition="right"
        backgroundColor="bg-grey-light pb-20 bg-gold-normal"
        descriptionClassName="text-grey-darker"
        textClassName="mt-20 ml-4 text-green-normal"
        features={[
          { text: "Análisis de datos", icon: <Vector /> },
          {
            text: "Herramientas de fijación de precios robustas",
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
        description="Gestionamos sin problemas todas sus reservas, anunciando su propiedad en <br/> más de 15 sitios de reservas en línea, a la vez que garantizamos una <br/> experiencia sin complicaciones tanto para usted como para sus huéspedes."
        image={ReservationManagement}
        imageAlt="Property Management2"
        imagePosition="left"
        backgroundColor="bg-green-dark-hover"
        descriptionClassName="text-grey-light"
        textClassName="mt-20 ml-2 text-grey-light"
        features={[
          { text: "Gestión de listados", icon: <Vector /> },
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
      <KeyMetrics metrics={METRICS} bgColor="bg-grey-light" />
      <BackedExperience />
      <FrequentlyQuestions data={DataCalculator} />
      <RealPropertyPotential
        title="Conoce el potencial real <br/> de tu propiedad"
        description="Ingresa algunos datos clave y obtén una estimación de ingresos anual <br/> basada en el tipo de inmueble, su capacidad y su ubicación."
      />
    </main>
  );
}
