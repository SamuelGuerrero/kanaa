import Link from "next/link";

type Category = { value: string; label: string };

type BlogFiltersProps = {
  /** /[locale]/blog — used as form action and link base */
  basePath: string;
  /** Selected category value, or undefined for "Todos" */
  currentCategory?: string;
  /** Current search query, used to seed the input */
  currentSearch?: string;
  /** Categories to render as pills (value + localized label) */
  categories: Category[];
  /** Localized labels for the chrome */
  copy: { allLabel: string; searchPlaceholder: string };
};

const buildQs = (params: Record<string, string | undefined>) => {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v.length > 0) usp.set(k, v);
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
};

export function BlogFilters({
  basePath,
  currentCategory,
  currentSearch,
  categories,
  copy,
}: BlogFiltersProps) {
  const pillClass = (active: boolean) =>
    `rounded-full border px-[18px] py-2.5 text-sm font-medium font-gilroy transition-all duration-200 ${
      active
        ? "border-green-dark-active bg-green-dark-active text-gold-light"
        : "border-gold-light-active text-beige-darker hover:border-green-dark-active hover:text-green-dark-active"
    }`;

  return (
    <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-gold-light-active pt-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href={`${basePath}${buildQs({ q: currentSearch })}`}
            className={pillClass(!currentCategory)}
          >
            {copy.allLabel}
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.value}>
            <Link
              href={`${basePath}${buildQs({ cat: cat.value, q: currentSearch })}`}
              className={pillClass(currentCategory === cat.value)}
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>

      <form action={basePath} method="GET" className="relative w-[280px]">
        {currentCategory && (
          <input type="hidden" name="cat" value={currentCategory} />
        )}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-beige-dark pointer-events-none"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          name="q"
          defaultValue={currentSearch ?? ""}
          placeholder={copy.searchPlaceholder}
          className="w-full rounded-full border border-gold-light-active bg-transparent py-3 pl-11 pr-4 font-gilroy text-sm text-green-dark-active placeholder:text-beige-dark focus:border-green-dark-active focus:outline-none"
        />
      </form>
    </div>
  );
}
