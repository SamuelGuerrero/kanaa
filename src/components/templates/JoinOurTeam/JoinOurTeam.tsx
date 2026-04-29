import { Text } from "@/components/atoms";
import { CardJob, type JobCardProps } from "@/components/molecules";

type JoinOurTeamProps = {
  jobs?: JobCardProps[];
};

export const JoinOurTeam = ({ jobs }: JoinOurTeamProps) => {
  const displayJobs = jobs && jobs.length > 0 ? jobs : [];

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
        {displayJobs.length > 0 ? (
          displayJobs.map((job, index) => <CardJob key={index} {...job} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Text size="2xl" weight="medium" className="text-green-normal">
              Por el momento no hay vacantes disponibles
            </Text>
            <Text size="lg" font="gilroy" className="text-grey-darker mt-3">
              Te invitamos a volver pronto para conocer nuevas oportunidades.
            </Text>
          </div>
        )}
      </div>
    </section>
  );
};
