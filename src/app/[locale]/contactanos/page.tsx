import { InfoSection, ProjectConversation } from "@/components/templates";
import { createPageMetadata } from "@/lib/seo";
import TeamRecruitment from "@assets/images/Home/TeamRecruitment.png";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Contáctanos",
  description:
    "Habla con Kanaa para evaluar tu propiedad y conocer nuestra propuesta de gestión vacacional personalizada.",
  path: "/contactanos",
});

type ContactanosPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: ContactanosPageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <ProjectConversation />
      <InfoSection
        title="Únete a nuestro equipo"
        description="En Kanaa buscamos personas que compartan nuestra visión: <br />
                trabajar con compromiso, claridad y enfoque a largo plazo.
                <br />
                <br />
                Si te interesa formar parte de un equipo que construye proyectos con
                propósito, toma decisiones basadas en datos y apuesta por la excelencia
                operativa, nos encantará conocerte."
        image={TeamRecruitment}
        imageAlt="TeamRecruitment"
        imagePosition="left"
        className="bg-gold-light-hover"
        descriptionClassName="text-grey-darker"
        textClassName="mt-20 ml-2 text-green-normal"
        buttonProps={{
          children: "Conoce nuestras vacantes",
          className: "mt-10 bg-grey-light text-gold-normal!",
          textWeight: "bold",
          circleButtonClassName: "bg-gold-light-active!",
          href: `/${locale}/unete`,
        }}
      />
    </main>
  );
}
