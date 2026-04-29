import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { cache } from "react";

import { BlogPostView } from "@/components/templates/BlogPostView";
import {
  getCoverImageUrl,
  getRelatedPost,
} from "@/components/templates/BlogPostView/utils";
import { isPayloadAdminPreviewRequest } from "@/lib/payloadPreview";
import { createPageMetadata, toAbsoluteUrl, type SiteLocale } from "@/lib/seo";
import configPromise from "@payload-config";

import type { BlogPost } from "../../../../../payload-types";
import type { Metadata } from "next";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

// React cache deduplicates calls within a single request — generateMetadata
// and the page component both call getPostBySlug; this collapses to one DB hit.
const getPostBySlug = cache(async (slug: string, locale: SiteLocale) => {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "blog-posts",
    where: {
      and: [{ slug: { equals: slug } }, { isPublished: { equals: true } }],
    },
    depth: 2,
    limit: 1,
    locale,
  });
  return result.docs[0] ?? null;
});

const getFallbackRelatedPosts = async (
  post: BlogPost,
  locale: SiteLocale,
): Promise<BlogPost[]> => {
  const payload = await getPayload({ config: configPromise });
  const categoryId =
    typeof post.category === "object" ? post.category.id : post.category;
  const result = await payload.find({
    collection: "blog-posts",
    where: {
      and: [
        { isPublished: { equals: true } },
        { category: { equals: categoryId } },
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
      title:
        siteLocale === "en" ? "Article not found" : "Artículo no encontrado",
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
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    image: toAbsoluteUrl(getCoverImageUrl(post)),
    locale: siteLocale,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!(await isPayloadAdminPreviewRequest())) notFound();

  const { locale, slug } = await params;
  const siteLocale = (locale === "en" ? "en" : "es") as SiteLocale;

  const post = await getPostBySlug(slug, siteLocale);
  if (!post) notFound();

  const explicitRelated = (post.relatedPosts ?? [])
    .map(getRelatedPost)
    .filter((item): item is BlogPost => Boolean(item))
    .slice(0, 3);

  const relatedPosts =
    explicitRelated.length > 0
      ? explicitRelated
      : await getFallbackRelatedPosts(post, siteLocale);

  return (
    <BlogPostView
      post={post}
      relatedPosts={relatedPosts}
      locale={locale}
      siteLocale={siteLocale}
      serverURL={SERVER_URL}
    />
  );
}
