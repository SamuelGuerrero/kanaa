import { IconApplied, Text } from "@/components/atoms";
import { AppliedExperience, type Experience } from "@/components/molecules";

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Selección estratégica",
    description:
      "Identificamos ubicaciones con alto <br/> potencial de rentabilidad y <br/> demanda turística sostenible.",
    Icon: IconApplied,
  },
  {
    id: 2,
    title: "Desarrollo inteligente",
    description:
      "Optimizamos propiedades <br/> funcionales y atractivas para el <br/> mercado vacacional.",
    Icon: IconApplied,
  },
  {
    id: 3,
    title: "Gestión eficiente",
    description:
      "Administramos con foco en <br/> ingresos, ocupación y experiencia <br/> del huésped.",
    Icon: IconApplied,
  },
  {
    id: 4,
    title: "Oportunidades claras",
    description:
      "Trabajamos con esquemas <br/> transparentes y decisiones <br/> basadas en datos.",
    Icon: IconApplied,
  },
];

export const ExperienceInAction = () => {
  return (
    <section className="flex flex-col items-center bg-white px-4 py-8 md:py-16">
      <Text size="5xl" className="text-green-normal" weight="medium">
        Nuestra experiencia en acción
      </Text>
      <Text
        font="gilroy"
        size="lg"
        className="text-grey-darker mt-6 mb-8"
        weight="medium"
      >
        Acompañamos cada proyecto desde su origen hasta su operación, cuidando
        cada etapa del proceso para maximizar su valor
      </Text>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {experiences.map((exp) => (
          <AppliedExperience key={exp.id} experience={exp} />
        ))}
      </div>
    </section>
  );
};
