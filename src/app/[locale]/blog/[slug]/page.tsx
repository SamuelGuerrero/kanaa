import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

import { BlogProgress } from "@/components/organisms/BlogProgress";
import { BlogShareSidebar } from "@/components/organisms/BlogShareSidebar";
import { BlogToc } from "@/components/organisms/BlogToc";

/* ─── Mock data (replace with CMS fetch later) ─────────────────────────── */

const POST = {
  category: "Para viajeros",
  readTime: "8 min de lectura",
  date: "15 de abril, 2026",
  title: "Mérida sin prisa: una guía para descubrirla como local",
  lead: "Entre plazas empedradas, cenotes escondidos y cocinas que huelen a recado rojo, Mérida se vive mejor cuando se camina despacio. Te contamos cómo convertir tu estancia en una experiencia que se queda.",
  heroImage:
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1920&auto=format&fit=crop",
  heroCaption: "El Paseo de Montejo al atardecer — Mérida, Yucatán.",
  author: {
    name: "Valeria Solís",
    role: "Editora de viajes",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  tags: ["Mérida", "Guía de viaje", "Yucatán", "Gastronomía", "Cenotes"],
};

const TOC_ITEMS = [
  { id: "llegando", label: "Cómo llegar y moverse" },
  { id: "barrios", label: "Los barrios que valen la pena" },
  { id: "gastronomia", label: "Qué comer (y dónde)" },
  { id: "cenotes", label: "Los cenotes cercanos" },
  { id: "consejos", label: "Consejos para viajeros lentos" },
];

const RELATED = [
  {
    category: "Para viajeros",
    title: "Los mejores planes de fin de semana en Mérida",
    excerpt:
      "Mercados, conciertos al aire libre y rincones que se sienten solo los viernes por la noche.",
    date: "20 de agosto, 2025",
    image:
      "https://images.unsplash.com/photo-1583418007992-a1c1e5b93c78?q=80&w=800&auto=format&fit=crop",
    href: "#",
  },
  {
    category: "Mérida",
    title: "Cinco cenotes cerca de Mérida que valen el camino",
    excerpt:
      "Aguas turquesa, silencios verdes y rutas que puedes hacer en una mañana.",
    date: "5 de agosto, 2025",
    image:
      "https://images.unsplash.com/photo-1551776235-dde6d482980b?q=80&w=800&auto=format&fit=crop",
    href: "#",
  },
  {
    category: "Lifestyle",
    title: "Tips para viajar con familia o mascotas",
    excerpt:
      "Lo que realmente importa al elegir un alojamiento cuando viajas en grupo.",
    date: "20 de agosto, 2025",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop",
    href: "#",
  },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      {/* Reading-progress bar (fixed, z-200) */}
      <BlogProgress />

      <main className="bg-gold-light min-h-screen">
        {/* ── BREADCRUMB ── */}
        <nav className="border-b border-gold-light-active px-4 py-4 md:px-8 lg:px-16">
          <div className="mx-auto flex max-w-7xl items-center gap-2 font-gilroy text-xs text-beige-dark">
            <Link
              href={`/${locale}`}
              className="transition-colors hover:text-green-dark-active"
            >
              Inicio
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/blog`}
              className="transition-colors hover:text-green-dark-active"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-green-dark-active line-clamp-1">
              {POST.title}
            </span>
          </div>
        </nav>

        {/* ── ARTICLE HEADER ── */}
        <header className="px-4 pt-14 pb-10 md:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl text-center">
            {/* Category badge */}
            <span className="mb-5 inline-block font-gilroy text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark">
              {POST.category}
            </span>

            {/* Title */}
            <h1 className="font-roboto text-green-dark-active mb-7 text-[clamp(32px,5vw,58px)] leading-[1.05] font-normal tracking-tight">
              {POST.title}
            </h1>

            {/* Lead */}
            <p className="font-gilroy text-beige-darker mb-10 text-[18px] leading-[1.75]">
              {POST.lead}
            </p>

            {/* Author + meta */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={POST.author.avatar}
                    alt={POST.author.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-gilroy text-sm font-semibold text-green-dark-active leading-none">
                    {POST.author.name}
                  </p>
                  <p className="font-gilroy text-[12px] text-beige-dark leading-none mt-1">
                    {POST.author.role}
                  </p>
                </div>
              </div>

              <span className="h-4 w-px bg-beige-normal hidden sm:block" />

              <div className="flex items-center gap-3 font-gilroy text-sm text-beige-dark">
                <span>{POST.date}</span>
                <span className="h-0.75 w-0.75 rounded-full bg-beige-dark" />
                <span>{POST.readTime}</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── HERO IMAGE ── */}
        <div className="px-4 pb-10 md:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                src={POST.heroImage}
                alt={POST.title}
                fill
                unoptimized
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            </div>
            {POST.heroCaption && (
              <p className="mt-3 text-center font-gilroy text-[12px] text-beige-dark italic">
                {POST.heroCaption}
              </p>
            )}
          </div>
        </div>

        {/* ── BODY: share | prose | toc ── */}
        <div className="px-4 pb-20 md:px-8 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[56px_1fr_220px] xl:grid-cols-[64px_1fr_240px]">
            {/* Share sidebar */}
            <div>
              <BlogShareSidebar />
            </div>

            {/* Prose content */}
            <article className="blog-prose min-w-0">
              <p>
                Hay ciudades que te piden prisa. Mérida no es una de ellas.
                Desde que aterrizas en el aeropuerto y el olor a copal y a
                tortilla recién hecha se cuela por la ventana del taxi, algo en
                tu cuerpo entiende que aquí el tiempo funciona distinto.
              </p>

              <p>
                Esta guía no es una lista de "los diez imperdibles". Es más
                bien una invitación a detenerte: en la hamaca de la casa, en el
                mostrador de una cantina, en la orilla de un cenote donde el
                silencio lo llena todo.
              </p>

              <h2 id="llegando">Cómo llegar y moverse</h2>

              <p>
                El Aeropuerto Internacional de Mérida conecta con Ciudad de
                México, Cancún, Monterrey y algunas rutas directas desde
                Houston y Miami. Desde el aeropuerto, un taxi a cualquier punto
                del centro histórico cuesta entre 180 y 220 pesos y tarda unos
                veinte minutos sin tráfico.
              </p>

              <p>
                Para moverse dentro de la ciudad tienes tres opciones reales:
                bici (la ciudad tiene ciclovías decentes y el clima es
                tolerable de octubre a febrero), moto-taxi en los barrios
                periféricos, o taxi de aplicación. El transporte público existe
                pero las rutas no son intuitivas para quien viene de visita.
              </p>

              {/* Pullquote */}
              <blockquote className="blog-pullquote">
                "Mérida es una de las pocas ciudades de México donde todavía
                puedes caminar de noche sin el reloj corriendo contra ti."
                <cite className="blog-pullquote-author">
                  — Carmen Espinosa, guía local desde 2009
                </cite>
              </blockquote>

              <h2 id="barrios">Los barrios que valen la pena</h2>

              <p>
                El <strong>Centro Histórico</strong> es el corazón obvio: el
                Paseo de Montejo con sus casonas porfirianas, la Plaza Grande,
                la Catedral. Pero si te quedas solo ahí te pierdes lo mejor.
              </p>

              <p>
                <strong>Santa Ana</strong> tiene las mejores cantinas de la
                ciudad y un mercado donde los vecinos todavía compran su
                mandado. <strong>García Ginerés</strong> mezcla art déco con
                jardines frondosos y cafeterías donde los meridanos leen el
                periódico en papel. Y <strong>Santiago</strong>, al poniente
                del centro, es quizá el barrio más auténtico: sin bares de
                diseño, sin menús en inglés, solo tortillerías y vecinos que te
                saludan sin conocerte.
              </p>

              {/* Inline figure */}
              <figure className="my-10">
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop"
                    alt="Centro histórico de Mérida"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </div>
                <figcaption className="mt-3 text-center font-gilroy text-[12px] text-beige-dark italic">
                  Las casonas coloniales del centro histórico, restauradas sin
                  perder su carácter original.
                </figcaption>
              </figure>

              <h2 id="gastronomia">Qué comer (y dónde)</h2>

              <p>
                La cocina yucateca no se parece a ninguna otra cocina mexicana.
                Es más lenta, más perfumada, con influencias mayas,
                españolas y libanesas que conviven sin pedir permiso.
              </p>

              <ul>
                <li>
                  <strong>Cochinita pibil:</strong> cerdo marinado en achiote y
                  naranja agria, envuelto en hoja de plátano y cocido bajo
                  tierra. El mejor desayuno de tu vida si lo acompañas con
                  tortilla recién hecha y chile habanero encurtido.
                </li>
                <li>
                  <strong>Sopa de lima:</strong> caldo de pollo con tiras de
                  tortilla, naranja agria y cilantro. Reconfortante y ligero al
                  mismo tiempo.
                </li>
                <li>
                  <strong>Panuchos y salbutes:</strong> tortillas fritas con
                  frijol, pavo o pollo, aguacate y cebolla morada encurtida.
                  Perfectos para el mediodía.
                </li>
                <li>
                  <strong>Queso relleno:</strong> queso de bola holandés relleno
                  de picadillo de cerdo, pasas y aceitunas. Una herencia del
                  comercio henequenero con Europa.
                </li>
              </ul>

              {/* Callout box */}
              <div className="my-10 rounded-lg border border-gold-light-active bg-gold-light p-6">
                <p className="font-gilroy mb-1 text-xs font-semibold uppercase tracking-[0.1em] text-gold-dark">
                  Tip de viaje
                </p>
                <p className="font-gilroy text-[15px] leading-relaxed text-beige-darker">
                  El Mercado Lucas de Gálvez abre desde las 6 am y es donde
                  los meridanos desayunan de verdad. Llega antes de las 9 para
                  conseguir lugar en los puestos de cochinita y evitar las
                  filas del fin de semana.
                </p>
              </div>

              <h2 id="cenotes">Los cenotes cercanos</h2>

              <p>
                A menos de una hora de Mérida existe una red de cenotes que
                hace que cualquier tarde calurosa tenga solución. Los más
                accesibles están en la Ruta de los Cenotes, hacia Puerto
                Morelos, pero hay opciones mucho más tranquilas y menos
                transitadas.
              </p>

              <p>
                <strong>Cenote Xlacah</strong> está dentro de la zona
                arqueológica de Dzibilchaltún y tiene aguas cristalinas con
                peces que no le temen a nadie. <strong>Cenote Sambulá</strong>{" "}
                en Homún es uno de los más hermosos de Yucatán: una caverna
                iluminada donde la luz entra en diagonal y lo convierte todo en
                cinematográfico. <strong>Hacienda Sotuta de Peón</strong> combina
                el recorrido henequenero con acceso a sus propios cenotes
                privados.
              </p>

              <h2 id="consejos">Consejos para viajeros lentos</h2>

              <p>
                Mérida no es un destino de checklist. Si tu plan es ver todo
                en cuarenta y ocho horas, te vas a estresar y te vas a perder
                lo mejor. Aquí van algunos principios para aprovecharlo de otra
                manera:
              </p>

              <ol>
                <li>
                  Elige un solo barrio por día y camínalo sin mapa al menos
                  una hora.
                </li>
                <li>
                  Desayuna en el mercado, come en la calle, cena en un
                  restaurante con carta. En ese orden.
                </li>
                <li>
                  Reserva una noche para el Palacio Municipal: los viernes
                  hay música en vivo en la Plaza Grande y es completamente
                  gratuito.
                </li>
                <li>
                  Lleva una guayabera o un vestido de tela ligera. El calor
                  es real y el algodón es tu mejor aliado.
                </li>
                <li>
                  No te vayas sin aprender al menos tres palabras en maya:
                  <em>bix a beel</em> (¿cómo estás?), <em>ma'alob</em> (bien)
                  y <em>yum bo'otik</em> (gracias). Los locales lo agradecen
                  más de lo que imaginas.
                </li>
              </ol>

              <p>
                Mérida te va a dar exactamente lo que le pidas. Pídele
                despacio.
              </p>
            </article>

            {/* TOC */}
            <div>
              <BlogToc items={TOC_ITEMS} />
            </div>
          </div>
        </div>

        {/* ── ARTICLE FOOTER: tags + author card ── */}
        <div className="border-t border-gold-light-active px-4 py-12 md:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl">
            {/* Tags */}
            <div className="mb-10 flex flex-wrap gap-2">
              {POST.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gold-light-active px-4 py-1.5 font-gilroy text-xs font-medium text-beige-darker transition-colors hover:border-gold-normal hover:text-green-dark-active cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author card */}
            <div className="flex gap-5 rounded-xl border border-gold-light-active bg-gold-light-hover p-6">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={POST.author.avatar}
                  alt={POST.author.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-gilroy text-[11px] font-semibold uppercase tracking-[0.1em] text-gold-dark mb-1">
                  Sobre la autora
                </p>
                <p className="font-roboto text-lg font-medium text-green-dark-active leading-tight mb-1">
                  {POST.author.name}
                </p>
                <p className="font-gilroy text-sm text-beige-darker leading-relaxed">
                  Editora de viajes en Kanaa. Lleva diez años recorriendo el
                  sureste mexicano y escribiendo sobre lo que encuentra cuando
                  decide salir del camino marcado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED ARTICLES ── */}
        <section className="bg-gold-light-hover px-4 py-20 md:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-baseline justify-between gap-4">
              <h2 className="font-roboto text-green-dark-active text-[28px] font-normal tracking-tight">
                También te puede interesar
              </h2>
              <Link
                href={`/${locale}/blog`}
                className="font-gilroy inline-flex items-center gap-2 text-sm text-beige-darker transition-all duration-200 hover:gap-3 hover:text-green-dark-active"
              >
                Ver todos
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {RELATED.map((article, i) => (
                <Link
                  key={i}
                  href={article.href}
                  className="group flex flex-col gap-4"
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-gold-light-active">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-gilroy text-[11px] font-semibold uppercase tracking-[0.08em] text-gold-dark">
                      {article.category}
                    </span>
                    <h3 className="font-roboto text-green-dark-active text-[20px] leading-[1.2] font-medium tracking-tight transition-colors group-hover:text-gold-dark">
                      {article.title}
                    </h3>
                    <p className="font-gilroy text-beige-darker text-[14px] leading-relaxed">
                      {article.excerpt}
                    </p>
                    <span className="font-gilroy text-[13px] text-beige-dark mt-1">
                      {article.date}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="bg-green-dark-active relative overflow-hidden px-4 py-20 md:px-8 lg:px-16">
          {/* decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(165,153,115,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="font-gilroy mb-5 flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.15em] text-gold-light/60">
              <span className="h-px w-7 bg-gold-normal" />
              Kanaa
              <span className="h-px w-7 bg-gold-normal" />
            </p>

            <h2 className="font-roboto text-gold-light mb-5 text-[clamp(28px,4.5vw,48px)] leading-[1.05] font-normal tracking-tight">
              ¿Listo para vivir{" "}
              <em className="font-light italic text-gold-normal">Mérida</em> así?
            </h2>

            <p className="font-gilroy text-gold-light/70 mx-auto mb-9 max-w-md text-[17px] leading-relaxed">
              Encuentra alojamientos que te dejen tiempo para perderte por los
              mercados, los cenotes y las cantinas que ninguna guía menciona.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}/properties`}
                className="font-gilroy inline-flex items-center gap-2.5 rounded-full bg-gold-normal px-7 py-3.5 text-sm font-semibold text-green-dark-active transition-all duration-200 hover:bg-gold-dark hover:gap-4"
              >
                Ver propiedades
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="font-gilroy inline-flex items-center gap-2.5 rounded-full border border-gold-light/30 px-7 py-3.5 text-sm font-semibold text-gold-light transition-all duration-200 hover:border-gold-light/60 hover:gap-4"
              >
                Contáctanos
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
