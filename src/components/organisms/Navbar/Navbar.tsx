"use client";

import {
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { CircleButton, KanaaLogo } from "@/components/atoms";
import { Button, NavItem } from "@/components/molecules";

export const Navbar = () => {
  const pathname = usePathname();
  const isPropertiesPage = pathname.startsWith("/propiedades");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/gestion-propiedades", label: "Gestión de propiedades" },
    { href: "/calculadora", label: "Calculadora de ingresos" },
  ];

  return (
    <>
      <nav
        className={`bordershadow-lg fixed left-1/2 z-50 flex w-full -translate-x-1/2 items-center justify-between px-5 py-4 transition-colors duration-300 sm:top-8.5 sm:w-[96%] sm:rounded-xl md:px-12 md:py-5 md:[background-blend-mode:overlay,normal] md:[backdrop-filter:blur(22.39px)] md:[-webkit-backdrop-filter:blur(22.39px)] md:[background:radial-gradient(90.16%_143.01%_at_15.32%_21.04%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.045)_77.08%,rgba(255,255,255,0)_100%)] ${
          isScrolled ? "bg-white md:bg-transparent" : ""
        }`}
      >
        <KanaaLogo />

        <div className="hidden items-center gap-7.5 md:flex">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              active={
                pathname === item.href ||
                (item.href === "/propiedades" && isPropertiesPage)
              }
              className={isPropertiesPage ? "text-green-normal!" : ""}
            >
              {item.label}
            </NavItem>
          ))}

          <Button
            variant="primary"
            icon={
              <CircleButton>
                <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
              </CircleButton>
            }
          >
            Reserva ahora
          </Button>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
          className={`md:hidden ${isMobileMenuOpen ? "hidden" : ""}`}
        >
          <Bars3Icon
            className={`h-8 w-8 transition-colors duration-300 ${isScrolled ? "text-black" : "text-white"}`}
          />
        </button>
      </nav>

      <nav
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 z-40 bg-white px-6 pt-8 transition-opacity duration-200 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-end">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <XMarkIcon className="h-8 w-8 text-black" />
          </button>
        </div>

        <div className="mt-20 flex flex-col gap-6">
          {navItems.map((item) => (
            <div key={item.href} onClick={() => setIsMobileMenuOpen(false)}>
              <NavItem
                href={item.href}
                active={
                  pathname === item.href ||
                  (item.href === "/propiedades" && isPropertiesPage)
                }
                className={`text-2xl text-black ${
                  isPropertiesPage ? "text-green-normal!" : ""
                }`}
              >
                {item.label}
              </NavItem>
            </div>
          ))}

          <div onClick={() => setIsMobileMenuOpen(false)}>
            <Button
              variant="primary"
              className="mt-2 w-full justify-center"
              icon={
                <CircleButton>
                  <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
              }
            >
              Reserva ahora
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};
