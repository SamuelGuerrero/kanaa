import { Text } from "@/components/atoms";
import { getBlogPageData } from "@/lib/strapi";
import { createPageMetadata } from "@/lib/seo";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Contenido sobre gestión de propiedades vacacionales, tendencias de renta corta y consejos para maximizar ingresos.",
  path: "/blog",
});

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const cms = await getBlogPageData(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <Text size="5xl" className="text-green-normal">
        {cms?.heading ?? "Blog"}
      </Text>
      <Text font="gilroy" size="lg" className="text-grey-darker mt-4">
        {cms?.coming_soon ?? "Próximamente."}
      </Text>
    </main>
  );
}
