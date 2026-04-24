import { Text } from "@/components/atoms";
import { CardJob, type JobCardProps } from "@/components/molecules";

const FALLBACK_JOBS: JobCardProps[] = [
  {
    title: "Property Manager",
    description:
      "Responsable de supervisar las operaciones diarias de nuestras propiedades premium, garantizando una experiencia excepcional para los huéspedes.",
    type: "Tiempo Completo",
  },
  {
    title: "Guest Experience Manager",
    description:
      "Encargado de asegurar una atención impecable y una experiencia de primer nivel para cada huésped.",
    type: "Tiempo Completo",
  },
  {
    title: "Maintenance Supervisor",
    description:
      "Supervisa el mantenimiento y asegura que todas las propiedades estén en óptimas condiciones.",
    type: "Tiempo Completo",
  },
];

type JoinOurTeamProps = {
  jobs?: JobCardProps[];
};

export const JoinOurTeam = ({ jobs }: JoinOurTeamProps) => {
  const displayJobs = jobs && jobs.length > 0 ? jobs : FALLBACK_JOBS;

  return (
    <section className="flex flex-col bg-white px-2 py-5 md:py-16">
      <div className="md:mt-5 md:w-full md:text-center">
        <Text size="5xl" weight="medium" className="text-green-normal">
          Únete a nuestro equipo
        </Text>
        <Text className="text-grey-darker mt-5" size="lg" font="gilroy">
          En Kanaa buscamos personas que compartan nuestra visión:
        </Text>
      </div>
      <div className="max-w-8xl mx-auto space-y-3 px-1 pt-8">
        {displayJobs.map((job, index) => (
          <CardJob key={index} {...job} />
        ))}
      </div>
    </section>
  );
};
