import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton, CopyrightText, KanaaLogo } from "@/components/atoms";
import {
  Button,
  FooterColumn,
  SocialMediaGroup,
  type FooterLink,
  type SocialLink,
} from "@/components/molecules";

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "#",
    icon: "fa-square-facebook",
    ariaLabel: "Facebook",
    hoverColor: "blue-500",
  },
  {
    href: "#",
    icon: "fa-instagram",
    ariaLabel: "Instagram",
    hoverColor: "pink-500",
  },
];

const FOOTER_SECTIONS: { title: string; links: FooterLink[] }[] = [
  {
    title: "KANNA",
    links: [
      { href: "", label: "Sobre nosotros" },
      { href: "", label: "Nuestro equipo" },
      { href: "", label: "Experiencia & Historia" },
    ],
  },
  {
    title: "Propiedades",
    links: [
      { href: "", label: "Listado de propiedades" },
      { href: "", label: "Destacadas" },
      { href: "", label: "Guías y tips de viaje" },
    ],
  },
  {
    title: "Property Management",
    links: [
      { href: "", label: "Únete como propietario" },
      { href: "", label: "Property Management" },
      { href: "", label: "Calculadora de ingresos" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "", label: "Política de privacidad" },
      { href: "", label: "Términos y condiciones" },
      { href: "", label: "Política de cookies" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-green-dark-active mt-1.5 w-full px-8 py-5 md:mt-6 md:py-16">
      <div className="md:item-center flex w-full flex-col gap-12 md:flex-row">
        <div className="flex justify-center md:justify-start">
          <KanaaLogo />
        </div>

        <div className="text-green-light-active grid flex-1 grid-cols-2 gap-10 md:mx-10 md:flex md:flex-row md:gap-14">
          {FOOTER_SECTIONS.map((section) => (
            <FooterColumn
              key={section.title}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        <div className="flex flex-col space-y-6">
          <Button
            variant="primary"
            textWeight="bold"
            className="text-gold-dark! flex w-full items-center justify-center self-end font-bold md:w-fit"
            href="/contactanos"
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Contáctanos
          </Button>
          <Button
            variant="primary"
            textWeight="bold"
            className="text-gold-dark! flex w-full items-center justify-center font-bold md:w-fit"
            href="#"
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Seguimiento de reserva
          </Button>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-6 md:mt-20 md:flex-row md:items-center md:justify-between">
        <CopyrightText className="order-1 text-center md:order-2 md:text-right" />
        <SocialMediaGroup
          className="order-2 flex justify-center md:order-1"
          links={SOCIAL_LINKS}
        />
      </div>
    </footer>
  );
};
