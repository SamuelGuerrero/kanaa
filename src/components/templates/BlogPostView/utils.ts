import type { SiteLocale } from "@/lib/seo";
import type {
  Author,
  BlogPost,
  Category,
  Media,
} from "../../../../payload-types";

export type RichTextNode = {
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

export type TocItem = {
  id: string;
  label: string;
};

export const formatPublishedDate = (
  value: string | null | undefined,
  locale: SiteLocale,
) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const getMediaUrl = (media?: number | Media | null) =>
  media && typeof media === "object" && media.url ? media.url : null;

export const getAuthor = (
  author: number | Author | null | undefined,
): Author | null => (author && typeof author === "object" ? author : null);

export const getRelatedPost = (
  post: number | BlogPost | null | undefined,
): BlogPost | null => (post && typeof post === "object" ? post : null);

export const getCategoryRelation = (post: BlogPost): Category | null =>
  post.category && typeof post.category === "object" ? post.category : null;

export const getCategoryLabel = (post: BlogPost) =>
  getCategoryRelation(post)?.label ?? "";

export const getCoverImageUrl = (post: BlogPost) =>
  getMediaUrl(post.coverImage) ?? post.coverImageUrl ?? "";

export const getAuthorAvatarUrl = (author: Author | null) =>
  getMediaUrl(author?.avatar) ?? author?.avatarUrl ?? "";
