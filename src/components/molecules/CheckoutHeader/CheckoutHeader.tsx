import { ArrowLeft } from "lucide-react";

import { Text } from "@/components/atoms";

type CheckoutHeaderProps = {
  onBack: () => void;
};

export const CheckoutHeader = ({ onBack }: CheckoutHeaderProps) => {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <Text font="gilroy" size="base" weight="medium">
            Volver
          </Text>
        </button>
      </div>
    </header>
  );
};

