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
    <footer className="bg-green-dark-active mt-6 flex w-full justify-center px-8 py-16">
      <div className="flex w-full flex-col items-start justify-between gap-10 sm:max-w-368 sm:flex-row">
        <div className="flex flex-col">
          <KanaaLogo />
          <SocialMediaGroup
            className="mt-12 hidden sm:flex"
            links={SOCIAL_LINKS}
          />
        </div>

        <div className="text-green-light-active grid flex-1 gap-14 sm:grid-cols-4 sm:gap-10">
          {FOOTER_SECTIONS.map((section) => (
            <FooterColumn
              key={section.title}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        <div className="flex w-full flex-col sm:w-fit sm:items-end">
          <Button
            variant="primary"
            textWeight="bold"
            className="text-gold-dark w-fit font-bold"
            href="/contactanos"
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Contáctanos
          </Button>

          <div className="my-10 block h-px w-full bg-gray-100 sm:hidden" />

          <SocialMediaGroup
            className="mx-auto flex sm:mt-50 sm:hidden"
            links={SOCIAL_LINKS}
          />
          <CopyrightText className="mt-5 text-center sm:mt-50" />
        </div>
      </div>
    </footer>
  );
};
