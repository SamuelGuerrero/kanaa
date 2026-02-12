import {
  ExperienceInAction,
  HeroNosotros,
  InfoSection,
} from "@/components/templates";
import JoinOurTeam from "@assets/images/Home/JoinOurTeam.png";
import WhoAreWe from "@assets/images/Home/WhoAreWe.png";
import WhoAreWeBase from "@assets/images/Home/WhoAreWeBase.png";
import WhoAreWeTop from "@assets/images/Home/WhoAreWeTop.png";

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-6">
      <HeroNosotros />
      <InfoSection
        title="¿Quiénes somos?"
        description="Somos una empresa especializada en gestión integral de alquileres <br/>
                vacacionales, creada para simplificar la vida de los propietarios y elevar <br/> 
                la experiencia de los huéspedes.
                <br>
                <br>
                En KANAA combinamos estrategia inmobiliaria, tecnología y operación <br> 
                profesional para transformar propiedades en activos rentables, bien <br> 
                administrados y sin complicaciones. Nos enfocamos en cada detalle <br> 
                para que tú solo disfrutes los resultados."
        imagesConfig={[
          {
            src: WhoAreWeTop,
            alt: "WhoAreWeTop",
            className:
              "absolute inset-0 top-[186px] left-[0px] object-contain z-20",
          },
          {
            src: WhoAreWeBase,
            alt: "WhoAreWeBase",
            className: "absolute top-[26px] left-[244.2px] z-10",
          },
        ]}
        imagePosition="right"
        backgroundColor="bg-grey-light pb-20 bg-gold-normal"
        descriptionClassName="text-grey-darker"
        textClassName="mt-20 ml-4 text-green-normal"
        buttonProps={{
          children: "Conoce nuestros proyectos",
          className: "mt-10",
          textWeight: "bold",
          circleButtonClassName: "bg-grey-light!",
          href: "/propiedades",
        }}
      />
      <InfoSection
        title="¿Por qué estamos aquí?"
        description="Creemos que una segunda residencia no debería convertirse en una carga <br/>
                 operativa, sino en una fuente de tranquilidad, ingresos constantes y crecimiento a <br/>
                  largo plazo.
                  <br>
                  <br>
                Por eso estamos redefiniendo la forma en que funcionan los alquileres vacacionales: <br>
                con procesos claros, tecnología inteligente y un enfoque centrado en la experiencia <br> 
                del huésped y del propietario. "
        image={WhoAreWe}
        imageAlt="WhoAreWe"
        imagePosition="left"
        backgroundColor="bg-green-dark-hover"
        descriptionClassName="text-grey-light"
        textClassName="mt-20 ml-2 text-grey-light"
        buttonProps={{
          children: "Contáctanos",
          className: "mt-10",
          textWeight: "bold",
          circleButtonClassName: "bg-grey-light!",
          href: "/contactanos",
        }}
      />
      <ExperienceInAction />
      <InfoSection
        title="Únete a nuestro equipo"
        description="En KANAA buscamos personas que compartan nuestra visión: <br>
                trabajar con compromiso, claridad y enfoque a largo plazo.
                <br>
                <br>
                Si te interesa formar parte de un equipo que construye proyectos con <br>
                propósito, toma decisiones basadas en datos y apuesta por la excelencia <br>
                operativa, nos encantará conocerte."
        image={JoinOurTeam}
        imageAlt="JoinOurTeam"
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
