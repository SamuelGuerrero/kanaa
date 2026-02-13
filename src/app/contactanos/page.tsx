import { InfoSection, ProjectConversation } from "@/components/templates";
import TeamRecruitment from "@assets/images/Home/TeamRecruitment.png";

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <ProjectConversation />
      <InfoSection
        title="Únete a nuestro equipo"
        description="En KANAA buscamos personas que compartan nuestra visión: <br>
                abajar con compromiso, claridad y enfoque a largo plazo.
                <br>
                <br>
                Si te interesa formar parte de un equipo que construye proyectos con <br>
                propósito, toma decisiones basadas en datos y apuesta por la excelencia <br>
                operativa, nos encantará conocerte."
        image={TeamRecruitment}
        imageAlt="TeamRecruitment"
        imagePosition="left"
        backgroundColor="bg-gold-light-hover"
        descriptionClassName="text-grey-darker"
        textClassName="mt-20 ml-2 text-green-normal"
        buttonProps={{
          children: "Conoce nuestras vacantes",
          className: "mt-10 bg-grey-light text-gold-normal!",
          textWeight: "bold",
          circleButtonClassName: "bg-gold-light-active!",
          href: "/vacantes",
        }}
      />
    </main>
  );
}
