"use client";

import { useEffect, useState } from "react";
import { Flame, ArrowUpDown } from "lucide-react";
import { CategoryTabs } from "./CategoryTabs";
import { MenuCard } from "./MenuCard";
import { getMenu, type MenuResponse } from "@/lib/api";
import type { MenuCategory, SpiceLevel } from "@/types/schema";

type PriceSort = "default" | "low-high" | "high-low";
type PriceRange = "all" | "under200" | "200-400" | "400plus";

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory["name"]>("Starters");
  const [menuData, setMenuData] = useState<MenuResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "veg" | "non-veg">("all");
  const [spiceFilter, setSpiceFilter] = useState<"all" | SpiceLevel>("all");
  const [priceSort, setPriceSort] = useState<PriceSort>("default");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");

  useEffect(() => {
    getMenu().then((data) => {
      setMenuData(data);
      if (data.categories.length > 0) {
        setActiveCategory(data.categories[0].name);
      }
    });
  }, []);

  // Loading State - Skeleton Grid
  if (!menuData) return (
    <section className="min-h-screen bg-brand-dark pt-24 pb-20 px-6">
      <div className="mx-auto max-w-7xl animate-pulse">
        {/* Search Bar Skeleton */}
        <div className="mx-auto mb-10 h-14 max-w-2xl rounded-full bg-white/5" />

        {/* Chips Skeleton */}
        <div className="mb-12 flex justify-center gap-4">
          <div className="h-10 w-24 rounded-full bg-white/5" />
          <div className="h-10 w-24 rounded-full bg-white/5" />
          <div className="h-10 w-24 rounded-full bg-white/5" />
        </div>

        {/* Filter Row Skeleton */}
        <div className="mb-8 flex justify-center gap-3">
          <div className="h-8 w-16 rounded-full bg-white/5" />
          <div className="h-8 w-16 rounded-full bg-white/5" />
          <div className="h-8 w-16 rounded-full bg-white/5" />
          <div className="h-8 w-16 rounded-full bg-white/5" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex h-32 w-full gap-4 rounded-xl bg-white/5 p-4">
              <div className="aspect-square h-full rounded-lg bg-white/10" />
              <div className="flex flex-1 flex-col gap-3 py-2">
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-white/10" />
                <div className="mt-auto h-4 w-16 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const isSearching = searchTerm.trim().length > 0;

  const filteredItems = menuData.items
    .filter((item) => {
      // 1. Category check - skip when searching across all categories
      if (!isSearching) {
        const currentCategory = menuData.categories.find(c => c.name === activeCategory);
        const matchesCategory = item.categoryId === currentCategory?.id;
        if (!matchesCategory) return false;
      }

      // 2. Search check
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // 3. Veg/Non-Veg filter
      if (filterMode === "veg" && item.isVeg !== true) return false;
      if (filterMode === "non-veg" && item.isVeg !== false) return false;

      // 4. Spice level filter
      if (spiceFilter !== "all" && item.spiceLevel !== spiceFilter) return false;

      // 5. Price range filter
      if (priceRange === "under200" && item.price >= 200) return false;
      if (priceRange === "200-400" && (item.price < 200 || item.price > 400)) return false;
      if (priceRange === "400plus" && item.price <= 400) return false;

      return true;
    })
    .sort((a, b) => {
      if (priceSort === "low-high") return a.price - b.price;
      if (priceSort === "high-low") return b.price - a.price;
      return 0;
    });

  const spiceLevels: Array<{ label: string; value: "all" | SpiceLevel }> = [
    { label: "All", value: "all" },
    { label: "Mild", value: "Mild" },
    { label: "Medium", value: "Medium" },
    { label: "Hot", value: "Hot" },
    { label: "Extra Hot", value: "Extra Hot" },
  ];

  const priceRanges: Array<{ label: string; value: PriceRange }> = [
    { label: "All", value: "all" },
    { label: "Under \u20B9200", value: "under200" },
    { label: "\u20B9200-400", value: "200-400" },
    { label: "\u20B9400+", value: "400plus" },
  ];

  const priceSortOptions: Array<{ label: string; value: PriceSort }> = [
    { label: "Default", value: "default" },
    { label: "Price: Low \u2192 High", value: "low-high" },
    { label: "Price: High \u2192 Low", value: "high-low" },
  ];

  return (
    <section id="menu" className="relative z-10 min-h-screen bg-brand-dark pb-20 pt-24 text-brand-cream">
      {/* Clean Background */}


      <div className="mx-auto max-w-7xl px-6 relative z-10">

        {/* Section Header - Hidden/Simplified for speed */}
        <div className="mb-6"></div>

        {/* Search & Veg/Non-Veg Filter Bar */}
        <div className="mx-auto mb-6 flex max-w-2xl flex-col gap-6 md:flex-row md:items-center">
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

        {/* Spice Level Filter */}
        <div className="mx-auto mb-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          <Flame className="h-4 w-4 text-orange-400" />
          {spiceLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSpiceFilter(level.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${spiceFilter === level.value
                ? "border-orange-400 bg-orange-400 text-brand-dark"
                : "border-orange-400/30 text-orange-400 hover:bg-orange-400/10"
                }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        {/* Price Range Filter */}
        <div className="mx-auto mb-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold/60">Price:</span>
          {priceRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setPriceRange(range.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${priceRange === range.value
                ? "border-brand-gold bg-brand-gold text-brand-dark"
                : "border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Price Sort */}
        <div className="mx-auto mb-8 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-brand-cream/50" />
          {priceSortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPriceSort(option.value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${priceSort === option.value
                ? "border-brand-cream bg-brand-cream/20 text-brand-cream"
                : "border-brand-cream/20 text-brand-cream/50 hover:bg-brand-cream/10"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-40 mb-8 -mx-6 bg-brand-dark/95 px-6 py-4 shadow-xl backdrop-blur-md md:static md:bg-transparent md:p-0 md:shadow-none border-b border-brand-gold/10 md:border-none">
          <div className="mb-0 flex justify-center">
            <CategoryTabs
              categories={menuData.categories}
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-sm text-brand-cream/50">
            Showing {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            {isSearching && (
              <span className="ml-1 text-brand-gold/70">across all categories</span>
            )}
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-brand-cream/40">No dishes found matching your filters.</p>
            <p className="mt-2 text-sm text-brand-cream/25">Try adjusting your search or filters.</p>
          </div>
        )}

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
