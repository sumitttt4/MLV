"use client";

import { useEffect, useState } from "react";
import { CategoryTabs, type Category } from "./CategoryTabs";
import { MenuCard } from "./MenuCard";
import { getMenu, type MenuResponse } from "@/lib/api";
import type { MenuCategory } from "@/types/schema";

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory["name"]>("Starters");
  const [menuData, setMenuData] = useState<MenuResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "veg" | "non-veg">("all");

  useEffect(() => {
    getMenu().then(setMenuData);
  }, []);

  if (!menuData) return null;

  const filteredItems = menuData.items
    .filter((item) => {
      // 1. Category check
      const matchesCategory = item.categoryId === menuData.categories.find(c => c.name === activeCategory)?.id;

      // 2. Search check
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // 3. Filter Mode check (Veg/Non-Veg)
      let matchesFilter = true;
      if (filterMode === "veg") matchesFilter = item.isVeg === true;
      if (filterMode === "non-veg") matchesFilter = item.isVeg === false;

      return matchesCategory && matchesSearch && matchesFilter;
    });

  return (
    <section id="menu" className="relative z-10 min-h-screen bg-brand-dark pb-20 pt-24 text-brand-cream">
      {/* Decorative Texture Overlay */}
      <div className="absolute inset-0 bg-hero-texture opacity-30 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">

        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-gold">
            Our Specialties
          </span>
          <h2 className="mt-3 text-5xl font-serif font-bold text-brand-cream md:text-6xl drop-shadow-xl">
            Order Online
          </h2>
          <div className="mt-6 h-0.5 w-24 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto opacity-80" />
        </div>

        {/* Search & Filter Bar */}
        <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-6 md:flex-row md:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for dishes..."
              className="w-full rounded-full border border-brand-gold/20 bg-white/5 py-4 pl-12 pr-6 text-brand-cream placeholder:text-brand-cream/30 backdrop-blur-md focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setFilterMode("all")}
              className={`rounded-full border px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${filterMode === "all"
                ? "border-brand-gold bg-brand-gold text-brand-dark"
                : "border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode("veg")}
              className={`rounded-full border px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${filterMode === "veg"
                ? "border-green-500 bg-green-500 text-white"
                : "border-green-500/30 text-green-500 hover:bg-green-500/10"
                }`}
            >
              Veg
            </button>
            <button
              onClick={() => setFilterMode("non-veg")}
              className={`rounded-full border px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${filterMode === "non-veg"
                ? "border-red-500 bg-red-500 text-white"
                : "border-red-500/30 text-red-500 hover:bg-red-500/10"
                }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-40 mb-12 -mx-6 bg-brand-dark/95 px-6 py-4 shadow-xl backdrop-blur-md md:static md:bg-transparent md:p-0 md:shadow-none border-b border-brand-gold/10 md:border-none">
          <div className="mb-0 flex justify-center">
            <CategoryTabs
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center">
          <p className="font-serif italic text-brand-gold/60">
            * Taxes and charges calculated at checkout
          </p>
        </div>

        {/* Floating "View Cart" Bar for Mobile */}
        <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden">
          {/* We can reuse the CartDrawer button logic or make a wide button */}
          {/* Note: The CartDrawer FAB is already fixed at bottom right. Maybe we just need to ensure it's visible or make it a full banner like Swiggy */}
        </div>
      </div>
    </section>
  );
}
