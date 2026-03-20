import { Text } from "@/components/atoms";

export const CheckoutHero = () => {
  return (
    <div className="mb-10 text-center">
      <Text size="5xl" weight="medium" className="text-green-normal mb-2">
        Completa tu reserva
      </Text>
      <Text font="gilroy" size="lg" className="text-green-normal">
        Estás a un paso de confirmar tu reserva
      </Text>
    </div>
  );
};
