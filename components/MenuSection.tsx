"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { menuCategories, type MenuItemData, type MenuCategoryData } from "@/lib/menuData";
import { CategoryIcon } from "./CategoryIcon";
import { VariantSelector } from "./VariantSelector";
import { DietaryToggle } from "./DietaryToggle";
import { useMenuStore, type DietaryMode } from "@/store/useMenuStore";
import { useCart } from "@/store/useCart";

type FilterMode = "all" | "veg" | "non-veg";

export function MenuSection() {
  const [activeCategory, setActiveCategory] = useState<string>(menuCategories[0].id);
  const dietaryMode = useMenuStore((s) => s.dietaryMode);
  const filterMode: FilterMode = dietaryMode === "VEG" ? "veg" : dietaryMode === "NON_VEG" ? "non-veg" : "all";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isVariantSelectorOpen, setIsVariantSelectorOpen] = useState(false);
  const addItem = useCart((state) => state.addItem);
  
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navRef = useRef<HTMLDivElement>(null);
  const [isNavSticky, setIsNavSticky] = useState(false);

  // Sticky navigation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNavSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = categoryRefs.current[categoryId];
    if (element) {
      const offset = 150; // Account for sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Strict category-level filtering
  const VEG_HIDDEN_CATEGORIES = ["tandoori-non-veg", "main-non-veg"];
  const NON_VEG_HIDDEN_CATEGORIES = ["tandoori-veg", "main-veg"];

  const getVisibleCategories = () => {
    if (filterMode === "veg") {
      return menuCategories.filter((c) => !VEG_HIDDEN_CATEGORIES.includes(c.id));
    }
    if (filterMode === "non-veg") {
      return menuCategories.filter((c) => !NON_VEG_HIDDEN_CATEGORIES.includes(c.id));
    }
    return menuCategories;
  };

  const visibleCategories = getVisibleCategories();

  // Filter items based on veg/non-veg toggle (strict: hide non-matching variants)
  const getFilteredItems = (items: MenuItemData[]) => {
    if (filterMode === "all") return items;
    
    return items.filter((item) => {
      // Item with variants
      if (item.variants) {
        return item.variants.some((variant) =>
          filterMode === "veg" ? variant.isVeg === true : variant.isVeg === false
        );
      }
      // Single item
      if (filterMode === "veg") return item.isVeg === true;
      if (filterMode === "non-veg") return item.isVeg === false;
      return true;
    });
  };

  // Search across all categories
  const getSearchResults = () => {
    if (!searchTerm.trim()) return null;
    
    const results: { category: MenuCategoryData; items: MenuItemData[] }[] = [];
    
    menuCategories.forEach((category) => {
      const matchingItems = category.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingItems.length > 0) {
        results.push({ category, items: getFilteredItems(matchingItems) });
      }
    });
    
    return results;
  };

  const searchResults = getSearchResults();
  const showSearch = searchTerm.trim().length > 0;

  return (
    <section id="menu" className="min-h-screen pt-24 pb-20 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-tamarind to-brand-black pointer-events-none -z-10 opacity-50" />
      
      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-serif italic text-brand-gold text-lg">Discover Our Flavors</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-brand-cream mb-4 mt-2">
            Our Menu
          </h2>
          <div className="h-0.5 w-24 bg-brand-gold mx-auto rounded-full opacity-60"></div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/60 w-5 h-5" />
          <input
            type="text"
            placeholder="Search our menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-full bg-brand-cocoa border border-brand-gold/20 text-brand-cream placeholder:text-brand-cream/40 focus:outline-none focus:border-brand-gold transition-all shadow-md"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dietary Toggle */}
        <div className="mb-10">
          <DietaryToggle />
        </div>

        {/* Sticky Category Navigation */}
        <div ref={navRef} className="h-0"></div>
        <div
          className={`sticky top-16 sm:top-20 z-40 transition-all duration-300 mb-10 ${
            isNavSticky ? "bg-brand-tamarind/95 backdrop-blur-lg py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 shadow-xl border-b border-brand-gold/10" : ""
          }`}
        >
          <div className="overflow-x-auto scrollbar-hide py-1">
            <div className="flex gap-3 min-w-max justify-start sm:justify-center px-1">
              {visibleCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeCategory === category.id
                      ? "bg-brand-gold text-brand-dark shadow-md scale-105"
                      : "bg-brand-cocoa text-brand-cream/70 hover:bg-brand-cocoa/80 hover:text-brand-chrome border border-transparent hover:border-brand-gold/20"
                  }`}
                >
                  <CategoryIcon categoryId={category.id} className={`w-4 h-4 ${activeCategory === category.id ? "text-brand-dark" : "text-brand-gold"}`} />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results or Menu Categories */}
        {showSearch && searchResults ? (
          searchResults.length > 0 ? (
            <div className="space-y-12">
              {searchResults.map(({ category, items }) => (
                <div key={category.id}>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-cream mb-6 flex items-center gap-3 pb-4 border-b border-brand-gold/20">
                    <CategoryIcon categoryId={category.id} className="w-6 h-6 text-brand-gold" />
                    {category.name}
                  </h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <MenuItem 
                        key={item.id} 
                        item={item}
                        filterMode={filterMode}
                        onVariantSelectClick={(item) => {
                          setSelectedItem(item);
                          setIsVariantSelectorOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-brand-cocoa/30 rounded-card border border-brand-gold/10">
              <p className="text-brand-cream/60 font-serif text-lg">No items found matching &ldquo;{searchTerm}&rdquo;</p>
            </div>
          )
        ) : (
          <div className="space-y-16">
            {visibleCategories.map((category) => {
              const filteredItems = getFilteredItems(category.items);
              if (filteredItems.length === 0) return null;

              return (
                <div
                  key={category.id}
                  ref={(el) => {
                    categoryRefs.current[category.id] = el;
                  }}
                  className="scroll-mt-32"
                >
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-brand-cream mb-6 flex items-center gap-3 pb-4 border-b border-brand-gold/20">
                    <CategoryIcon categoryId={category.id} className="w-8 h-8 text-brand-gold" />
                    {category.name}
                  </h3>
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <MenuItem 
                        key={item.id} 
                        item={item}
                        filterMode={filterMode}
                        onVariantSelectClick={(item) => {
                          setSelectedItem(item);
                          setIsVariantSelectorOpen(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
              if (!selectedItem.variants) return;
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
            }}
          />
        )}
      </div>
    </section>
  );
}

interface MenuItemProps {
  item: MenuItemData;
  filterMode?: FilterMode;
  onVariantSelectClick?: (item: MenuItemData) => void;
}

function MenuItem({ item, filterMode = "all", onVariantSelectClick }: MenuItemProps) {
  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const getItemQuantity = useCart((state) => state.getItemQuantity);

  // Handle items with variants
  if (item.variants && item.variants.length > 0) {
    // When filtered to veg or non-veg, auto-resolve matching variants
    const isFiltered = filterMode === "veg" || filterMode === "non-veg";
    const matchingVariants = isFiltered
      ? item.variants.filter((v) =>
          filterMode === "veg" ? v.isVeg === true : v.isVeg === false
        )
      : item.variants;

    // If filtered and exactly one match, render inline (no modal needed)
    if (isFiltered && matchingVariants.length === 1) {
      const variant = matchingVariants[0];
      const variantIdx = item.variants.indexOf(variant);
      const variantId = `${item.id}-${variantIdx}`;
      const quantity = getItemQuantity(variantId);
      const isVeg = variant.isVeg ?? true;

      // Accent colors based on type
      const accentBorder = "hover:border-brand-gold/30";
      const accentDot = isVeg
        ? "bg-veg ring-veg/30"
        : "bg-nonveg ring-nonveg/30";
      const priceColor = "text-brand-gold";
      const addBtnClass = "bg-brand-gold text-brand-dark hover:bg-brand-cream";
      const qtyBorderClass = "border-brand-gold/40";
      const qtyBtnClass = "text-brand-gold hover:bg-brand-gold hover:text-brand-dark";
      const qtyPlusBtnClass = "bg-brand-gold text-brand-dark hover:bg-brand-cream";

      return (
        <div className={`bg-brand-cocoa rounded-card p-5 hover:shadow-lg transition-all border border-transparent ${accentBorder} group`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ${accentDot}`} />
                <h4 className="text-lg font-serif font-bold text-brand-cream group-hover:text-brand-gold transition-colors">
                  {item.name}
                </h4>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isVeg ? "bg-veg/15 text-veg" : "bg-nonveg/15 text-nonveg"
                }`}>
                  {variant.label}
                </span>
              </div>
              {item.description && (
                <p className="text-sm text-brand-cream/60 leading-relaxed max-w-xl">{item.description}</p>
              )}
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className={`${priceColor} font-bold text-lg`}>₹{variant.price}</span>
              {quantity > 0 ? (
                <div className={`flex items-center gap-2 bg-brand-tamarind rounded-lg p-1 border ${qtyBorderClass}`}>
                  <button
                    onClick={() => updateQuantity(variantId, quantity - 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded bg-brand-cocoa ${qtyBtnClass} transition-colors text-base font-bold`}
                  >
                    -
                  </button>
                  <span className={`${priceColor} font-bold text-sm min-w-[1.5rem] text-center`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(variantId, quantity + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded ${qtyPlusBtnClass} transition-colors text-base font-bold`}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    addItem({
                      id: variantId,
                      name: `${item.name} (${variant.label})`,
                      price: variant.price,
                      isVeg: isVeg,
                      imageUrl: null,
                      isAvailable: true,
                      spiceLevel: "Mild",
                      prepTime: 15,
                      description: item.description || "",
                      categoryId: "",
                      createdAt: "",
                    })
                  }
                  className={`px-5 py-2.5 rounded-lg ${addBtnClass} text-sm font-bold transition-colors shadow-md hover:shadow-lg min-h-[40px]`}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // If filtered but multiple matches, or "all" mode → show "Choose Option" modal
    return (
      <div className="bg-brand-cocoa rounded-card p-4 hover:shadow-lg transition-all border border-transparent hover:border-brand-gold/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-brand-gold uppercase tracking-wider font-bold bg-brand-tamarind/50 px-2 py-0.5 rounded-full">Customizable</span>
            </div>
            <h4 className="text-lg font-serif font-bold text-brand-cream mb-1">{item.name}</h4>
            <div className="flex flex-wrap items-center gap-3 text-sm text-brand-cream/60">
              {matchingVariants.map((v, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${v.isVeg ? "bg-veg" : "bg-nonveg"}`} />
                  {v.label} — ₹{v.price}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => onVariantSelectClick?.(item)}
            className="px-5 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-md min-h-[40px] bg-brand-gold text-brand-dark hover:bg-brand-cream"
          >
            Choose Option
          </button>
        </div>
      </div>
    );
  }

  // Single item (no variants)
  const quantity = getItemQuantity(item.id);
  const isVeg = item.isVeg ?? true;
  const hasPrice = item.price !== undefined;

  // Dynamic accent colors based on veg/non-veg
  const accentBorder = "hover:border-brand-gold/30";
  const accentDot = isVeg
    ? "bg-veg ring-veg/30"
    : "bg-nonveg ring-nonveg/30";
  const priceColor = "text-brand-gold";
  const addBtnClass = "bg-brand-gold text-brand-dark hover:bg-brand-cream";
  const qtyBorderClass = "border-brand-gold/40";
  const qtyBtnClass = "text-brand-gold hover:bg-brand-gold hover:text-brand-dark";
  const qtyPlusBtnClass = "bg-brand-gold text-brand-dark hover:bg-brand-cream";

  return (
    <div className={`bg-brand-cocoa rounded-card p-5 hover:shadow-lg transition-all border border-transparent ${accentBorder} group`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {item.isVeg !== undefined && (
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ${accentDot}`}
              />
            )}
            <h4 className="text-lg font-serif font-bold text-brand-cream group-hover:text-brand-gold transition-colors">{item.name}</h4>
          </div>
          {item.description && (
            <p className="text-sm text-brand-cream/60 leading-relaxed max-w-xl">{item.description}</p>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {hasPrice && (
            <>
              <span className={`${priceColor} font-bold text-lg`}>₹{item.price}</span>
              {quantity > 0 ? (
                <div className={`flex items-center gap-2 bg-brand-tamarind rounded-lg p-1 border ${qtyBorderClass}`}>
                  <button
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded bg-brand-cocoa ${qtyBtnClass} transition-colors text-base font-bold`}
                  >
                    -
                  </button>
                  <span className={`${priceColor} font-bold text-sm min-w-[1.5rem] text-center`}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded ${qtyPlusBtnClass} transition-colors text-base font-bold`}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price!,
                      isVeg: isVeg,
                      imageUrl: null,
                      isAvailable: true,
                      spiceLevel: "Mild",
                      prepTime: 15,
                      description: item.description || "",
                      categoryId: "",
                      createdAt: "",
                    })
                  }
                  className={`px-5 py-2.5 rounded-lg ${addBtnClass} text-sm font-bold transition-colors shadow-md hover:shadow-lg min-h-[40px]`}
                >
                  Add
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
