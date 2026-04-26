import Image from "next/image";
import Link from "next/link";
import { getPayload } from "payload";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { notFound } from "next/navigation";

import { Text } from "@/components/atoms";
import { BlogProgress } from "@/components/organisms/BlogProgress";
import { BlogShareSidebar } from "@/components/organisms/BlogShareSidebar";
import { BlogToc } from "@/components/organisms/BlogToc";
import { createPageMetadata, toAbsoluteUrl, type SiteLocale } from "@/lib/seo";
import configPromise from "@payload-config";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import type { Author, BlogPost, Media } from "../../../../../payload-types";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

type TocItem = {
  id: string;
  label: string;
};

type RichTextNode = {
  type: string;
  tag?: string;
  id?: string;
  text?: string;
  format?: number | string;
  url?: string;
  fields?: {
    url?: string;
    linkType?: "custom" | "internal";
  };
  value?: {
    url?: string | null;
  };
  children?: RichTextNode[];
};

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  travelers: { es: "Para viajeros", en: "For travelers" },
  owners: { es: "Para propietarios", en: "For owners" },
  lifestyle: { es: "Lifestyle", en: "Lifestyle" },
  management: { es: "Gestión", en: "Management" },
  merida: { es: "Mérida", en: "Mérida" },
  gastronomy: { es: "Gastronomía", en: "Gastronomy" },
};

const UI_COPY = {
  es: {
    home: "Inicio",
    blog: "Blog",
    inThisArticle: "En este artículo",
    aboutAuthor: "Sobre la autora",
    aboutAuthorMale: "Sobre el autor",
    relatedTitle: "También te puede interesar",
    seeAll: "Ver todos",
    ctaEyebrow: "Kanaa",
    ctaTitle: "¿Listo para vivir Mérida así?",
    ctaBody:
      "Encuentra alojamientos que te dejen tiempo para perderte por los mercados, los cenotes y las cantinas que ninguna guía menciona.",
    ctaPrimary: "Ver propiedades",
    ctaSecondary: "Contáctanos",
  },
  en: {
    home: "Home",
    blog: "Blog",
    inThisArticle: "In this article",
    aboutAuthor: "About the author",
    aboutAuthorMale: "About the author",
    relatedTitle: "You may also like",
    seeAll: "View all",
    ctaEyebrow: "Kanaa",
    ctaTitle: "Ready to experience Merida this way?",
    ctaBody:
      "Find stays that leave you time to get lost among markets, cenotes and cantinas no guidebook ever mentions.",
    ctaPrimary: "View properties",
    ctaSecondary: "Contact us",
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

const getAuthor = (author: number | Author): Author | null =>
  typeof author === "object" ? author : null;

const getRelatedPost = (post: number | BlogPost): BlogPost | null =>
  typeof post === "object" ? post : null;

const getCategoryLabel = (
  category: BlogPost["category"],
  locale: SiteLocale,
) => CATEGORY_LABELS[category]?.[locale] ?? category;

const getCoverImageUrl = (post: BlogPost) =>
  getMediaUrl(post.coverImage) ?? post.coverImageUrl;

const getAuthorAvatarUrl = (author: Author | null) =>
  getMediaUrl(author?.avatar) ?? author?.avatarUrl ?? "";

const getLinkHref = (node: RichTextNode) => {
  if (node.fields?.linkType === "custom" && node.fields.url) {
    return node.fields.url;
  }

  if (node.url) return node.url;
  if (node.fields?.url) return node.fields.url;
  if (node.value?.url) return node.value.url;

  return undefined;
};

const renderTextNode = (node: RichTextNode, key: string) => {
  const format = typeof node.format === "number" ? node.format : 0;
  let content: ReactNode = node.text ?? "";

  if (format & 1) content = <strong key={`${key}-bold`}>{content}</strong>;
  if (format & 2) content = <em key={`${key}-italic`}>{content}</em>;
  if (format & 8) content = <u key={`${key}-underline`}>{content}</u>;

  return <span key={key}>{content}</span>;
};

const renderRichTextChildren = (children: RichTextNode[] = []) =>
  children.map((child, index) => renderRichTextNode(child, `${child.type}-${index}`));

const renderRichTextNode = (node: RichTextNode, key: string): ReactNode => {
  switch (node.type) {
    case "text":
      return renderTextNode(node, key);
    case "linebreak":
      return <br key={key} />;
    case "paragraph":
      return (
        <Text key={key} as="p" font="gilroy" className="text-beige-darker">
          {renderRichTextChildren(node.children)}
        </Text>
      );
    case "heading": {
      const Tag = node.tag === "h3" ? "h3" : "h2";
      return (
        <Text
          key={key}
          as={Tag}
          id={node.id}
          font="roboto"
          className="text-green-dark-active"
        >
          {renderRichTextChildren(node.children)}
        </Text>
      );
    }
    case "quote":
      return (
        <Text
          key={key}
          as="blockquote"
          font="roboto"
          className="blog-pullquote"
        >
          {renderRichTextChildren(node.children)}
        </Text>
      );
    case "list":
      if (node.tag === "ol") {
        return <ol key={key}>{renderRichTextChildren(node.children)}</ol>;
      }
      return <ul key={key}>{renderRichTextChildren(node.children)}</ul>;
    case "listitem":
      return <li key={key}>{renderRichTextChildren(node.children)}</li>;
    case "link": {
      const href = getLinkHref(node);
      const children = renderRichTextChildren(node.children);

      if (!href) return <span key={key}>{children}</span>;

      const isExternal = /^https?:\/\//i.test(href);
      if (isExternal) {
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-green-dark-active underline underline-offset-4"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          key={key}
          href={href}
          className="text-green-dark-active underline underline-offset-4"
        >
          {children}
        </Link>
      );
    }
    default:
      return <div key={key}>{renderRichTextChildren(node.children)}</div>;
  }
};

const renderRichText = (content: BlogPost["content"]) => {
  const children = content?.root?.children;
  if (!Array.isArray(children)) return null;

  return children.map((node, index) =>
    renderRichTextNode(node as RichTextNode, `${node.type}-${index}`),
  );
};

const getPostBySlug = async (slug: string, locale: SiteLocale) => {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "blog-posts",
    where: {
      and: [
        { slug: { equals: slug } },
        { isPublished: { equals: true } },
      ],
    },
    depth: 2,
    limit: 1,
    locale,
  });

  return result.docs[0] ?? null;
};

const getFallbackRelatedPosts = async (
  post: BlogPost,
  locale: SiteLocale,
) => {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "blog-posts",
    where: {
      and: [
        { isPublished: { equals: true } },
        { category: { equals: post.category } },
        { id: { not_equals: post.id } },
      ],
    },
    sort: "-publishedAt",
    limit: 3,
    locale,
  });

  return result.docs;
};

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "blog-posts",
    where: { isPublished: { equals: true } },
    limit: 1000,
    pagination: false,
    depth: 0,
  });

  // One entry per (locale, slug). Locales come from payload.config.ts.
  return result.docs.flatMap((post) =>
    (["es", "en"] as const).map((locale) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const siteLocale = (locale === "en" ? "en" : "es") as SiteLocale;
  const post = await getPostBySlug(slug, siteLocale);

  if (!post) {
    return createPageMetadata({
      title: siteLocale === "en" ? "Article not found" : "Artículo no encontrado",
      description:
        siteLocale === "en"
          ? "The requested blog article could not be found."
          : "No se encontró el artículo solicitado.",
      path: `/blog/${slug}`,
      locale: siteLocale,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: toAbsoluteUrl(getCoverImageUrl(post)),
    locale: siteLocale,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const siteLocale = (locale === "en" ? "en" : "es") as SiteLocale;
  const copy = UI_COPY[siteLocale];

  const post = await getPostBySlug(slug, siteLocale);
  if (!post) notFound();

  const author = getAuthor(post.author);
  const authorAvatar = getAuthorAvatarUrl(author);
  const coverImageUrl = getCoverImageUrl(post);
  const tocItems = (post.tableOfContents ?? []) as TocItem[];

  const explicitRelated = (post.relatedPosts ?? [])
    .map(getRelatedPost)
    .filter((item): item is BlogPost => Boolean(item))
    .slice(0, 3);

  const relatedPosts =
    explicitRelated.length > 0
      ? explicitRelated
      : await getFallbackRelatedPosts(post, siteLocale);

  return (
    <>
      <BlogProgress />

      <main className="bg-gold-light min-h-screen">
        <nav className="border-b border-gold-light-active px-4 py-4 md:px-8 lg:px-16">
          <div className="mx-auto flex max-w-7xl items-center gap-2 font-gilroy text-xs text-beige-dark">
            <Link
              href={`/${locale}`}
              className="transition-colors hover:text-green-dark-active"
            >
              <Text as="span" font="gilroy" size="xs" className="text-inherit">
                {copy.home}
              </Text>
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/blog`}
              className="transition-colors hover:text-green-dark-active"
            >
              <Text as="span" font="gilroy" size="xs" className="text-inherit">
                {copy.blog}
              </Text>
            </Link>
            <span>/</span>
            <Text
              as="span"
              font="gilroy"
              size="xs"
              className="text-green-dark-active line-clamp-1"
            >
              {post.title}
            </Text>
          </div>
        </nav>

        <header className="px-4 pt-14 pb-10 md:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <Text
              as="span"
              font="gilroy"
              size="xxs"
              weight="semibold"
              className="mb-5 inline-block uppercase tracking-[0.14em] text-gold-dark"
            >
              {getCategoryLabel(post.category, siteLocale)}
            </Text>

            <Text
              as="h1"
              font="roboto"
              className="text-green-dark-active mb-7 text-[clamp(32px,5vw,58px)] leading-[1.05] font-normal tracking-tight"
            >
              {post.title}
            </Text>

            <Text
              as="p"
              font="gilroy"
              className="text-beige-darker mb-10 text-[18px] leading-[1.75]"
            >
              {post.lead}
            </Text>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {author && (
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={authorAvatar}
                      alt={author.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <Text
                      as="p"
                      font="gilroy"
                      size="sm"
                      weight="semibold"
                      className="text-green-dark-active leading-none"
                    >
                      {author.name}
                    </Text>
                    {author.role && (
                      <Text
                        as="p"
                        font="gilroy"
                        size="xs"
                        className="text-beige-dark leading-none mt-1"
                      >
                        {author.role}
                      </Text>
                    )}
                  </div>
                </div>
              )}

              <span className="h-4 w-px bg-beige-normal hidden sm:block" />

              <div className="flex items-center gap-3 font-gilroy text-sm text-beige-dark">
                <Text as="span" font="gilroy" size="sm" className="text-inherit">
                  {formatPublishedDate(post.publishedAt, siteLocale)}
                </Text>
                <span className="h-0.75 w-0.75 rounded-full bg-beige-dark" />
                <Text as="span" font="gilroy" size="sm" className="text-inherit">
                  {post.readTime}
                </Text>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 pb-10 md:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                src={coverImageUrl}
                alt={post.title}
                fill
                unoptimized
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
              />
            </div>
            {post.heroCaption && (
              <Text
                as="p"
                font="gilroy"
                size="xs"
                className="mt-3 text-center text-beige-dark italic"
              >
                {post.heroCaption}
              </Text>
            )}
          </div>
        </div>

        <div className="px-4 pb-20 md:px-8 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[56px_1fr_220px] xl:grid-cols-[64px_1fr_240px]">
            <div>
              <BlogShareSidebar />
            </div>

            <article className="blog-prose min-w-0">{renderRichText(post.content)}</article>

            <div>
              <BlogToc items={tocItems} />
            </div>
          </div>
        </div>

        {(post.tags?.length || author?.bio) && (
          <div className="border-t border-gold-light-active px-4 py-12 md:px-8 lg:px-16">
            <div className="mx-auto max-w-3xl">
              {post.tags && post.tags.length > 0 && (
                <div className="mb-10 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Text
                      key={tag.id ?? tag.label}
                      as="span"
                      font="gilroy"
                      size="xs"
                      weight="medium"
                      className="rounded-full border border-gold-light-active px-4 py-1.5 font-gilroy text-xs font-medium text-beige-darker transition-colors hover:border-gold-normal hover:text-green-dark-active cursor-default"
                    >
                      {tag.label}
                    </Text>
                  ))}
                </div>
              )}

              {author && author.bio && (
                <div className="flex gap-5 rounded-xl border border-gold-light-active bg-gold-light-hover p-6">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={authorAvatar}
                      alt={author.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Text
                      as="p"
                      font="gilroy"
                      size="xxs"
                      weight="semibold"
                      className="uppercase tracking-[0.1em] text-gold-dark mb-1"
                    >
                      {copy.aboutAuthor}
                    </Text>
                    <Text
                      as="p"
                      font="roboto"
                      size="lg"
                      weight="medium"
                      className="text-green-dark-active leading-tight mb-1"
                    >
                      {author.name}
                    </Text>
                    <Text
                      as="p"
                      font="gilroy"
                      size="sm"
                      className="text-beige-darker leading-relaxed"
                    >
                      {author.bio}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <section className="bg-gold-light-hover px-4 py-20 md:px-8 lg:px-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex items-baseline justify-between gap-4">
                <Text
                  as="h2"
                  font="roboto"
                  className="text-green-dark-active text-[28px] font-normal tracking-tight"
                >
                  {copy.relatedTitle}
                </Text>
                <Link
                  href={`/${locale}/blog`}
                  className="font-gilroy inline-flex items-center gap-2 text-sm text-beige-darker transition-all duration-200 hover:gap-3 hover:text-green-dark-active"
                >
                  <Text as="span" font="gilroy" size="sm" className="text-inherit">
                    {copy.seeAll}
                  </Text>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/${locale}/blog/${relatedPost.slug}`}
                    className="group flex flex-col gap-4"
                  >
                    <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-gold-light-active">
                      <Image
                        src={getCoverImageUrl(relatedPost)}
                        alt={relatedPost.title}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Text
                        as="span"
                        font="gilroy"
                        size="xxs"
                        weight="semibold"
                        className="uppercase tracking-[0.08em] text-gold-dark"
                      >
                        {getCategoryLabel(relatedPost.category, siteLocale)}
                      </Text>
                      <Text
                        as="h3"
                        font="roboto"
                        className="text-green-dark-active text-[20px] leading-[1.2] font-medium tracking-tight transition-colors group-hover:text-gold-dark"
                      >
                        {relatedPost.title}
                      </Text>
                      <Text
                        as="p"
                        font="gilroy"
                        className="text-beige-darker text-[14px] leading-relaxed"
                      >
                        {relatedPost.excerpt}
                      </Text>
                      <Text
                        as="span"
                        font="gilroy"
                        className="text-[13px] text-beige-dark mt-1"
                      >
                        {formatPublishedDate(relatedPost.publishedAt, siteLocale)}
                      </Text>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-green-dark-active relative overflow-hidden px-4 py-20 md:px-8 lg:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(165,153,115,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <Text
              as="p"
              font="gilroy"
              size="xs"
              weight="medium"
              className="mb-5 flex items-center justify-center gap-3 uppercase tracking-[0.15em] text-gold-light/60"
            >
              <span className="h-px w-7 bg-gold-normal" />
              {copy.ctaEyebrow}
              <span className="h-px w-7 bg-gold-normal" />
            </Text>

            <Text
              as="h2"
              font="roboto"
              className="text-gold-light mb-5 text-[clamp(28px,4.5vw,48px)] leading-[1.05] font-normal tracking-tight"
            >
              {copy.ctaTitle}
            </Text>

            <Text
              as="p"
              font="gilroy"
              className="text-gold-light/70 mx-auto mb-9 max-w-md text-[17px] leading-relaxed"
            >
              {copy.ctaBody}
            </Text>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}/properties`}
                className="font-gilroy inline-flex items-center gap-2.5 rounded-full bg-gold-normal px-7 py-3.5 text-sm font-semibold text-green-dark-active transition-all duration-200 hover:bg-gold-dark hover:gap-4"
              >
                <Text as="span" font="gilroy" size="sm" weight="semibold" className="text-inherit">
                  {copy.ctaPrimary}
                </Text>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="font-gilroy inline-flex items-center gap-2.5 rounded-full border border-gold-light/30 px-7 py-3.5 text-sm font-semibold text-gold-light transition-all duration-200 hover:border-gold-light/60 hover:gap-4"
              >
                <Text as="span" font="gilroy" size="sm" weight="semibold" className="text-inherit">
                  {copy.ctaSecondary}
                </Text>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
