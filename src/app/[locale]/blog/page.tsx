import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/organisms";
import { createPageMetadata } from "@/lib/seo";

import { BlogFilters } from "./BlogFilters";

import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Guías, consejos y lecturas pensadas para quienes buscan experiencias auténticas, y para propietarios que quieren hacer de su espacio un hogar para otros.",
  path: "/blog",
});

const FEATURED = {
  category: "Para viajeros",
  readTime: "8 min de lectura",
  date: "15 de abril, 2026",
  title: "Mérida sin prisa: una guía para descubrirla como local",
  excerpt:
    "Entre plazas empedradas, cenotes escondidos y cocinas que huelen a recado rojo, Mérida se vive mejor cuando se camina despacio. Te contamos cómo convertir tu estancia en una experiencia que se queda.",
  image:
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1920&auto=format&fit=crop",
  href: "#",
};

const ARTICLES = [
  {
    category: "Para viajeros",
    title: "Los mejores planes de fin de semana en Mérida",
    excerpt:
      "Mercados, conciertos al aire libre y rincones que se sienten solo los viernes por la noche.",
    date: "20 de agosto, 2025",
    image:
      "https://images.unsplash.com/photo-1583418007992-a1c1e5b93c78?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    category: "Para propietarios",
    title: "Errores comunes que los propietarios deben evitar",
    excerpt:
      "Desde fijar tarifas sin datos hasta descuidar las reseñas: lo que separa a una propiedad rentable del resto.",
    date: "20 de agosto, 2025",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    category: "Lifestyle",
    title: "Tips para viajar con familia o mascotas",
    excerpt:
      "Lo que realmente importa al elegir un alojamiento cuando viajas en grupo o con tu compañero de cuatro patas.",
    date: "20 de agosto, 2025",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    category: "Gestión",
    title: "Cómo equipar tu propiedad para recibir huéspedes",
    excerpt:
      "Esenciales, detalles y pequeños lujos que transforman una estancia promedio en una experiencia memorable.",
    date: "12 de agosto, 2025",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    category: "Mérida",
    title: "Cinco cenotes cerca de Mérida que valen el camino",
    excerpt:
      "Aguas turquesa, silencios verdes y rutas que puedes hacer en una mañana sin salir demasiado de la ciudad.",
    date: "5 de agosto, 2025",
    image:
      "https://images.unsplash.com/photo-1551776235-dde6d482980b?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
  {
    category: "Para propietarios",
    title: "Cómo leer los números de tu propiedad mes a mes",
    excerpt:
      "Ocupación, tarifa media, ingreso por noche disponible: los indicadores que realmente cuentan la historia.",
    date: "28 de julio, 2025",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    href: "#",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-gold-light min-h-screen">
      {/* ── HERO ── */}
      <section className="px-4 pt-20 pb-0 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-beige-darker font-gilroy mb-6 flex items-center gap-3 text-xs font-medium tracking-[0.15em] uppercase">
            <span className="bg-gold-normal h-px w-7" />
            Nuestro diario
          </p>

          <h1 className="font-roboto text-green-dark-active max-w-4xl text-[clamp(40px,6vw,80px)] leading-[0.98] font-normal tracking-tight">
            Historias para viajar{" "}
            <em className="text-gold-normal font-light italic">despacio</em>,
            vivir bonito y hospedar mejor.
          </h1>

          <p className="font-gilroy text-beige-darker mt-7 max-w-lg text-lg leading-relaxed">
            Guías, consejos y lecturas pensadas para quienes buscan experiencias
            auténticas, y para propietarios que quieren hacer de su espacio un
            hogar para otros.
          </p>

          <BlogFilters />
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="px-4 pt-16 pb-10 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href={FEATURED.href}
            className="group grid items-center gap-14 md:grid-cols-[1.1fr_1fr]"
          >
            {/* Image */}
            <div className="bg-gold-light-hover relative aspect-[4/3] overflow-hidden rounded-lg">
              <span className="bg-gold-light text-gold-dark font-gilroy absolute top-5 left-5 z-10 rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase">
                Destacado
              </span>
              <Image
                src={FEATURED.image}
                alt={FEATURED.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            </div>

            {/* Content */}
            <div>
              <div className="font-gilroy text-beige-dark mb-5 flex items-center gap-3 text-sm">
                <span>{FEATURED.category}</span>
                <span className="bg-beige-dark h-[3px] w-[3px] rounded-full" />
                <span>{FEATURED.readTime}</span>
                <span className="bg-beige-dark h-[3px] w-[3px] rounded-full" />
                <span>{FEATURED.date}</span>
              </div>

              <h2 className="font-roboto text-green-dark-active mb-5 text-[clamp(28px,3.2vw,46px)] leading-[1.05] font-normal tracking-tight">
                {FEATURED.title}
              </h2>

              <p className="font-gilroy text-beige-darker mb-7 text-[17px] leading-[1.7]">
                {FEATURED.excerpt}
              </p>

              <span className="font-gilroy text-green-dark-active inline-flex items-center gap-2.5 text-sm font-medium transition-all duration-200 group-hover:gap-4">
                Leer artículo
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── ARTICLES GRID ── */}
      <section className="px-4 pt-10 pb-24 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap items-baseline justify-between gap-6">
            <h3 className="font-roboto text-green-dark-active text-[32px] font-normal tracking-tight">
              Artículos recientes
            </h3>
            <p className="font-gilroy text-beige-dark text-sm">
              Publicamos cada semana. Suscríbete y no te pierdas ninguno.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article, i) => (
              <Link
                key={i}
                href={article.href}
                className="group flex flex-col gap-5"
              >
                <div className="bg-gold-light-hover relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <span className="font-gilroy text-gold-dark text-xs font-medium tracking-[0.08em] uppercase">
                    {article.category}
                  </span>
                  <h4 className="font-roboto text-green-dark-active group-hover:text-gold-dark text-[22px] leading-[1.2] font-medium tracking-tight transition-colors duration-200">
                    {article.title}
                  </h4>
                  <p className="font-gilroy text-beige-darker text-[15px] leading-relaxed">
                    {article.excerpt}
                  </p>
                  <span className="font-gilroy text-beige-dark mt-1 text-[13px]">
                    {article.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-20 flex items-center justify-center gap-1.5">
            {["←", "1", "2", "3", "4", "→"].map((label, i) => (
              <button
                key={i}
                className={`font-gilroy flex h-10 min-w-10 items-center justify-center rounded-full border text-sm transition-all duration-200 ${
                  label === "1"
                    ? "border-green-dark-active bg-green-dark-active text-gold-light"
                    : "text-beige-darker hover:border-gold-light-active hover:text-green-dark-active border-transparent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-green-dark-active relative overflow-hidden px-4 py-24 md:px-8 lg:px-16">
        {/* decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(165,153,115,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="font-gilroy text-gold-light/60 mb-6 flex items-center justify-center gap-3 text-xs font-medium tracking-[0.15em] uppercase">
            <span className="bg-gold-normal h-px w-7" />
            Newsletter
            <span className="bg-gold-normal h-px w-7" />
          </p>

          <h2 className="font-roboto text-gold-light mb-5 text-[clamp(32px,5vw,54px)] leading-[1.05] font-normal tracking-tight">
            Recibe nuestras{" "}
            <em className="text-gold-normal font-light italic">mejores</em>{" "}
            historias
          </h2>

          <p className="font-gilroy text-gold-light/70 mx-auto mb-9 max-w-md text-[17px] leading-relaxed">
            Una vez al mes, te enviamos una selección cuidada: nuevos destinos,
            lecturas para propietarios y descuentos exclusivos para
            suscriptores.
          </p>

          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
