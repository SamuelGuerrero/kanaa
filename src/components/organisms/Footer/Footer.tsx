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
    <footer className="bg-green-dark-active mt-6 flex w-full flex-row items-start justify-center gap-30 pt-15 pb-15 pl-30">
      <div>
        <KanaaLogo />
        <SocialMediaGroup className="mt-50" links={SOCIAL_LINKS} />
      </div>

      <div className="text-green-light-active grid grid-cols-4 gap-20">
        {FOOTER_SECTIONS.map((section) => (
          <FooterColumn
            key={section.title}
            title={section.title}
            links={section.links}
          />
        ))}
      </div>

      <div className="ml-20">
        <Button
          variant="primary"
          textWeight="bold"
          className="text-gold-normal-hover! font-bold"
          icon={
            <CircleButton>
              <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
            </CircleButton>
          }
        >
          Contáctanos
        </Button>

        <CopyrightText />
      </div>
    </footer>
  );
};
