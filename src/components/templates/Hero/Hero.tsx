"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Text } from "@/components/atoms";
import { ReservationSearch } from "@/components/organisms";
import { useI18n } from "@/i18n";
import heroImg1 from "@assets/images/home/hero-img-1.png";
import heroImg2 from "@assets/images/home/hero-img-2.png";
import heroImg3 from "@assets/images/home/hero-img-3.png";
import heroImg4 from "@assets/images/home/hero-img-4.png";

const SLIDES = [heroImg1, heroImg2, heroImg3, heroImg4];
const INTERVAL_MS = 5000;
const FADE_MS = 1800;

export const Hero = () => {
  const router = useRouter();
  const { locale } = useI18n();
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % SLIDES.length;
      });
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (filters: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guestCounts: { adults: number; children: number; infants: number };
  }) => {
    const params = new URLSearchParams();
    if (filters.destination) params.append("destination", filters.destination);
    if (filters.checkIn) params.append("checkIn", filters.checkIn);
    if (filters.checkOut) params.append("checkOut", filters.checkOut);
    params.append("adults", String(filters.guestCounts.adults));
    params.append("children", String(filters.guestCounts.children));
    params.append("infants", String(filters.guestCounts.infants));
    router.push(`/${locale}/properties?${params.toString()}`);
  };

  return (
    <section className="relative min-h-200 w-full sm:min-h-screen">
      {SLIDES.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`Hero background ${i + 1}`}
          fill
          priority={i === 0}
          className="object-cover"
          style={{
            opacity: i === current ? 1 : i === prev ? 1 : 0,
            zIndex: i === current ? 2 : i === prev ? 1 : 0,
            transition:
              i === current ? `opacity ${FADE_MS}ms ease-in-out` : "none",
          }}
        />
      ))}

      <div className="absolute inset-0 z-1 bg-black/30" />

      <div className="relative z-10 mt-8 flex min-h-170 flex-col items-center justify-center px-4 pt-20 text-center text-white sm:mt-0 sm:min-h-screen sm:pt-0">
        <Text className="max-w-175" size="6xl">
          Siéntete como en casa, en cualquier lugar
        </Text>

        <Text size="xl" className="mt-8 mb-10" font="gilroy" weight="medium">
          Hospédate con nosotros
        </Text>
        <ReservationSearch onSearch={handleSearch} />
      </div>
    </section>
  );
};
