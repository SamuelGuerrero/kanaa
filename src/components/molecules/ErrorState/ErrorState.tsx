type ErrorStateProps = {
  message: string;
};

export const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Error</h1>
        <p className="text-lg text-gray-500">{message}</p>
      </div>
    </main>
  );
};
