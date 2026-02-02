"use client";

import { useParams } from "next/navigation";

import { ErrorState } from "@/components/molecules/ErrorState";
import { LoadingState } from "@/components/molecules/LoadingState";
import { NotFoundState } from "@/components/molecules/NotFoundState";
import { PropertyDetails } from "@/components/organisms/PropertyDetails";
import { useProperty } from "@/hooks/useProperty";

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { property, isLoading, error } = useProperty(id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!property) {
    return <NotFoundState />;
  }

  return (
    <main className="flex w-full justify-center bg-white">
      <PropertyDetails property={property} />
    </main>
  );
}
