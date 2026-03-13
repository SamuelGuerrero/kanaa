import { IconApplied, Text } from "@/components/atoms";
import { AppliedExperience, type Experience } from "@/components/molecules";

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Selección estratégica",
    description:
      "Identificamos ubicaciones con alto  potencial de rentabilidad y  demanda turística sostenible.",
    Icon: IconApplied,
  },
  {
    id: 2,
    title: "Desarrollo inteligente",
    description:
      "Optimizamos propiedades  funcionales y atractivas para el  mercado vacacional.",
    Icon: IconApplied,
  },
  {
    id: 3,
    title: "Gestión eficiente",
    description:
      "Administramos con foco en  ingresos, ocupación y experiencia  del huésped.",
    Icon: IconApplied,
  },
  {
    id: 4,
    title: "Oportunidades claras",
    description:
      "Trabajamos con esquemas  transparentes y decisiones  basadas en datos.",
    Icon: IconApplied,
  },
];

type Step = { title?: string; description?: string };

type Props = {
  title?: string;
  subtitle?: string;
  steps?: Step[];
};

export const ExperienceInAction = ({
  title = "Nuestra experiencia en acción",
  subtitle = "Acompañamos cada proyecto desde su origen hasta su operación, cuidando cada etapa del proceso para maximizar su valor",
  steps,
}: Props) => {
  const displayExperiences: Experience[] = steps?.length
    ? steps.map((s, i) => ({ id: i + 1, title: s.title ?? "", description: s.description ?? "", Icon: IconApplied }))
    : experiences;

  return (
    <section className="flex flex-col items-center bg-white px-4 py-8 md:py-16">
      <Text size="5xl" className="text-green-normal">
        {title}
      </Text>
      <Text
        font="gilroy"
        size="lg"
        className="text-grey-darker mt-6 mb-8"
        weight="medium"
      >
        {subtitle}
      </Text>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {displayExperiences.map((exp) => (
          <AppliedExperience key={exp.id} experience={exp} />
        ))}
      </div>
    </section>
  );
};
