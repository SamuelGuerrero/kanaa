import { Text } from "@/components/atoms";

type ErrorStateProps = {
  message: string;
};

export const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Text
          as="h1"
          size="2xl"
          weight="bold"
          className="mb-4 text-red-600"
        >
          Error
        </Text>
        <Text size="lg" className="text-gray-500">
          {message}
        </Text>
      </div>
    </main>
  );
};
