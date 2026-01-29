import { Text } from "@/components/atoms";
import { TestimonialCarousel } from "@/components/organisms";

export const BackedExperience = () => {
  return (
    <section className="flex flex-col items-center bg-white px-4 py-16">
      <Text size="5xl" className="text-green-normal">
        Experiencias que nos respaldan
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-6 mb-8">
        Huéspedes y propietarios comparten cómo KANNA transformó su forma de
        viajar y de gestionar sus propiedades.
      </Text>
      <TestimonialCarousel />
    </section>
  );
};
