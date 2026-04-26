import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";

import { BlogFilters, NewsletterForm } from "@/components/organisms";
import { createPageMetadata, type SiteLocale } from "@/lib/seo";
import configPromise from "@payload-config";

import type {
  BlogPost,
  Category,
  Media,
} from "../../../../payload-types";
import type { Metadata } from "next";
import type { Where } from "payload";

type BlogPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    page?: string;
    cat?: string;
    q?: string;
  }>;
};

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Guías, consejos y lecturas pensadas para quienes buscan experiencias auténticas, y para propietarios que quieren hacer de su espacio un hogar para otros.",
  path: "/blog",
});

const PAGE_SIZE = 6;

const UI_COPY = {
  es: {
    eyebrow: "Nuestro diario",
    titleStart: "Historias para viajar ",
    titleEm: "despacio",
    titleEnd: ", vivir bonito y hospedar mejor.",
    intro:
      "Guías, consejos y lecturas pensadas para quienes buscan experiencias auténticas, y para propietarios que quieren hacer de su espacio un hogar para otros.",
    featuredBadge: "Destacado",
    readArticle: "Leer artículo",
    recentTitle: "Artículos recientes",
    recentSubtitle: "Publicamos cada semana. Suscríbete y no te pierdas ninguno.",
    resultsTitle: "Resultados",
    resultsForCategory: (label: string) => `Categoría: ${label}`,
    resultsForSearch: (q: string) => `Búsqueda: "${q}"`,
    noResults: "No encontramos artículos con esos filtros.",
    clearFilters: "Limpiar filtros",
    allLabel: "Todos",
    searchPlaceholder: "Buscar artículos",
    newsletterEyebrow: "Newsletter",
    newsletterTitleStart: "Recibe nuestras ",
    newsletterTitleEm: "mejores",
    newsletterTitleEnd: " historias",
    newsletterBody:
      "Una vez al mes, te enviamos una selección cuidada: nuevos destinos, lecturas para propietarios y descuentos exclusivos para suscriptores.",
  },
  en: {
    eyebrow: "Our journal",
    titleStart: "Stories for traveling ",
    titleEm: "slowly",
    titleEnd: ", living beautifully and hosting better.",
    intro:
      "Guides, tips and reads for travelers chasing real experiences and for owners who want to turn their space into a home for others.",
    featuredBadge: "Featured",
    readArticle: "Read article",
    recentTitle: "Recent articles",
    recentSubtitle: "We publish weekly. Subscribe so you don't miss any.",
    resultsTitle: "Results",
    resultsForCategory: (label: string) => `Category: ${label}`,
    resultsForSearch: (q: string) => `Search: "${q}"`,
    noResults: "No articles match those filters.",
    clearFilters: "Clear filters",
    allLabel: "All",
    searchPlaceholder: "Search articles",
    newsletterEyebrow: "Newsletter",
    newsletterTitleStart: "Get our ",
    newsletterTitleEm: "best",
    newsletterTitleEnd: " stories",
    newsletterBody:
      "Once a month, a curated selection: new destinations, reads for owners and exclusive subscriber discounts.",
  },
} as const;

const formatPublishedDate = (value: string, locale: SiteLocale) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

const getMediaUrl = (media?: number | Media | null) =>
  media && typeof media === "object" && media.url ? media.url : null;

const getCoverImageUrl = (post: BlogPost) =>
  getMediaUrl(post.coverImage) ?? post.coverImageUrl;

const getCategoryRelation = (post: BlogPost): Category | null =>
  typeof post.category === "object" ? post.category : null;

const getCategoryLabel = (post: BlogPost) =>
  getCategoryRelation(post)?.label ?? "";

const buildQs = (params: Record<string, string | undefined>) => {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v.length > 0) usp.set(k, v);
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
};

type Filters = {
  page: number;
  category?: string;
  search?: string;
};

const fetchCategories = async (locale: SiteLocale) => {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "categories",
    sort: "order",
    limit: 100,
    pagination: false,
    locale,
  });
  return result.docs;
};

const fetchListing = async (locale: SiteLocale, filters: Filters) => {
  const payload = await getPayload({ config: configPromise });
  const isFiltered =
    (filters.category?.length ?? 0) > 0 || (filters.search?.length ?? 0) > 0;
  const showFeatured = !isFiltered && filters.page === 1;

  let featured: BlogPost | null = null;
  if (showFeatured) {
    const featuredResult = await payload.find({
      collection: "blog-posts",
      where: {
        and: [
          { isFeatured: { equals: true } },
          { isPublished: { equals: true } },
        ],
      },
      sort: "-publishedAt",
      limit: 1,
      locale,
    });
    featured = featuredResult.docs[0] ?? null;
  }

  const conditions: Where[] = [{ isPublished: { equals: true } }];
  if (featured) conditions.push({ id: { not_equals: featured.id } });
  if (filters.category) {
    conditions.push({ "category.slug": { equals: filters.category } });
  }
  if (filters.search) {
    conditions.push({
      or: [
        { title: { like: filters.search } },
        { excerpt: { like: filters.search } },
      ],
    });
  }

  const gridResult = await payload.find({
    collection: "blog-posts",
    where: { and: conditions },
    sort: "-publishedAt",
    page: filters.page,
    limit: PAGE_SIZE,
    locale,
  });

  return {
    featured,
    articles: gridResult.docs,
    totalPages: gridResult.totalPages,
    currentPage: gridResult.page ?? filters.page,
  };
};

export default async function BlogPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { locale } = await params;
  const { page: pageParam, cat, q } = await searchParams;
  const siteLocale = (locale === "en" ? "en" : "es") as SiteLocale;
  const copy = UI_COPY[siteLocale];

  const basePath = `/${locale}/blog`;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const rawCategory = cat?.trim();
  const rawSearch = q?.trim();
  const category = rawCategory && rawCategory.length > 0 ? rawCategory : undefined;
  const search = rawSearch && rawSearch.length > 0 ? rawSearch : undefined;
  const isFiltered = (category?.length ?? 0) > 0 || (search?.length ?? 0) > 0;

  const [{ featured, articles, totalPages, currentPage }, categoryDocs] =
    await Promise.all([
      fetchListing(siteLocale, { page, category, search }),
      fetchCategories(siteLocale),
    ]);

  const categories = categoryDocs.map((c) => ({
    value: c.slug,
    label: c.label,
  }));

  const activeCategoryLabel = category
    ? (categoryDocs.find((c) => c.slug === category)?.label ?? category)
    : null;

  return (
    <main className="bg-gold-light min-h-screen">
      {/* ── HERO ── */}
      <section className="px-4 pt-20 pb-0 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-beige-darker font-gilroy mb-6 flex items-center gap-3 text-xs font-medium tracking-[0.15em] uppercase">
            <span className="bg-gold-normal h-px w-7" />
            {copy.eyebrow}
          </p>

          <h1 className="font-roboto text-green-dark-active max-w-4xl text-[clamp(40px,6vw,80px)] leading-[0.98] font-normal tracking-tight">
            {copy.titleStart}
            <em className="text-gold-normal font-light italic">
              {copy.titleEm}
            </em>
            {copy.titleEnd}
          </h1>

          <p className="font-gilroy text-beige-darker mt-7 max-w-lg text-lg leading-relaxed">
            {copy.intro}
          </p>

          <BlogFilters
            basePath={basePath}
            currentCategory={category}
            currentSearch={search}
            categories={categories}
            copy={{
              allLabel: copy.allLabel,
              searchPlaceholder: copy.searchPlaceholder,
            }}
          />
        </div>
      </section>

      {/* ── FEATURED ── */}
      {featured && (
        <section className="px-4 pt-16 pb-10 md:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <Link
              href={`/${locale}/blog/${featured.slug}`}
              className="group grid items-center gap-14 md:grid-cols-[1.1fr_1fr]"
            >
              <div className="bg-gold-light-hover relative aspect-4/3 overflow-hidden rounded-lg">
                <span className="bg-gold-light text-gold-dark font-gilroy absolute top-5 left-5 z-10 rounded-full px-3.5 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase">
                  {copy.featuredBadge}
                </span>
                <Image
                  src={getCoverImageUrl(featured)}
                  alt={featured.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 55vw"
                />
              </div>

              <div>
                <div className="font-gilroy text-beige-dark mb-5 flex items-center gap-3 text-sm">
                  <span>{getCategoryLabel(featured)}</span>
                  <span className="bg-beige-dark h-0.75 w-0.75 rounded-full" />
                  <span>{featured.readTime}</span>
                  <span className="bg-beige-dark h-0.75 w-0.75 rounded-full" />
                  <span>{formatPublishedDate(featured.publishedAt, siteLocale)}</span>
                </div>

                <h2 className="font-roboto text-green-dark-active mb-5 text-[clamp(28px,3.2vw,46px)] leading-[1.05] font-normal tracking-tight">
                  {featured.title}
                </h2>

                <p className="font-gilroy text-beige-darker mb-7 text-[17px] leading-[1.7]">
                  {featured.excerpt}
                </p>

                <span className="font-gilroy text-green-dark-active inline-flex items-center gap-2.5 text-sm font-medium transition-all duration-200 group-hover:gap-4">
                  {copy.readArticle}
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── ARTICLES GRID ── */}
      <section className="px-4 pt-10 pb-24 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-wrap items-baseline justify-between gap-6">
            <h3 className="font-roboto text-green-dark-active text-[32px] font-normal tracking-tight">
              {isFiltered ? copy.resultsTitle : copy.recentTitle}
            </h3>
            <p className="font-gilroy text-beige-dark text-sm">
              {isFiltered
                ? [
                    activeCategoryLabel
                      ? copy.resultsForCategory(activeCategoryLabel)
                      : null,
                    search ? copy.resultsForSearch(search) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")
                : copy.recentSubtitle}
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="font-gilroy text-beige-darker text-base">
                {copy.noResults}
              </p>
              <Link
                href={basePath}
                className="font-gilroy text-sm text-green-dark-active underline underline-offset-4 transition-colors hover:text-gold-dark"
              >
                {copy.clearFilters}
              </Link>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/${locale}/blog/${article.slug}`}
                  className="group flex flex-col gap-5"
                >
                  <div className="bg-gold-light-hover relative aspect-4/3 overflow-hidden rounded-md">
                    <Image
                      src={getCoverImageUrl(article)}
                      alt={article.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <span className="font-gilroy text-gold-dark text-xs font-medium tracking-[0.08em] uppercase">
                      {getCategoryLabel(article)}
                    </span>
                    <h4 className="font-roboto text-green-dark-active group-hover:text-gold-dark text-[22px] leading-[1.2] font-medium tracking-tight transition-colors duration-200">
                      {article.title}
                    </h4>
                    <p className="font-gilroy text-beige-darker text-[15px] leading-relaxed">
                      {article.excerpt}
                    </p>
                    <span className="font-gilroy text-beige-dark mt-1 text-[13px]">
                      {formatPublishedDate(article.publishedAt, siteLocale)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-20 flex items-center justify-center gap-1.5"
            >
              {Array.from({ length: totalPages + 2 }, (_, i) => {
                // 0 = prev, last = next, in-between = page numbers
                const isPrev = i === 0;
                const isNext = i === totalPages + 1;
                const pageNumber = i; // for pages, i ∈ [1..totalPages]

                if (isPrev) {
                  const disabled = currentPage <= 1;
                  return (
                    <Link
                      key="prev"
                      href={
                        disabled
                          ? "#"
                          : `${basePath}${buildQs({
                              page:
                                currentPage - 1 === 1
                                  ? undefined
                                  : String(currentPage - 1),
                              cat: category,
                              q: search,
                            })}`
                      }
                      aria-disabled={disabled}
                      className={`font-gilroy flex h-10 min-w-10 items-center justify-center rounded-full border text-sm transition-all duration-200 ${
                        disabled
                          ? "pointer-events-none border-transparent text-beige-normal"
                          : "border-transparent text-beige-darker hover:border-gold-light-active hover:text-green-dark-active"
                      }`}
                    >
                      ←
                    </Link>
                  );
                }

                if (isNext) {
                  const disabled = currentPage >= totalPages;
                  return (
                    <Link
                      key="next"
                      href={
                        disabled
                          ? "#"
                          : `${basePath}${buildQs({
                              page: String(currentPage + 1),
                              cat: category,
                              q: search,
                            })}`
                      }
                      aria-disabled={disabled}
                      className={`font-gilroy flex h-10 min-w-10 items-center justify-center rounded-full border text-sm transition-all duration-200 ${
                        disabled
                          ? "pointer-events-none border-transparent text-beige-normal"
                          : "border-transparent text-beige-darker hover:border-gold-light-active hover:text-green-dark-active"
                      }`}
                    >
                      →
                    </Link>
                  );
                }

                const isActive = pageNumber === currentPage;
                return (
                  <Link
                    key={pageNumber}
                    href={`${basePath}${buildQs({
                      page: pageNumber === 1 ? undefined : String(pageNumber),
                      cat: category,
                      q: search,
                    })}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`font-gilroy flex h-10 min-w-10 items-center justify-center rounded-full border text-sm transition-all duration-200 ${
                      isActive
                        ? "border-green-dark-active bg-green-dark-active text-gold-light"
                        : "text-beige-darker hover:border-gold-light-active hover:text-green-dark-active border-transparent"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-green-dark-active relative overflow-hidden px-4 py-24 md:px-8 lg:px-16">
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
            {copy.newsletterEyebrow}
            <span className="bg-gold-normal h-px w-7" />
          </p>

          <h2 className="font-roboto text-gold-light mb-5 text-[clamp(32px,5vw,54px)] leading-[1.05] font-normal tracking-tight">
            {copy.newsletterTitleStart}
            <em className="text-gold-normal font-light italic">
              {copy.newsletterTitleEm}
            </em>
            {copy.newsletterTitleEnd}
          </h2>

          <p className="font-gilroy text-gold-light/70 mx-auto mb-9 max-w-md text-[17px] leading-relaxed">
            {copy.newsletterBody}
          </p>

          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
