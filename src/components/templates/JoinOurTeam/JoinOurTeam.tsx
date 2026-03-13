import { Text } from "@/components/atoms";
import { CardJob, type JobCardProps } from "@/components/molecules";

const Jobs: JobCardProps[] = [
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

type CmsJob = { title: string; job_type: string; description: string };

type Props = {
  title?: string;
  subtitle?: string;
  jobs?: CmsJob[];
};

export const JoinOurTeam = ({
  title = "Únete a nuestro equipo",
  subtitle = "En Kanaa buscamos personas que compartan nuestra visión:",
  jobs,
}: Props) => {
  const displayJobs: JobCardProps[] = jobs?.length
    ? jobs.map((j) => ({ title: j.title, type: j.job_type, description: j.description }))
    : Jobs;

  return (
    <section className="flex flex-col bg-white px-2 py-5 md:py-16">
      <div className="md:mt-5 md:w-full md:text-center">
        <Text size="5xl" weight="medium" className="text-green-normal">
          {title}
        </Text>
        <Text className="text-grey-darker mt-5" size="lg" font="gilroy">
          {subtitle}
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
