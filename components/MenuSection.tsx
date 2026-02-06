"use client";

import { useMemo, useState } from "react";
import { menuItems } from "@/lib/dummyData";
import { CategoryTabs, type Category } from "@/components/CategoryTabs";
import { MenuCard } from "@/components/MenuCard";

export function MenuSection() {
  const [activeCategory, setActiveCategory] =
    useState<Category>("Starters");

  const filteredItems = useMemo(
    () => menuItems.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  return (
    <section className="bg-parchment pb-16">
      <div className="mx-auto w-full max-w-6xl px-6 pt-10">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-brand-maroon">
            Order Online
          </h2>
          <p className="mt-2 max-w-xl text-sm text-brand-maroon/70">
            Choose your favorites and add them to your cart with ease.
          </p>
        </div>
      </div>
      <CategoryTabs
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />
      <div className="mx-auto mt-8 w-full max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
