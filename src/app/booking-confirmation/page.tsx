import { Text } from "@/components/atoms";

export default function BookingConfirmationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <Text size="5xl" className="text-green-normal">
        Confirmación de reserva
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-4">
        Recibimos tu solicitud. Te contactaremos con los siguientes pasos.
      </Text>
    </main>
  );
}
