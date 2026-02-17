"use client";

import {
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";

import { CircleButton, KanaaLogo } from "@/components/atoms";
import { Button, NavItem } from "@/components/molecules";

export const Navbar = () => {
  const pathname = usePathname();
  const isPropertiesPage = pathname.startsWith("/propiedades");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightBackground, setIsLightBackground] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let rafId = 0;

    const parseRgba = (value: string) => {
      const match = /^rgba?\((\d+),(\d+),(\d+)(?:,([0-9.]+))?\)$/i.exec(
        value.replace(/\s+/g, ""),
      );
      if (!match) return null;
      const r = Number(match[1]);
      const g = Number(match[2]);
      const b = Number(match[3]);
      const a = match[4] === undefined ? 1 : Number(match[4]);
      return { r, g, b, a };
    };

    const luminance = (r: number, g: number, b: number) =>
      (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const getImageColorAtPoint = (
      image: HTMLImageElement,
      x: number,
      y: number
    ) => {
      if (!ctx || !image.complete || !image.naturalWidth || !image.naturalHeight) {
        return null;
      }
      const rect = image.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        return null;
      }

      const sampleSize = 64;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      ctx.clearRect(0, 0, sampleSize, sampleSize);
      ctx.drawImage(image, 0, 0, sampleSize, sampleSize);

      const relX = (x - rect.left) / rect.width;
      const relY = (y - rect.top) / rect.height;
      const px = Math.max(0, Math.min(sampleSize - 1, Math.floor(relX * sampleSize)));
      const py = Math.max(0, Math.min(sampleSize - 1, Math.floor(relY * sampleSize)));
      const data = ctx.getImageData(px, py, 1, 1).data;
      const alpha = data[3] ?? 255;

      return { r: data[0], g: data[1], b: data[2], a: alpha / 255 };
    };

    const getBackgroundColorAtPoint = (x: number, y: number) => {
      const elements = document.elementsFromPoint(x, y);
      for (const element of elements) {
        if (navRef.current?.contains(element)) continue;
        const themeElement = element.closest("[data-navbar-theme]");
        if (themeElement && !navRef.current?.contains(themeElement)) {
          const theme = themeElement.getAttribute("data-navbar-theme");
          if (theme === "dark") return { r: 0, g: 0, b: 0, a: 1 };
          if (theme === "light") return { r: 255, g: 255, b: 255, a: 1 };
        }
        if (element instanceof HTMLImageElement) {
          const imageColor = getImageColorAtPoint(element, x, y);
          if (imageColor && imageColor.a > 0) return imageColor;
        }
        const style = window.getComputedStyle(element);
        const bgColor = parseRgba(style.backgroundColor);
        if (bgColor && bgColor.a > 0) return bgColor;
      }
      return null;
    };

    const getFallbackBackground = () => {
      const bodyColor = parseRgba(
        window.getComputedStyle(document.body).backgroundColor
      );
      if (bodyColor && bodyColor.a > 0) return bodyColor;
      const htmlColor = parseRgba(
        window.getComputedStyle(document.documentElement).backgroundColor
      );
      if (htmlColor && htmlColor.a > 0) return htmlColor;
      return null;
    };

    const updateBackground = () => {
      const navEl = navRef.current;
      if (!navEl) return;

      const navStyle = window.getComputedStyle(navEl);
      const navBg = parseRgba(navStyle.backgroundColor);
      if (navBg && navBg.a >= 0.85) {
        setIsLightBackground(luminance(navBg.r, navBg.g, navBg.b) > 0.6);
        return;
      }

      const rect = navEl.getBoundingClientRect();
      const samplePoints: Array<[number, number]> = [
        [rect.left + rect.width * 0.2, rect.top + rect.height * 0.5],
        [rect.left + rect.width * 0.5, rect.top + rect.height * 0.5],
        [rect.left + rect.width * 0.8, rect.top + rect.height * 0.5],
      ];

      const samples = samplePoints
        .map(([x, y]) => getBackgroundColorAtPoint(x, y))
        .filter(Boolean) as Array<{
        r: number;
        g: number;
        b: number;
        a: number;
      }>;

      if (samples.length === 0) {
        const fallback = getFallbackBackground();
        if (!fallback) return;
        setIsLightBackground(luminance(fallback.r, fallback.g, fallback.b) > 0.6);
        return;
      }

      const avg = samples.reduce(
        (acc, color) => {
          acc.r += color.r;
          acc.g += color.g;
          acc.b += color.b;
          return acc;
        },
        { r: 0, g: 0, b: 0 },
      );

      const count = samples.length;
      setIsLightBackground(
        luminance(avg.r / count, avg.g / count, avg.b / count) > 0.6,
      );
    };

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateBackground();
      });
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Inicio" },
    { href: "/propiedades", label: "Propiedades" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/gestion-propiedades", label: "Gestión de propiedades" },
    { href: "/calculadora", label: "Calculadora de ingresos" },
  ];

  const navTextClass = isLightBackground ? "text-black" : "text-white";

  return (
    <>
      <nav
        ref={navRef}
        className={`bordershadow-lg fixed left-1/2 flex w-full -translate-x-1/2 items-center justify-between px-5 py-4 transition-colors duration-300 sm:w-[96%] sm:rounded-xl md:px-12 md:py-5 md:[background-blend-mode:overlay,normal] md:[backdrop-filter:blur(22.39px)] md:[-webkit-backdrop-filter:blur(22.39px)] md:[background:radial-gradient(90.16%_143.01%_at_15.32%_21.04%,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.045)_77.08%,rgba(255,255,255,0)_100%)] ${navTextClass} ${
          isMobileMenuOpen ? "pointer-events-none z-30" : "z-50"
        } ${
          isScrolled
            ? "top-0 sm:top-4 bg-white md:bg-transparent"
            : "sm:top-8.5"
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
            href="/propiedades"
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
            className={`h-8 w-8 transition-colors duration-300 ${navTextClass}`}
          />
        </button>
      </nav>

      <nav
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 z-50 bg-white px-6 pt-8 transition-opacity duration-200 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <KanaaLogo />
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
              href="/propiedades"
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
