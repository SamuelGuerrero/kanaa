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
    <footer className="bg-green-dark-active mt-1.5 md:mt-6 w-full px-8 py-5 md:py-16">
      <div className="flex flex-col md:flex-row md:item-center gap-12 w-full">
        <div className="flex justify-center md:justify-start">
          <KanaaLogo />
        </div>

        <div className="text-green-light-active grid grid-cols-2 gap-10 md:flex md:flex-row md:gap-14 md:mx-10 flex-1 ">
          {FOOTER_SECTIONS.map((section) => (
            <FooterColumn
              key={section.title}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        <div className="">
          <Button
            variant="primary"
            textWeight="bold"
            className="text-gold-dark font-bold w-full md:w-fit flex justify-center items-center"
            href="/contactanos"
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Contáctanos
          </Button>
        </div>
      </div>

      <div className="mt-10 md:mt-20 flex flex-col items-center gap-6 md:flex-row md:justify-between md:items-center">
        <CopyrightText className="order-1 md:order-2 text-center md:text-right" />
        <SocialMediaGroup
          className="order-2 md:order-1 flex justify-center"
          links={SOCIAL_LINKS}
        />

      </div>
    </footer>
  );
};
