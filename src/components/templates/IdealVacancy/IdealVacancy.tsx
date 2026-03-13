import { Text } from "@/components/atoms";
import { Button } from "@/components/molecules";

type Props = {
  title?: string;
  description?: string;
  email?: string;
};

export const IdealVacancy = ({
  title = "¿No ves la vacante ideal?",
  description = "Siempre estamos buscando personas con propósito, talento y visión. Únete a nuestro equipo y construye el futuro con nosotros.",
  email = "talento@kanaa.com",
}: Props) => {
  return (
    <section className="bg-green-dark justify-cente items-center px-1 py-15 text-center text-white md:py-20">
      <Text size="5xl" weight="medium">
        {title}
      </Text>

      <Text size="lg" className="mt-5 md:mt-8" font="gilroy" weight="medium">
        {description}
      </Text>

      <Text size="lg" className="mt-10 md:mt-15" font="gilroy" weight="medium">
        Envía tu Curruculum a
      </Text>
      <Button
        variant="secondary"
        textClassName="text-base font-bold text-gold-normal!"
        className="bg-gold-light-hover! mt-2 w-fit rounded-[10px]"
        href={`mailto:${email}`}
      >
        {email}
      </Button>
    </section>
  );
};
