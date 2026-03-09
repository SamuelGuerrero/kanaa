import {
  ExperienceInAction,
  HeroNosotros,
  InfoSection,
} from "@/components/templates";
import { createPageMetadata } from "@/lib/seo";
import JoinOurTeam from "@assets/images/Home/JoinOurTeam.png";
import WhoAreWe from "@assets/images/Home/WhoAreWe.png";
import WhoAreWeBase from "@assets/images/Home/WhoAreWeBase.png";
import WhoAreWeTop from "@assets/images/Home/WhoAreWeTop.png";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Nosotros",
  description:
    "Conoce a Kanaa: equipo, enfoque operativo y visión para transformar propiedades en activos rentables y bien administrados.",
  path: "/nosotros",
});

type NosotrosPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: NosotrosPageProps) {
  const { locale } = await params;

  return (
    <main className="flex flex-col space-y-1.5 md:space-y-6">
      <HeroNosotros />
      <InfoSection
        title="¿Quiénes somos?"
        description="Somos una empresa especializada en gestión integral de alquileres
                vacacionales, creada para simplificar la vida de los propietarios y elevar
                la experiencia de los huéspedes.
                <br />
                <br />
                En Kanaa combinamos estrategia inmobiliaria, tecnología y operación
                profesional para transformar propiedades en activos rentables, bien
                administrados y sin complicaciones. Nos enfocamos en cada detalle
                para que tú solo disfrutes los resultados."
        imagesConfig={[
          {
            src: WhoAreWeTop,
            alt: "WhoAreWeTop",
            className: "absolute top-[29%] left-0 w-[70%] object-contain z-20",
          },
          {
            src: WhoAreWeBase,
            alt: "WhoAreWeBase",
            className: "absolute top-[0%] left-[37%] w-[75%] z-10",
          },
        ]}
        imagePosition="right"
        className="bg-grey-light pt-10 pb-20 sm:pt-0"
        descriptionClassName="text-grey-darker w-[340px] md:w-[600px]"
        textClassName="mt-0 md:mt-20 ml-4 text-green-normal"
        buttonProps={{
          children: "Conoce nuestros proyectos",
          className: "text-gold-dark!",
          textWeight: "bold",
          circleButtonClassName: "bg-grey-light!",
          href: `/${locale}/properties`,
        }}
      />
      <InfoSection
        title="¿Por qué estamos aquí?"
        description="Creemos que una segunda residencia no debería convertirse en una carga
                 operativa, sino en una fuente de tranquilidad, ingresos constantes y crecimiento a
                  largo plazo.
                  <br />
                  <br />
                Por eso estamos redefiniendo la forma en que funcionan los alquileres vacacionales:
                con procesos claros, tecnología inteligente y un enfoque centrado en la experiencia
                del huésped y del propietario. "
        image={WhoAreWe}
        imageAlt="WhoAreWe"
        imagePosition="left"
        className="bg-green-dark-hover py-8"
        descriptionClassName="text-grey-light"
        textClassName="mt-3 md:mt-10 md:mt-20 ml-2 text-grey-light"
        buttonProps={{
          children: "Contáctanos",
          className: "text-gold-dark!",
          textWeight: "bold",
          circleButtonClassName: "bg-grey-light!",
          href: `/${locale}/contact`,
        }}
      />
      <ExperienceInAction />
      <InfoSection
        title="Únete a nuestro equipo"
        description="En Kanaa buscamos personas que compartan nuestra visión:
                trabajar con compromiso, claridad y enfoque a largo plazo.
                <br />
                <br />
                Si te interesa formar parte de un equipo que construye proyectos con
                propósito, toma decisiones basadas en datos y apuesta por la excelencia
                operativa, nos encantará conocerte."
        image={JoinOurTeam}
        imageAlt="JoinOurTeam"
        imagePosition="left"
        className="bg-gold-light-hover py-8 sm:py-0"
        descriptionClassName="text-grey-darker max-w-[630px]"
        textClassName=" md:mt-20 ml-2 text-green-normal"
        buttonProps={{
          children: "Conoce nuestras vacantes",
          className: " bg-grey-light text-gold-normal!",
          textWeight: "bold",
          circleButtonClassName: "bg-gold-light-active!",
          href: `/${locale}/join`,
        }}
      />
    </main>
  );
}
