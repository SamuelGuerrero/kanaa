import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton, Text } from "@/components/atoms";
import { Button, GuideCard, type GuideCardProps } from "@/components/molecules";
import GuideAndTip1 from "@assets/images/Home/GuideAndTip1.png";
import GuideAndTip2 from "@assets/images/Home/GuideAndTip2.png";
import GuideAndTip3 from "@assets/images/Home/GuideAndTip3.png";

const FALLBACK_CARDS: GuideCardProps[] = [
  {
    name: "Los mejores planes de fin de semana en Mérida",
    category: "Para viajeros",
    date: "August 20, 2025",
    image: GuideAndTip1,
  },
  {
    name: "Errores comunes que los propietarios deben evitar",
    category: "Para propietarios",
    date: "August 20, 2025",
    image: GuideAndTip2,
  },
  {
    name: "Tips para viajar con familia o mascotas",
    category: "Lifestyle",
    date: "August 20, 2025",
    image: GuideAndTip3,
  },
];

type CmsCard = {
  name: string;
  category: string;
  date: string;
  imageUrl?: string;
};

type GuideAndTipsProps = {
  title?: string | null;
  subtitle?: string | null;
  buttonLabel?: string | null;
  cards?: CmsCard[];
};

export const GuideAndTips = ({
  title,
  subtitle,
  buttonLabel,
  cards,
}: GuideAndTipsProps) => {
  const displayCards: GuideCardProps[] = cards
    ? cards.map((c) => ({
        name: c.name,
        category: c.category,
        date: c.date,
        ...(c.imageUrl ? { imageUrl: c.imageUrl } : {}),
      }))
    : FALLBACK_CARDS;

  return (
    <section className="bg-green-dark-hover text-grey-light flex w-full flex-col px-4 py-7 sm:py-5 md:items-center md:py-20 md:text-center">
      <Text className="mb-5 md:mb-8" weight="medium" size="5xl">
        {title ?? "Guías y consejos para viajeros y propietarios"}
      </Text>
      <Text className="mb-8" size="lg" font="gilroy">
        {subtitle ?? "Planifica la estancia perfecta y saca el máximo provecho a tu propiedad."}
      </Text>
      <div className="flex flex-col justify-center gap-5 lg:flex-row">
        {displayCards.map((card, index) => (
          <GuideCard key={index} {...card} />
        ))}
      </div>

      <Button
        variant="primary"
        textWeight="bold"
        className="text-gold-dark! mt-10 w-fit font-bold"
        href="/blog"
        icon={
          <CircleButton>
            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        }
      >
        {buttonLabel ?? "Visita nuestro blog"}
      </Button>
    </section>
  );
};
