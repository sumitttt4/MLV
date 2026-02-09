"use client";

import clsx from "clsx";
import type { MenuCategory } from "@/types/schema";

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string;
  onChange: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onChange }: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
      <div className="flex w-max min-w-full justify-start gap-3 px-1 md:justify-center md:px-0">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange(category.name)}
            className={clsx(
              "whitespace-nowrap rounded-full border px-5 py-2 text-sm font-bold tracking-wide transition-all",
              activeCategory === category.name
                ? "border-brand-gold bg-brand-gold text-brand-dark shadow-md scale-105"
                : "border-white/10 bg-white/5 text-brand-cream/80 hover:bg-white/10 hover:border-brand-gold/30"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}

