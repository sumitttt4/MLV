"use client";

import { useState } from "react";
import Link from "next/link";
import { menuCategories, type MenuItemData } from "@/lib/menuData";
import { CategoryIcon } from "./CategoryIcon";
import { VariantSelector } from "./VariantSelector";
import { useCart } from "@/store/useCart";

export function MenuPreview() {
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isVariantSelectorOpen, setIsVariantSelectorOpen] = useState(false);
  const addItem = useCart((state) => state.addItem);

  // Get featured items (2 from first 3 categories)
  const getFeaturedItems = () => {
    const items: MenuItemData[] = [];
    for (let i = 0; i < Math.min(3, menuCategories.length); i++) {
      const categoryItems = menuCategories[i].items;
      if (categoryItems.length > 0) {
        items.push(categoryItems[0]); // First item from each category
      }
    }
    return items.slice(0, 6);
  };

  const featuredItems = getFeaturedItems();

  const handleAddItem = (item: MenuItemData) => {
    if (item.variants && item.variants.length > 0) {
      setSelectedItem(item);
      setIsVariantSelectorOpen(true);
    } else if (item.price) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        isVeg: item.isVeg ?? true,
        imageUrl: null,
        isAvailable: true,
        spiceLevel: "Mild",
        prepTime: 15,
        description: item.description || "",
        categoryId: "",
        createdAt: "",
      });
    }
  };

  return (
    <>
      <section id="menu" className="py-20 px-4 sm:px-6 bg-brand-dark">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-bold text-brand-cream mb-4">
              Featured Dishes
            </h2>
            <p className="text-brand-cream/60 text-base sm:text-lg">
              Discover our hand-picked selection
            </p>
          </div>

          {/* Featured Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredItems.map((item) => {
              const hasVariants = item.variants && item.variants.length > 0;
              const priceLabel = hasVariants
                ? `₹${Math.min(...(item.variants?.map((v) => v.price) || [item.price || 0]))} - ₹${Math.max(
                    ...(item.variants?.map((v) => v.price) || [item.price || 0])
                  )}`
                : `₹${item.price}`;

              return (
                <div
                  key={item.id}
                  className="group flex flex-col justify-between h-full bg-brand-cocoa rounded-card p-5 transition-colors"
                >
                  <div>
                    {/* Price & Veg Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-[10px] text-brand-gold uppercase tracking-widest font-bold mb-1 font-sans">
                          Featured
                        </p>
                        <h3 className="text-[18px] sm:text-[20px] font-serif font-medium text-brand-cream leading-tight">
                          {item.name}
                        </h3>
                      </div>
                      {!hasVariants && item.isVeg !== undefined && (
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${
                            item.isVeg
                              ? "bg-veg"
                              : "bg-nonveg"
                          }`}
                        ></span>
                      )}
                    </div>

                    {/* Description */}
                    {item.description && !hasVariants && (
                      <p className="text-sm text-brand-cream/70 mb-4 line-clamp-2 font-sans">
                        {item.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-5">
                      <div className="text-[20px] font-semibold text-brand-gold font-sans">
                        {priceLabel}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddItem(item)}
                    className="w-full py-2.5 px-4 rounded-lg bg-brand-gold hover:bg-brand-cream text-brand-buttonText font-semibold text-[14px] uppercase tracking-[0.04em] transition-colors font-sans"
                  >
                    {hasVariants ? "Choose" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* View More Button */}
          <div className="text-center">
            <Link
              href="/menu"
              className="inline-block px-8 py-3 rounded-lg bg-brand-gold hover:bg-brand-cream text-brand-buttonText font-semibold text-[14px] uppercase tracking-[0.04em] transition-colors shadow-none font-sans"
            >
              Browse Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Variant Selector Modal */}
      {selectedItem && (
        <VariantSelector
          item={selectedItem}
          isOpen={isVariantSelectorOpen}
          onClose={() => {
            setIsVariantSelectorOpen(false);
            setSelectedItem(null);
          }}
          onSelectVariant={(variantIdx) => {
            if (selectedItem.variants) {
              const variant = selectedItem.variants[variantIdx];
              const variantId = `${selectedItem.id}-${variantIdx}`;

              addItem({
                id: variantId,
                name: `${selectedItem.name} (${variant.label})`,
                price: variant.price,
                isVeg: variant.isVeg ?? true,
                imageUrl: null,
                isAvailable: true,
                spiceLevel: "Mild",
                prepTime: 15,
                description: "",
                categoryId: "",
                createdAt: "",
              });
            }
          }}
        />
      )}
    </>
  );
}
