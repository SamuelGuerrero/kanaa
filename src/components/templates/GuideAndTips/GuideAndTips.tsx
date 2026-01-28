import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { CircleButton, Text } from "@/components/atoms"
import { Button, GuideCard, type GuideCardProps } from "@/components/molecules"
import GuideAndTip1 from "@assets/images/Home/GuideAndTip1.png";
import GuideAndTip2 from "@assets/images/Home/GuideAndTip2.png";
import GuideAndTip3 from "@assets/images/Home/GuideAndTip3.png";

const CardGrid: GuideCardProps[] = [
  {
    id: 1,
    name: 'Los mejores planes de fin de semana en Mérida',
    category: 'Para viajeros',
    date: 'August 20, 2025',
    image: GuideAndTip1,
  },
  {
    id: 2,
    name: 'Errores comunes que los propietarios deben evitar',
    category: 'Para propietarios',
    date: 'August 20, 2025',
    image: GuideAndTip2,
  },
  {
    id: 3,
    name: 'Tips para viajar con familia o mascotas',
    category: 'Lifestyle',
    date: 'August 20, 2025',
    image: GuideAndTip3,
  },
]

export const GuideAndTips = () => {
  return (
    <section className="bg-green-dark-hover w-full py-20 flex flex-col items-center text-grey-light">
      <Text className="mb-8" weight="medium" size="5xl" >Guías y consejos para viajeros y propietarios</Text>
      <Text className="mb-8" weight="medium" size="lg" font="gilroy" >Planifica la estancia perfecta y saca el máximo provecho a tu propiedad.</Text>
      <div className="flex flex-row gap-5 justify-center">
        {
          CardGrid.map((card) => (
            <GuideCard
              id={card.id}
              key={card.id}
              name={card.name}
              category={card.category}
              date={card.date}
              image={card.image}
            />
          ))
        }

      </div>

      <Button
        variant="primary"
        textWeight="bold"
        className="text-gold-normal-hover! mt-10 font-bold"
        icon={
          <CircleButton>
            <ArrowRightIcon className="text-gold-normal-hover w-5 drop-shadow-[0_0_0.5px_currentColor]" />
          </CircleButton>
        }
      >
        Visita nuestro blog
      </Button>

    </section>
  )
}
