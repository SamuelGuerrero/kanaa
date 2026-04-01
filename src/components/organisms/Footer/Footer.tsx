"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

import { CircleButton, CopyrightText, KanaaLogo } from "@/components/atoms";
import {
  Button,
  FooterColumn,
  SocialMediaGroup,
  type FooterLink,
  type SocialLink,
} from "@/components/molecules";
import { LanguageSwitcher } from "@/components/organisms";
import { useI18n } from "@/i18n";

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
    title: "Kanaa",
    links: [
      { href: "", label: "Sobre nosotros" },
      { href: "", label: "Nuestro equipo" },
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
    title: "Gestión de propiedades",
    links: [
      { href: "", label: "Únete como propietario" },
      { href: "", label: "Calculadora de ingresos" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Política de privacidad" },
      { href: "/terms-and-conditions", label: "Términos y condiciones" },
    ],
  },
];

export const Footer = () => {
  const { locale } = useI18n();

  return (
    <footer className="bg-green-dark-active mt-1.5 w-full px-8 py-5 md:mt-6 md:py-16">
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Logo */}
        <div className="flex justify-center lg:justify-start">
          <Link href={`/${locale}`} aria-label="Ir al inicio">
            <KanaaLogo />
          </Link>
        </div>

        {/* Nav columns: 2 cols en mobile, 4 en tablet (md), flex en lg+ */}
        <div className="text-green-light-active grid flex-1 grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-8 lg:mx-10 lg:flex lg:flex-row lg:gap-14">
          {FOOTER_SECTIONS.map((section) => (
            <FooterColumn
              key={section.title}
              title={section.title}
              links={section.links.map((link) => ({
                ...link,
                href: link.href ? `/${locale}${link.href}` : "",
              }))}
            />
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-row justify-center gap-4 md:flex-col md:justify-start md:space-y-0 lg:flex-col lg:space-y-6">
          <Button
            variant="primary"
            textWeight="bold"
            className="text-gold-dark! flex flex-1 items-center justify-center font-bold md:w-full md:flex-none lg:w-fit"
            href={`/${locale}/contact`}
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
            className="text-gold-dark! !hidden w-full items-center justify-center font-bold md:w-fit"
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

      {/* Bottom bar */}
      <div className="mt-10 flex flex-col items-center gap-6 md:mt-16 md:flex-row md:items-center md:justify-between">
        <div className="order-2 flex flex-col items-center gap-4 md:order-1 md:items-start">
          <SocialMediaGroup
            className="flex justify-center"
            links={SOCIAL_LINKS}
          />
          <LanguageSwitcher />
        </div>
        <CopyrightText className="order-1 text-center md:order-2 md:text-right" />
      </div>
    </footer>
  );
};
