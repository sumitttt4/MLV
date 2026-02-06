"use client";

import clsx from "clsx";

const categories = [
  "Starters",
  "Main Course",
  "Breads",
  "Biryani",
  "Beverages"
] as const;

type Category = (typeof categories)[number];

interface CategoryTabsProps {
  activeCategory: Category;
  onChange: (category: Category) => void;
}

export function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-brand-gold/30 bg-parchment/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl gap-3 overflow-x-auto px-6 py-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={clsx(
              "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition",
              activeCategory === category
                ? "border-brand-gold bg-brand-gold text-brand-maroon"
                : "border-brand-gold/40 text-brand-maroon hover:border-brand-gold"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Category };
