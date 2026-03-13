const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? '';

type StrapiResponse<T> = {
  data: T;
  meta?: { pagination?: { page: number; pageSize: number; pageCount: number; total: number } };
};

type StrapiMedia = {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string | null;
};

export async function strapiGet<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T | null> {
  const url = new URL(`/api/${endpoint}`, STRAPI_URL);
  url.searchParams.set('populate', '*');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
    next: { tags: [endpoint] },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as StrapiResponse<T>;
  return json.data ?? null;
}

export function mediaUrl(media: StrapiMedia | null | undefined): string | null {
  if (!media?.url) return null;
  if (media.url.startsWith('http')) return media.url;
  return `${STRAPI_URL}${media.url}`;
}

// ─── Shared component types ───────────────────────────────────────────────────

type FeatureItem = { title?: string; text: string };
type ExperienceStep = { title?: string; description?: string };

// ─── Home Types ───────────────────────────────────────────────────────────────

export type HomeHero = {
  title: string;
  subtitle: string;
  background_image?: StrapiMedia;
};

export type HomeFeaturedProperties = {
  title: string;
  subtitle: string;
  button_label: string;
};

export type HomeValueProposition = {
  title: string;
  description: string;
  button_label: string;
  left_image?: StrapiMedia;
  right_image?: StrapiMedia;
};

export type HomeInfoSection = {
  slug: string;
  title: string;
  description: string;
  button_label: string;
  button_href: string;
  image?: StrapiMedia;
  image_position: 'left' | 'right';
  order: number;
};

export type KeyMetric = {
  value: string;
  label: string;
  order: number;
};

export type HomeBackedExperience = {
  title: string;
  subtitle: string;
};

export type StrapiTestimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar_url?: string;
  order: number;
};

export type HomeGuidesSection = {
  title: string;
  subtitle: string;
  button_label: string;
};

export type GuideCard = {
  id: number;
  title: string;
  category: string;
  slug: string;
  date?: string;
  image?: StrapiMedia;
  order: number;
};

export type HomeFaqSection = {
  title: string;
  subtitle: string;
};

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  page: string;
  order: number;
};

// ─── Phase 3 Types ────────────────────────────────────────────────────────────

export type AboutPage = {
  hero_title: string;
  hero_subtitle?: string;
  hero_button_label?: string;
  experience_title?: string;
  experience_subtitle?: string;
  experience_steps?: ExperienceStep[];
  who_title?: string;
  who_description?: string;
  who_button_label?: string;
  who_image?: StrapiMedia;
  why_title?: string;
  why_description?: string;
  why_button_label?: string;
  why_image?: StrapiMedia;
  join_title?: string;
  join_description?: string;
  join_button_label?: string;
  join_image?: StrapiMedia;
};

export type ContactPage = {
  form_title?: string;
  form_description?: string;
  join_title?: string;
  join_description?: string;
  join_button_label?: string;
  join_image?: StrapiMedia;
};

export type JoinPage = {
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: StrapiMedia;
  team_title?: string;
  team_subtitle?: string;
  ideal_title?: string;
  ideal_description?: string;
  ideal_email?: string;
};

export type JobVacancy = {
  id: number;
  title: string;
  job_type: string;
  description: string;
  order: number;
};

export type PropertyManagementPage = {
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: StrapiMedia;
  intelligent_title?: string;
  intelligent_description?: string;
  section1_title?: string;
  section1_description?: string;
  section1_button_label?: string;
  section1_image?: StrapiMedia;
  management_title?: string;
  management_description?: string;
  management_features?: FeatureItem[];
  section2_title?: string;
  section2_description?: string;
  section2_button_label?: string;
  section2_image?: StrapiMedia;
  real_potential_title?: string;
  real_potential_description?: string;
};

export type CalculatorPage = {
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: StrapiMedia;
  why_title?: string;
  why_description?: string;
  why_features?: FeatureItem[];
  why_image?: StrapiMedia;
  revenue_title?: string;
  revenue_description?: string;
  revenue_features?: FeatureItem[];
  revenue_image?: StrapiMedia;
  booking_title?: string;
  booking_description?: string;
  booking_features?: FeatureItem[];
  booking_image?: StrapiMedia;
  real_potential_title?: string;
  real_potential_description?: string;
};

export type BlogPage = { heading?: string; coming_soon?: string };
export type VacanciesPage = { heading?: string; coming_soon?: string };
export type BookingConfirmationPage = { heading?: string; subtitle?: string };
export type BookingSuccessPage = { heading?: string; subtitle?: string };

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getHomeData(locale: string) {
  const [
    hero,
    featuredProperties,
    valueProposition,
    backedExperience,
    guidesSection,
    faqSection,
    infoSections,
    metrics,
    testimonials,
    guideCards,
    faqItems,
  ] = await Promise.all([
    strapiGet<HomeHero>('home-heroes', { locale }),
    strapiGet<HomeFeaturedProperties>('home-featured-properties-list', { locale }),
    strapiGet<HomeValueProposition>('home-value-propositions', { locale }),
    strapiGet<HomeBackedExperience>('home-backed-experiences', { locale }),
    strapiGet<HomeGuidesSection>('home-guides-sections', { locale }),
    strapiGet<HomeFaqSection>('home-faq-sections', { locale }),
    strapiGet<HomeInfoSection[]>('home-info-sections', { locale, 'sort[0]': 'order:asc' }),
    strapiGet<KeyMetric[]>('key-metrics', { locale, 'sort[0]': 'order:asc' }),
    strapiGet<StrapiTestimonial[]>('testimonials', { 'sort[0]': 'order:asc' }),
    strapiGet<GuideCard[]>('guide-cards', { locale, 'sort[0]': 'order:asc' }),
    strapiGet<FaqItem[]>('faq-items', {
      locale,
      'filters[page][$eq]': 'home',
      'sort[0]': 'order:asc',
    }),
  ]);

  return {
    hero,
    featuredProperties,
    valueProposition,
    backedExperience,
    guidesSection,
    faqSection,
    infoSections: infoSections ?? [],
    metrics: metrics ?? [],
    testimonials: testimonials ?? [],
    guideCards: guideCards ?? [],
    faqItems: faqItems ?? [],
  };
}

export async function getAboutData(locale: string) {
  return strapiGet<AboutPage>('about-pages', { locale });
}

export async function getContactData(locale: string) {
  return strapiGet<ContactPage>('contact-pages', { locale });
}

export async function getJoinData(locale: string) {
  const [page, vacancies] = await Promise.all([
    strapiGet<JoinPage>('join-pages', { locale }),
    strapiGet<JobVacancy[]>('job-vacancies', { locale, 'sort[0]': 'order:asc' }),
  ]);
  return { page, vacancies: vacancies ?? [] };
}

export async function getPropertyManagementData(locale: string) {
  return strapiGet<PropertyManagementPage>('property-management-pages', { locale });
}

export async function getCalculatorData(locale: string) {
  return strapiGet<CalculatorPage>('calculator-pages', { locale });
}

export async function getBlogPageData(locale: string) {
  return strapiGet<BlogPage>('blog-pages', { locale });
}

export async function getVacanciesPageData(locale: string) {
  return strapiGet<VacanciesPage>('vacancies-pages', { locale });
}

export async function getBookingConfirmationData(locale: string) {
  return strapiGet<BookingConfirmationPage>('booking-confirmation-pages', { locale });
}

export async function getBookingSuccessData(locale: string) {
  return strapiGet<BookingSuccessPage>('booking-success-pages', { locale });
}

// ─── UI Strings ───────────────────────────────────────────────────────────────

type UiString = { key: string; value: string };

/**
 * Returns a flat map of { [key]: value } for the given locale.
 * Used by LanguageProvider to override/extend translations.ts at runtime.
 */
export async function getUiStrings(locale: string): Promise<Record<string, string>> {
  const items = await strapiGet<UiString[]>('ui-strings', {
    locale,
    'pagination[pageSize]': '500',
  });
  if (!items) return {};
  return Object.fromEntries(items.map((s) => [s.key, s.value]));
}
