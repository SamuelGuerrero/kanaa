# Strapi i18n Integration Plan — Kanaa Home Page

## Context

The project is a Next.js 15 App Router app with locale-prefixed URLs (`/es/...`, `/en/...`).
The current i18n system uses a custom `LanguageProvider` with a Spanish-key → English-value
dictionary in `src/i18n/translations.ts`. The goal is to move hardcoded content from the
Home page (and potentially other pages) into Strapi CMS.

---

## Current Hardcoded Content in Home (`src/app/[locale]/page.tsx`)

| Component | Content |
|---|---|
| `Hero` | Title, subtitle |
| `InfoSection` (x2) | Title, description, button text |
| `KeyMetrics` | 4 metrics: value + label each |
| `FeaturedProperties` | Section title, subtitle |
| `BackedExperience` | Section title, subtitle + 9 testimonials (name, quote, avatar, rating) |
| `GuideAndTips` | Section title, subtitle + 3 article cards (title, category, date, image) |
| `FrequentlyQuestions` | 9 FAQ entries (question + answer) — from `src/data/faqData.ts` |

---

## Recommended Approach: Strapi i18n Plugin (Option A)

### Why this option
- Strapi has a built-in Internationalization plugin
- Content editors can manage ES and EN versions independently from the Strapi panel
- The Next.js app fetches content using `?locale=es` or `?locale=en` based on the URL
- Eliminates the need for `translations.ts` for CMS-managed content

### How the locale flows
```
URL: /es/  → params.locale = "es" → fetch Strapi with ?locale=es → returns Spanish content
URL: /en/  → params.locale = "en" → fetch Strapi with ?locale=en → returns English content
```

---

## Strapi Content Types to Create

### 1. `home-page` (Single Type)
Fields:
- `heroTitle` (Text)
- `heroSubtitle` (Text)
- `featuredTitle` (Text)
- `featuredSubtitle` (Text)
- `pmTitle` (Text) — Property Management section
- `pmDescription` (Long text)
- `pmButtonText` (Text)
- `calcTitle` (Text) — Calculator section
- `calcDescription` (Long text)
- `calcButtonText` (Text)
- `backedTitle` (Text)
- `backedSubtitle` (Text)
- `guidesTitle` (Text)
- `guidesSubtitle` (Text)

Enable i18n: ✅

---

### 2. `metric` (Collection Type)
Fields:
- `value` (Text) — e.g. `+1,300`
- `label` (Text) — e.g. `Huéspedes felices`
- `order` (Number) — for sorting
- `page` (Text) — e.g. `home`, `calculator` (to filter by page)

Enable i18n: ✅

---

### 3. `testimonial` (Collection Type)
Fields:
- `name` (Text)
- `role` (Text)
- `rating` (Number, 1–5)
- `testimonial` (Long text)
- `avatarUrl` (Text)

Enable i18n: ✅ (for `role` and `testimonial` fields at minimum)

---

### 4. `guide-card` (Collection Type) — future blog
Fields:
- `title` (Text)
- `category` (Text)
- `date` (Date)
- `image` (Media)
- `slug` (UID)

Enable i18n: ✅

---

### 5. `faq-entry` (Collection Type)
Fields:
- `question` (Text)
- `answer` (Long text)
- `page` (Text) — e.g. `home`, `calculator`
- `order` (Number)

Enable i18n: ✅

---

## Next.js Integration Pattern

### Strapi fetch utility (`src/lib/strapi.ts`)
```ts
const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function strapiGet<T>(path: string, locale: string): Promise<T> {
  const url = new URL(`${STRAPI_URL}/api/${path}`);
  url.searchParams.set("locale", locale);
  url.searchParams.set("populate", "*");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });

  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  const json = await res.json();
  return json.data as T;
}
```

### Usage in Home page (`src/app/[locale]/page.tsx`)
```ts
export default async function HomePage({ params }) {
  const { locale } = await params;

  const [homePage, metrics, testimonials, faqs] = await Promise.all([
    strapiGet("home-page", locale),
    strapiGet("metrics?filters[page][$eq]=home&sort=order:asc", locale),
    strapiGet("testimonials", locale),
    strapiGet("faq-entries?filters[page][$eq]=home&sort=order:asc", locale),
  ]);

  return (
    <main>
      <Hero title={homePage.heroTitle} subtitle={homePage.heroSubtitle} />
      <FeaturedProperties title={homePage.featuredTitle} />
      <KeyMetrics metrics={metrics} />
      <BackedExperience
        title={homePage.backedTitle}
        testimonials={testimonials}
      />
      <FrequentlyQuestions data={faqs} />
    </main>
  );
}
```

---

## Environment Variables Needed
```env
STRAPI_URL=http://localhost:1337         # or production URL
STRAPI_API_TOKEN=your-api-token-here
```

---

## Migration Steps

1. **Install and run Strapi** (v5 recommended, compatible with Next.js 15)
2. **Enable i18n plugin** in Strapi → Settings → Internationalization → add `es` and `en`
3. **Create content types** listed above with i18n enabled
4. **Fill content** in both locales via Strapi admin panel
5. **Create `src/lib/strapi.ts`** fetch utility
6. **Update components** to accept props instead of hardcoded strings
7. **Update pages** to fetch from Strapi and pass data as props
8. **Add env vars** to `.env.local` and Vercel

---

## What Stays Outside Strapi

| Content | Source |
|---|---|
| Property listings | Hostaway API (`/api/hostaway/listings`) |
| Property details, pricing, availability | Hostaway API |
| UI layout, styles, design tokens | Code (Tailwind) |
| Lead form submissions | Custom API routes (`/api/leads/...`) |

---

## Alternative: Option B (simpler, no dual-locale editing)

If the client only manages content in Spanish and translations are handled by the dev team:
- Store all content in Spanish in Strapi (no i18n plugin needed)
- Keep using `translateText()` from `src/i18n/translations.ts`
- Add new Strapi-sourced strings to `translations.ts` as needed
- Simpler Strapi setup, but translations remain in code
