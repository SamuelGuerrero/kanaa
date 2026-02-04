"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";

import { CircleButton, KanaaLogo } from "@/components/atoms";
import { Button, NavItem } from "@/components/molecules";

export const Navbar = () => {
  const pathname = usePathname();
  const isPropertiesPage = pathname.startsWith("/propiedades");

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/gestion-propiedades", label: "Gestión de propiedades" },
    { href: "/calculadora", label: "Calculadora de ingresos" },
  ];

  return (
    <nav
      style={{
        background:
          "radial-gradient(90.16% 143.01% at 15.32% 21.04%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.045) 77.08%, rgba(255, 255, 255, 0) 100%)",
        backgroundBlendMode: "overlay, normal",
        backdropFilter: "blur(22.39px)",
        WebkitBackdropFilter: "blur(22.39px)",
      }}
      className="bordershadow-lg fixed top-8.5 left-1/2 z-50 flex w-[96%] -translate-x-1/2 items-center justify-between rounded-xl bg-white/1 px-12 py-5 backdrop-blur-md"
    >
      <KanaaLogo />
      <div className="flex items-center gap-7.5">
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
    </nav>
  );
};
