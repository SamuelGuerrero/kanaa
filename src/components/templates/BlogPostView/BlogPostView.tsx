"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useLivePreview } from "@payloadcms/live-preview-react";
import Image from "next/image";
import Link from "next/link";

import { Text } from "@/components/atoms";
import { BlogProgress } from "@/components/organisms/BlogProgress";
import { BlogShareSidebar } from "@/components/organisms/BlogShareSidebar";
import { BlogToc } from "@/components/organisms/BlogToc";
import { type SiteLocale } from "@/lib/seo";

import {
  formatPublishedDate,
  getAuthor,
  getAuthorAvatarUrl,
  getCategoryLabel,
  getCoverImageUrl,
  getRelatedPost,
  type RichTextNode,
  type TocItem,
} from "./utils";

import type { BlogPost } from "../../../../payload-types";
import type { ReactNode } from "react";

type BlogPostViewProps = {
  /** Initial post fetched server-side (RSC). Live preview overrides this. */
  post: BlogPost;
  /** Pre-resolved related posts (explicit relations or category fallback) */
  relatedPosts: BlogPost[];
  locale: string;
  siteLocale: SiteLocale;
  /** Server URL — passed in to avoid leaking process.env access into bundle */
  serverURL: string;
};

const UI_COPY = {
  es: {
    home: "Inicio",
    blog: "Blog",
    aboutAuthor: "Sobre la autora",
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
    aboutAuthor: "About the author",
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

/* ── Lexical → React renderer ─────────────────────────────────────────── */

// Lexical serialises element-level alignment as the string `format` on
// paragraph/heading/quote/list/listitem nodes. Text-level format on `text`
// nodes is a numeric bitmask — handled in renderTextNode.
const alignClass = (format?: number | string) => {
  if (typeof format !== "string" || format.length === 0) return "";
  switch (format) {
    case "center":
      return "text-center";
    case "right":
    case "end":
      return "text-right";
    case "left":
    case "start":
      return "text-left";
    case "justify":
      return "text-justify";
    default:
      return "";
  }
};

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(" ");

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
  children.map((child, index) =>
    renderRichTextNode(child, `${child.type}-${index}`),
  );

const renderRichTextNode = (node: RichTextNode, key: string): ReactNode => {
  switch (node.type) {
    case "text":
      return renderTextNode(node, key);
    case "linebreak":
      return <br key={key} />;
    case "paragraph":
      return (
        <Text
          key={key}
          as="p"
          font="gilroy"
          className={cn("text-beige-darker", alignClass(node.format))}
        >
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
          className={cn("text-green-dark-active", alignClass(node.format))}
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
          className={cn("blog-pullquote", alignClass(node.format))}
        >
          {renderRichTextChildren(node.children)}
        </Text>
      );
    case "list":
      if (node.tag === "ol") {
        return (
          <ol key={key} className={cn(alignClass(node.format))}>
            {renderRichTextChildren(node.children)}
          </ol>
        );
      }
      return (
        <ul key={key} className={cn(alignClass(node.format))}>
          {renderRichTextChildren(node.children)}
        </ul>
      );
    case "listitem":
      return (
        <li key={key} className={cn(alignClass(node.format))}>
          {renderRichTextChildren(node.children)}
        </li>
      );
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

/* ── Component ────────────────────────────────────────────────────────── */

export function BlogPostView({
  post: initialPost,
  relatedPosts: initialRelated,
  locale,
  siteLocale,
  serverURL,
}: BlogPostViewProps) {
  // Live preview: outside the admin iframe, `data` equals initialPost.
  // Inside the iframe, it auto-updates when the editor types.
  const { data: post } = useLivePreview<BlogPost>({
    initialData: initialPost,
    serverURL,
    depth: 2,
  });

  const copy = UI_COPY[siteLocale];

  const author = getAuthor(post.author);
  const authorAvatar = getAuthorAvatarUrl(author);
  const coverImageUrl = getCoverImageUrl(post);

  const tocItems: TocItem[] = (post.tableOfContents ?? []).map((t) => ({
    id: t.anchor,
    label: t.label,
  }));

  // For related posts we keep the server-resolved list. Live edits to the
  // related-posts field will be reflected via the post.relatedPosts array
  // when explicit relations are set; otherwise we fall back to the initial
  // server fallback.
  const explicitRelated = (post.relatedPosts ?? [])
    .map(getRelatedPost)
    .filter((item): item is BlogPost => Boolean(item))
    .slice(0, 3);
  const relatedPosts =
    explicitRelated.length > 0 ? explicitRelated : initialRelated;

  return (
    <>
      <BlogProgress />

      <main className="bg-gold-light min-h-screen pt-30">
        <nav className="border-gold-light-active border-b px-4 py-4 md:px-8 lg:px-16">
          <div className="font-gilroy text-beige-dark mx-auto flex max-w-7xl items-center gap-2 text-xs">
            <Link
              href={`/${locale}`}
              className="hover:text-green-dark-active transition-colors"
            >
              <Text as="span" font="gilroy" size="xs" className="text-inherit">
                {copy.home}
              </Text>
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/blog`}
              className="hover:text-green-dark-active transition-colors"
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
              className="text-gold-dark mb-5 inline-block tracking-[0.14em] uppercase"
            >
              {getCategoryLabel(post)}
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
                    {authorAvatar && (
                      <Image
                        src={authorAvatar}
                        alt={author.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
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
                        className="text-beige-dark mt-1 leading-none"
                      >
                        {author.role}
                      </Text>
                    )}
                  </div>
                </div>
              )}

              <span className="bg-beige-normal hidden h-4 w-px sm:block" />

              <div className="font-gilroy text-beige-dark flex items-center gap-3 text-sm">
                <Text
                  as="span"
                  font="gilroy"
                  size="sm"
                  className="text-inherit"
                >
                  {formatPublishedDate(post.publishedAt, siteLocale)}
                </Text>
                <span className="bg-beige-dark h-0.75 w-0.75 rounded-full" />
                <Text
                  as="span"
                  font="gilroy"
                  size="sm"
                  className="text-inherit"
                >
                  {post.readTime}
                </Text>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 pb-10 md:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              {coverImageUrl && (
                <Image
                  src={coverImageUrl}
                  alt={post.title}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1024px"
                />
              )}
            </div>
            {post.heroCaption && (
              <Text
                as="p"
                font="gilroy"
                size="xs"
                className="text-beige-dark mt-3 text-center italic"
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

            <article className="blog-prose min-w-0">
              {renderRichText(post.content)}
            </article>

            <div>
              <BlogToc items={tocItems} />
            </div>
          </div>
        </div>

        {((post.tags?.length ?? 0) > 0 || Boolean(author?.bio)) && (
          <div className="border-gold-light-active border-t px-4 py-12 md:px-8 lg:px-16">
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
                      className="border-gold-light-active font-gilroy text-beige-darker hover:border-gold-normal hover:text-green-dark-active cursor-default rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
                    >
                      {tag.label}
                    </Text>
                  ))}
                </div>
              )}

              {author?.bio && (
                <div className="border-gold-light-active bg-gold-light-hover flex gap-5 rounded-xl border p-6">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                    {authorAvatar && (
                      <Image
                        src={authorAvatar}
                        alt={author.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <Text
                      as="p"
                      font="gilroy"
                      size="xxs"
                      weight="semibold"
                      className="text-gold-dark mb-1 tracking-[0.1em] uppercase"
                    >
                      {copy.aboutAuthor}
                    </Text>
                    <Text
                      as="p"
                      font="roboto"
                      size="lg"
                      weight="medium"
                      className="text-green-dark-active mb-1 leading-tight"
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
                  className="font-gilroy text-beige-darker hover:text-green-dark-active inline-flex items-center gap-2 text-sm transition-all duration-200 hover:gap-3"
                >
                  <Text
                    as="span"
                    font="gilroy"
                    size="sm"
                    className="text-inherit"
                  >
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
                    <div className="bg-gold-light-active relative aspect-4/3 overflow-hidden rounded-lg">
                      {getCoverImageUrl(relatedPost) && (
                        <Image
                          src={getCoverImageUrl(relatedPost)}
                          alt={relatedPost.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Text
                        as="span"
                        font="gilroy"
                        size="xxs"
                        weight="semibold"
                        className="text-gold-dark tracking-[0.08em] uppercase"
                      >
                        {getCategoryLabel(relatedPost)}
                      </Text>
                      <Text
                        as="h3"
                        font="roboto"
                        className="text-green-dark-active group-hover:text-gold-dark text-[20px] leading-[1.2] font-medium tracking-tight transition-colors"
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
                        className="text-beige-dark mt-1 text-[13px]"
                      >
                        {formatPublishedDate(
                          relatedPost.publishedAt,
                          siteLocale,
                        )}
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
              className="text-gold-light/60 mb-5 flex items-center justify-center gap-3 tracking-[0.15em] uppercase"
            >
              <span className="bg-gold-normal h-px w-7" />
              {copy.ctaEyebrow}
              <span className="bg-gold-normal h-px w-7" />
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
                className="font-gilroy bg-gold-normal text-green-dark-active hover:bg-gold-dark inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:gap-4"
              >
                <Text
                  as="span"
                  font="gilroy"
                  size="sm"
                  weight="semibold"
                  className="text-inherit"
                >
                  {copy.ctaPrimary}
                </Text>
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="font-gilroy border-gold-light/30 text-gold-light hover:border-gold-light/60 inline-flex items-center gap-2.5 rounded-full border px-7 py-3.5 text-sm font-semibold transition-all duration-200 hover:gap-4"
              >
                <Text
                  as="span"
                  font="gilroy"
                  size="sm"
                  weight="semibold"
                  className="text-inherit"
                >
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
