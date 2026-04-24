"use client";

import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  label: string;
};

type BlogTocProps = {
  items: TocItem[];
};

export const BlogToc = ({ items }: BlogTocProps) => {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="sticky top-28 hidden lg:block">
      <p className="mb-4 border-b border-gold-light-active pb-3.5 font-gilroy text-[11px] font-semibold uppercase tracking-[0.12em] text-beige-dark">
        En este artículo
      </p>
      <ul className="flex flex-col gap-3">
        {items.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block border-l-2 py-0.5 pl-3.5 font-gilroy text-sm leading-snug transition-all duration-200 ${
                activeId === id
                  ? "border-gold-normal text-green-dark-active"
                  : "border-transparent text-beige-darker hover:border-gold-light-active hover:text-green-dark-active"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};
