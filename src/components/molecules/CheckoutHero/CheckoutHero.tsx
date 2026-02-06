import { Text } from "@/components/atoms";

export const CheckoutHero = () => {
  return (
    <div className="mb-8 text-center">
      <Text font="gilroy" size="3xl" weight="bold" className="mb-2">
        Completa tu reserva
      </Text>
      <Text font="gilroy" size="base" className="text-gray-600">
        Estás a un paso de confirmar tu estadía
      </Text>
    </div>
  );
};

