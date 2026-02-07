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
  activeCategory: string;
  onChange: (category: string) => void;
}

export function CategoryTabs({ activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 md:pb-0">
      <div className="flex w-full justify-start gap-3 md:justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={clsx(
              "whitespace-nowrap rounded-full border px-6 py-2.5 text-sm font-bold tracking-wide transition-all",
              activeCategory === category
                ? "border-brand-gold bg-brand-gold text-brand-dark shadow-lg shadow-brand-gold/20 scale-105"
                : "border-white/10 bg-white/5 text-brand-cream hover:border-brand-gold/50 hover:bg-white/10"
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
