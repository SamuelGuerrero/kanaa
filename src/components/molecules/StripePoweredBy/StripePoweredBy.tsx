import Image from "next/image";

import { Text } from "@/components/atoms";

export const StripePoweredBy = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="https://stripe.com/img/v3/home/social.png"
        alt="Powered by Stripe"
        width={120}
        height={24}
        className="h-6 w-auto"
      />
      <Text font="gilroy" size="xs" className="text-gray-400">
        Procesado de forma segura por Stripe
      </Text>
    </div>
  );
};

