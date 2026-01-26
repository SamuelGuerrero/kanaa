import {
  FeaturedProperties,
  Hero,
  ValueProposition,
} from "@/components/templates";

export default function HomePage() {
  return (
    <main className="flex flex-col space-y-6">
      <Hero />
      <FeaturedProperties />
      <ValueProposition />
    </main>
  );
}
