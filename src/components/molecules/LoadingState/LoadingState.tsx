import { Text } from "@/components/atoms";

export const LoadingState = () => {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-gold-normal mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <Text size="xl">Cargando propiedad...</Text>
      </div>
    </main>
  );
};
