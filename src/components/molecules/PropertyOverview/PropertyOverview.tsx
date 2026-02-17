"use client";

import { PaperAirplaneIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Bath, BedDoubleIcon, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AmenityItem, CircleButton, Text } from "@/components/atoms";

import { Button } from "../Button";

type PropertyOverviewProps = {
  city: string;
  state: string;
  country: string;
  personCapacity: number;
  bedroomsNumber: number;
  bathroomsNumber: number;
  className?: string;
  showButton?: boolean;
  name?: string;
};

export const PropertyOverview = ({
  city,
  state,
  country,
  personCapacity,
  bedroomsNumber,
  bathroomsNumber,
  className,
  showButton,
  name,
}: PropertyOverviewProps) => {
  const [copied, setCopied] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const showCopied = () => {
    setCopied(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleCopyUrl = async () => {
    const url = window.location.href;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showCopied();
        return;
      }
    } catch {
      console.error("Clipboard API failed, falling back to textarea method.");
    }

    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showCopied();
  };

  return (
    <div className={className}>
      <Text size="5xl" className="text-green-normal" weight="medium">
        {name}
      </Text>
      <div className="flex justify-between">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="mt-2 flex items-center gap-2 sm:mt-0">
            <MapPin className="text-green-normal h-5 w-5 sm:hidden" />
            <Text className="text-[#6B7280]" size="lg" font="gilroy">
              {city}, {state}, {country}
            </Text>
          </div>

          <div className="-mt-1 flex items-center gap-4.25 sm:mt-0">
            <AmenityItem
              icon={<UserGroupIcon className="text-gold-normal h-5 w-5" />}
              value={personCapacity}
              description="Huésp."
            />
            <AmenityItem
              icon={<BedDoubleIcon className="text-gold-normal h-5 w-5" />}
              value={bedroomsNumber}
              description="Recám."
            />
            <AmenityItem
              icon={<Bath className="text-gold-normal h-5 w-5" />}
              value={bathroomsNumber}
              description={bathroomsNumber === 1 ? "Baño" : "Baños"}
            />
          </div>
        </div>
        {showButton && (
          <div className="relative mb-5">
            <Button
              icon={
                <CircleButton className="bg-gold-light-active!">
                  <PaperAirplaneIcon className="text-gold-dark w-5 -rotate-45 drop-shadow-[0_0_0.5px_currentColor]" />
                </CircleButton>
              }
              variant="primary"
              className="border-gold-light-active border bg-white"
              onClick={handleCopyUrl}
            >
              Compartir
            </Button>
            <div
              className={`pointer-events-none absolute -top-9 right-0 rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-md transition-all duration-200 ${
                copied ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
              aria-live="polite"
            >
              Enlace copiado
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
