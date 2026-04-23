"use client";

import {
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";

import { CircleButton, KanaaLogo, Text } from "@/components/atoms";
import { Button, NavItem } from "@/components/molecules";
import { useI18n } from "@/i18n";

type DropdownItem = { href: string; label: string; disabled?: boolean };

interface NavItemConfig {
  label: string;
  href?: string;
  items?: DropdownItem[];
}

export const Navbar = () => {
  const pathname = usePathname();
  const { locale, t } = useI18n();

  const isPropertiesPage =
    pathname.startsWith(`/${locale}/properties`) ||
    pathname.startsWith("/properties");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(
    null,
  );
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let rafId = 0;
    let retryTimer = 0;

    const parseRgba = (value: string) => {
      const match = /^rgba?\((\d+),(\d+),(\d+)(?:,([0-9.]+))?\)$/i.exec(
        value.replace(/\s+/g, ""),
      );
      if (!match) return null;
      return {
        r: Number(match[1]),
        g: Number(match[2]),
        b: Number(match[3]),
        a: match[4] === undefined ? 1 : Number(match[4]),
      };
    };

    const luminance = (r: number, g: number, b: number) =>
      (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const sampleImagePixel = (
      image: HTMLImageElement,
      x: number,
      y: number,
    ) => {
      if (
        !ctx ||
        !image.complete ||
        !image.naturalWidth ||
        !image.naturalHeight
      )
        return null;
      const rect = image.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom)
        return null;
      try {
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(image, 0, 0, size, size);
        const relX = (x - rect.left) / rect.width;
        const relY = (y - rect.top) / rect.height;
        const px = Math.max(0, Math.min(size - 1, Math.floor(relX * size)));
        const py = Math.max(0, Math.min(size - 1, Math.floor(relY * size)));
        const data = ctx.getImageData(px, py, 1, 1).data;
        if ((data[3] ?? 0) === 0) return null;
        return { r: data[0]!, g: data[1]!, b: data[2]!, a: data[3]! / 255 };
      } catch {
        return null;
      }
    };

    const getColorAtPoint = (x: number, y: number) => {
      const elements = document.elementsFromPoint(x, y);
      for (const element of elements) {
        if (navRef.current?.contains(element)) continue;

        const themed = element.closest("[data-navbar-theme]");
        if (themed && !navRef.current?.contains(themed)) {
          const theme = themed.getAttribute("data-navbar-theme");
          if (theme === "dark") return { r: 0, g: 0, b: 0, a: 1 };
          if (theme === "light") return { r: 255, g: 255, b: 255, a: 1 };
        }

        if (element instanceof HTMLImageElement) {
          const imgColor = sampleImagePixel(element, x, y);
          if (imgColor) return imgColor;
        }

        const bg = parseRgba(window.getComputedStyle(element).backgroundColor);
        if (bg && bg.a > 0.1) return bg;
      }
      return null;
    };

    const updateBackground = () => {
      const navEl = navRef.current;
      if (!navEl) return;

      const navBg = parseRgba(window.getComputedStyle(navEl).backgroundColor);
      if (navBg && navBg.a >= 0.85) {
        setIsLightBackground(luminance(navBg.r, navBg.g, navBg.b) > 0.5);
        return;
      }

      const rect = navEl.getBoundingClientRect();
      const cy = rect.top + rect.height * 0.5;
      const colors = [0.1, 0.3, 0.5, 0.7, 0.9]
        .map((ratio) => getColorAtPoint(rect.left + rect.width * ratio, cy))
        .filter((c): c is NonNullable<typeof c> => c !== null);

      if (colors.length === 0) {
        const bodyBg = parseRgba(
          window.getComputedStyle(document.body).backgroundColor,
        );
        if (bodyBg && bodyBg.a > 0) {
          setIsLightBackground(luminance(bodyBg.r, bodyBg.g, bodyBg.b) > 0.5);
        }
        return;
      }

      const avg = colors.reduce(
        (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
        { r: 0, g: 0, b: 0 },
      );
      const n = colors.length;
      setIsLightBackground(luminance(avg.r / n, avg.g / n, avg.b / n) > 0.5);
    };

    const scheduleUpdate = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateBackground();
      });
    };

    scheduleUpdate();
    retryTimer = window.setTimeout(scheduleUpdate, 300);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      cancelAnimationFrame(rafId);
      clearTimeout(retryTimer);
    };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems: NavItemConfig[] = [
    { href: `/${locale}`, label: t("Inicio") },
    {
      label: t("Propiedades"),
      items: [
        { href: `/${locale}/properties`, label: t("En renta") },
        {
          href: `/${locale}/properties/sale`,
          label: t("En venta (próximamente)"),
          disabled: true,
        },
      ],
    },
    {
      label: t("Nosotros"),
      items: [
        { href: `/${locale}/about`, label: t("¿Quiénes somos?") },
        {
          href: `/${locale}/join`,
          label: t("Trabaja con nosotros"),
        },
        { href: `/${locale}/contact`, label: t("Contáctanos") },
      ],
    },
    {
      href: `/${locale}/property-management`,
      label: t("Gestión de propiedades"),
    },
    {
      href: `/${locale}/calculator`,
      label: t("Calculadora de ingresos"),
    },
  ];

  const navTextClass = isMounted
    ? isLightBackground
      ? "text-black"
      : "text-white"
    : "text-white";

  return (
    <>
      <nav
        ref={navRef}
        className={`bordershadow-lg fixed left-1/2 flex w-full -translate-x-1/2 items-center justify-between px-5 py-4 transition-colors duration-300 xl:w-[96%] xl:rounded-xl xl:px-12 xl:py-5 xl:[background-blend-mode:overlay,normal] xl:[backdrop-filter:blur(22.39px)] xl:[-webkit-backdrop-filter:blur(22.39px)] xl:[background:radial-gradient(90.16%_143.01%_at_15.32%_21.04%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.045)_77.08%,rgba(255,255,255,0)_100%)] ${navTextClass} ${
          isMobileMenuOpen ? "pointer-events-none z-30" : "z-50"
        } ${
          isScrolled
            ? "top-0 bg-white xl:top-4 xl:bg-transparent"
            : "xl:top-8.5"
        }`}
      >
        <Link href={`/${locale}`} aria-label="Ir al inicio">
          <KanaaLogo />
        </Link>

        <div className="hidden items-center gap-7.5 lg:flex">
          {navItems.map((item) => {
            if (item.items) {
              const isActive =
                item.items.some(
                  (sub) =>
                    pathname === sub.href ||
                    pathname.startsWith(sub.href + "/"),
                ) ||
                (item.label === t("Propiedades") && isPropertiesPage);
              const isOpen = openDropdown === item.label;

              return (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    className="flex cursor-pointer items-center gap-1 transition-opacity hover:opacity-80"
                  >
                    <Text
                      as="span"
                      font="gilroy"
                      weight={isActive ? "bold" : "normal"}
                      className="text-current"
                    >
                      {item.label}
                    </Text>
                    <ChevronDownIcon
                      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute top-full left-0 z-50 mt-3 flex w-39.5 flex-col items-start gap-4.75 rounded-[10px] bg-[#F2F0EA] p-5 shadow-lg">
                      {item.items.map((sub) =>
                        sub.disabled ? (
                          <span
                            key={sub.href}
                            className="flex w-full cursor-not-allowed items-center"
                          >
                            <Text
                              as="span"
                              font="gilroy"
                              size="base"
                              weight="medium"
                              className="text-[#2C3728] opacity-40"
                            >
                              {sub.label}
                            </Text>
                          </span>
                        ) : (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpenDropdown(null)}
                            className="flex w-full items-center"
                          >
                            <Text
                              as="span"
                              font="gilroy"
                              size="base"
                              weight="medium"
                              className="text-[#2C3728]"
                            >
                              {sub.label}
                            </Text>
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavItem
                key={item.href}
                href={item.href!}
                active={
                  pathname === item.href ||
                  (item.href === `/${locale}/properties` && isPropertiesPage)
                }
                className={isPropertiesPage ? "text-green-normal!" : ""}
              >
                {item.label}
              </NavItem>
            );
          })}

          <Link href={`/${locale}/properties`}>
            <Button
              variant="primary"
              icon={
                <CircleButton>
                  <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
              }
            >
              {t("Reserva ahora")}
            </Button>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Abrir menú"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(true)}
          className={`lg:hidden ${isMobileMenuOpen ? "hidden" : ""}`}
        >
          <Bars3Icon
            className={`h-8 w-8 transition-colors duration-300 ${navTextClass}`}
          />
        </button>
      </nav>

      <nav
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 z-50 bg-white px-6 pt-8 transition-opacity duration-200 lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} aria-label="Ir al inicio">
            <KanaaLogo />
          </Link>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <XMarkIcon className="h-8 w-8 text-black" />
          </button>
        </div>

        <div className="mt-20 flex flex-col gap-6">
          {navItems.map((item) => {
            if (item.items) {
              const isOpen = openMobileDropdown === item.label;

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMobileDropdown(isOpen ? null : item.label)
                    }
                    className="flex w-full items-center justify-between"
                  >
                    <Text
                      as="span"
                      font="gilroy"
                      className="text-2xl text-black"
                    >
                      {item.label}
                    </Text>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-black transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 flex flex-col gap-3 pl-4">
                      {item.items.map((sub) =>
                        sub.disabled ? (
                          <span key={sub.href} className="cursor-not-allowed">
                            <Text
                              as="span"
                              font="gilroy"
                              className="text-xl text-black/30"
                            >
                              {sub.label}
                            </Text>
                          </span>
                        ) : (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                            }}
                          >
                            <Text
                              as="span"
                              font="gilroy"
                              className="text-xl text-black/60"
                            >
                              {sub.label}
                            </Text>
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <NavItem
                  href={item.href!}
                  active={
                    pathname === item.href ||
                    (item.href === `/${locale}/properties` && isPropertiesPage)
                  }
                  className={`text-2xl text-black ${
                    isPropertiesPage ? "text-green-normal!" : ""
                  }`}
                >
                  {item.label}
                </NavItem>
              </div>
            );
          })}

          <Link href={`/${locale}/properties`} onClick={() => setIsMobileMenuOpen(false)}>
            <Button
              variant="primary"
              className="mt-2 w-full justify-center"
              icon={
                <CircleButton>
                  <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
              }
            >
              {t("Reserva ahora")}
            </Button>
          </Link>
        </div>
      </nav>
    </>
  );
};
