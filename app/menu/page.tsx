'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, X, Grid3x3, List, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { menuCategories, type MenuItemData, type MenuCategoryData } from '@/lib/menuData';
import { CategoryIcon } from '@/components/CategoryIcon';
import { VariantSelector } from '@/components/VariantSelector';
import { DietaryToggle } from '@/components/DietaryToggle';
import { useMenuStore } from '@/store/useMenuStore';
import { useCart } from '@/store/useCart';
import { useCartDrawer } from '@/store/useCartDrawer';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type FilterMode = 'all' | 'veg' | 'non-veg';
type ViewMode = 'grid' | 'list';

export default function MenuPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const dietaryMode = useMenuStore((s) => s.dietaryMode);
  const filterMode: FilterMode = dietaryMode === 'VEG' ? 'veg' : dietaryMode === 'NON_VEG' ? 'non-veg' : 'all';
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItemData | null>(null);
  const [isVariantSelectorOpen, setIsVariantSelectorOpen] = useState(false);

  // Strict category-level filtering
  const VEG_HIDDEN_CATEGORIES = ['tandoori-non-veg', 'main-non-veg'];
  const NON_VEG_HIDDEN_CATEGORIES = ['tandoori-veg', 'main-veg'];

  // Get all items across visible categories
  const getAllItems = () => {
    const items: (MenuItemData & { category: MenuCategoryData })[] = [];
    const visibleCategories = filterMode === 'veg'
      ? menuCategories.filter((c) => !VEG_HIDDEN_CATEGORIES.includes(c.id))
      : filterMode === 'non-veg'
        ? menuCategories.filter((c) => !NON_VEG_HIDDEN_CATEGORIES.includes(c.id))
        : menuCategories;

    visibleCategories.forEach((category) => {
      category.items.forEach((item) => {
        items.push({ ...item, category });
      });
    });
    return items;
  };

  const allItems = getAllItems();

  // Filter items based on search, category, and veg/non-veg (strict variant hiding)
  const filteredItems = allItems.filter((item) => {
    // Category filter
    if (selectedCategory && item.category.id !== selectedCategory) return false;

    // Search filter
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Veg/Non-Veg filter
    if (filterMode === 'all') return true;

    if (item.variants) {
      return item.variants.some((variant) =>
        filterMode === 'veg' ? variant.isVeg === true : variant.isVeg === false
      );
    }

    if (filterMode === 'veg') return item.isVeg === true;
    if (filterMode === 'non-veg') return item.isVeg === false;
    return true;
  });

  return (
    <main className="min-h-screen">
      {/* Header Section with Search */}
      <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-brand-tamarind">
        <div className="relative mx-auto max-w-7xl">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-[44px] sm:text-[52px] font-serif font-medium text-brand-cream mb-4">
              Browse Menu
            </h1>
            <p className="text-[18px] text-brand-cream/80 max-w-2xl mx-auto font-sans">
              Discover our finest selection of authentic culinary creations
            </p>
          </div>

          {/* Powerful Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-10">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-gold/50 w-5 h-5 group-focus-within:text-brand-gold transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search by dish name, ingredients, or cuisine type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-14 py-4 rounded-lg bg-brand-cocoa border-none text-brand-cream placeholder:text-brand-cream/40 focus:outline-none focus:ring-1 focus:ring-brand-gold transition-all duration-200 text-base font-sans"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-cream/40 hover:text-brand-cream transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          {searchTerm && (
            <div className="text-center mb-0">
              <p className="text-brand-gold font-semibold text-lg font-sans">
                {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-brand-tamarind sticky top-0 z-20 border-b border-white/5 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 flex-shrink-0 font-sans ${
                  selectedCategory === null
                    ? 'bg-brand-gold text-brand-buttonText'
                    : 'bg-brand-cocoa text-brand-cream hover:bg-white/10'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                </svg>
                All Categories
              </button>
              {(filterMode === 'veg'
                ? menuCategories.filter((c) => !VEG_HIDDEN_CATEGORIES.includes(c.id))
                : filterMode === 'non-veg'
                  ? menuCategories.filter((c) => !NON_VEG_HIDDEN_CATEGORIES.includes(c.id))
                  : menuCategories
              ).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 flex-shrink-0 font-sans ${
                    selectedCategory === category.id
                      ? 'bg-brand-gold text-brand-buttonText'
                      : 'bg-brand-cocoa text-brand-cream hover:bg-white/10'
                  }`}
                >
                  <CategoryIcon categoryId={category.id} className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & View Controls - Sticky */}
      <div className="sticky top-[60px] z-10 bg-brand-tamarind/95 backdrop-blur border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Dietary Toggle */}
            <DietaryToggle />

            {/* Active Category Badge */}
            {selectedCategory && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-cream/60 font-sans">Category:</span>
                <div className="px-3 py-1.5 rounded-lg bg-brand-cocoa flex items-center gap-2 border border-brand-gold/10">
                  <CategoryIcon 
                    categoryId={selectedCategory} 
                    className="w-4 h-4 text-brand-gold"
                  />
                  <span className="text-sm font-semibold text-brand-gold font-sans">
                    {menuCategories.find(c => c.id === selectedCategory)?.name}
                  </span>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-2 text-brand-cream/60 hover:text-brand-cream transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex gap-2 ml-auto sm:ml-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-brand-gold text-brand-buttonText'
                    : 'bg-brand-cocoa text-brand-cream/60 hover:bg-white/10'
                }`}
                title="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-brand-gold text-brand-buttonText'
                    : 'bg-brand-cocoa text-brand-cream/60 hover:bg-white/10'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {filteredItems.length === 0 ? (
          // Empty State
          <div className="text-center py-24">
            <div className="text-6xl mb-6 opacity-50 inline-block">
              <svg className="w-16 h-16 mx-auto text-brand-gold/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 1h-8C6.12 1 5 2.12 5 3.5v17C5 21.88 6.12 23 7.5 23h8c1.38 0 2.5-1.12 2.5-2.5v-17C18 2.12 16.88 1 15.5 1zm-4 21c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4.5-4H7V4h9v14z"/>
              </svg>
            </div>
            <h3 className="text-3xl font-serif font-bold text-brand-cream mb-3">No dishes found</h3>
            <p className="text-brand-cream/60 max-w-md mx-auto text-lg mb-8">
              {searchTerm
                ? `We couldn't find "${searchTerm}". Try searching with different keywords.`
                : 'Browse our menu to get started.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-8 py-3 rounded-lg bg-brand-gold text-brand-dark font-bold hover:bg-brand-cream transition-all duration-200 shadow-lg shadow-brand-gold/20"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {filteredItems.map((item) => (
              <MenuItemCard
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
        ) : (
          // List View
          <div className="space-y-3 max-w-4xl mx-auto">
            {filteredItems.map((item) => (
              <MenuItemListRow
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
        )}
      </div>

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
              const addItem = useCart.getState().addItem;
              
              addItem({
                id: variantId,
                name: `${selectedItem.name} (${variant.label})`,
                price: variant.price,
                isVeg: variant.isVeg ?? true,
                imageUrl: null,
                isAvailable: true,
                spiceLevel: 'Mild',
                prepTime: 15,
                description: '',
                categoryId: '',
                createdAt: '',
              });
            }
          }}
        />
      )}
    </main>
  );
}

// Chameleon color map for buttons based on dietary mode
const CHAMELEON_BUTTON: Record<FilterMode, string> = {
  all: 'bg-brand-gold hover:bg-brand-cream text-brand-dark',
  veg: 'bg-brand-gold hover:bg-brand-cream text-brand-dark',
  'non-veg': 'bg-brand-gold hover:bg-brand-cream text-brand-dark',
};

interface MenuItemCardProps {
  item: MenuItemData & { category: MenuCategoryData };
  filterMode: FilterMode;
  onVariantSelectClick?: (item: MenuItemData) => void;
}

function MenuItemCard({ item, filterMode, onVariantSelectClick }: MenuItemCardProps) {
  const isVeg = item.isVeg ?? true;
  const hasVariants = item.variants && item.variants.length > 0;
  const openCart = useCartDrawer((s) => s.open);
  const [justAdded, setJustAdded] = useState(false);

  // Variant stripping: only show matching variants in filtered mode
  const isFiltered = filterMode === 'veg' || filterMode === 'non-veg';
  const visibleVariants = hasVariants
    ? filterMode === 'veg'
      ? item.variants!.filter((v) => v.isVeg === true)
      : filterMode === 'non-veg'
        ? item.variants!.filter((v) => v.isVeg === false)
        : item.variants!
    : [];

  // Auto-resolve: if filtered and exactly 1 matching variant, treat as single item
  const autoResolved = isFiltered && visibleVariants.length === 1;
  const resolvedVariant = autoResolved ? visibleVariants[0] : null;
  const resolvedVariantIdx = resolvedVariant ? item.variants!.indexOf(resolvedVariant) : -1;
  const resolvedId = resolvedVariant ? `${item.id}-${resolvedVariantIdx}` : item.id;
  const resolvedPrice = resolvedVariant ? resolvedVariant.price : item.price;
  const resolvedIsVeg = resolvedVariant ? (resolvedVariant.isVeg ?? true) : isVeg;

  // Show "Choose Option" only when multiple variants visible
  const showVariantPicker = hasVariants && !autoResolved && visibleVariants.length > 0;

  // Cart hooks — subscribe to items array so re-render fires on cart change
  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const quantity = useCart((state) =>
    state.items.find((e) => e.item.id === resolvedId)?.quantity ?? 0
  );

  const handleAddItem = () => {
    const price = resolvedPrice;
    if (price === undefined) return;
    const itemName = resolvedVariant ? `${item.name} (${resolvedVariant.label})` : item.name;
    addItem({
      id: resolvedId,
      name: itemName,
      price,
      isVeg: resolvedIsVeg,
      imageUrl: null,
      isAvailable: true,
      spiceLevel: 'Mild',
      prepTime: 15,
      description: item.description || '',
      categoryId: '',
      createdAt: '',
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
    toast.success(`${itemName} added`, {
      description: `₹${price} · Tap View Cart to review`,
      duration: 2000,
      position: 'top-center',
    });
  };

  const handleVariantSelect = () => {
    if (onVariantSelectClick) {
      onVariantSelectClick(item);
    }
  };

  return (
    <div className={`group relative flex flex-col justify-between w-full rounded-card bg-brand-cocoa p-5 transition-all duration-300 ${quantity > 0 ? 'ring-1 ring-brand-gold/30' : ''}`}>
      <div>
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3 opacity-60">
          <CategoryIcon categoryId={item.category.id} className="w-4 h-4 text-brand-gold" />
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest font-sans">
            {item.category.name}
          </span>
        </div>

        {/* Item Name & Veg/Non-Veg */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-[18px] sm:text-[20px] font-serif font-medium text-brand-cream leading-tight">
            {item.name}
          </h3>
          {(autoResolved || (!hasVariants && item.isVeg !== undefined)) && (
            <span
              className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                resolvedIsVeg ? 'bg-veg' : 'bg-nonveg'
              }`}
            ></span>
          )}
        </div>

        {/* Description */}
        {item.description && !showVariantPicker && (
          <p className="text-sm text-brand-cream/70 mb-4 line-clamp-2 font-sans">{item.description}</p>
        )}

        {/* Auto-resolved variant label */}
        {autoResolved && resolvedVariant && (
          <p className="text-xs text-brand-cream/50 mb-2 font-sans">{resolvedVariant.label}</p>
        )}

        {/* Variants or Price */}
        {showVariantPicker ? (
          <div className="space-y-2 mb-4 bg-brand-dark/10 rounded-lg p-2">
            {visibleVariants.map((variant, idx) => (
              <div key={idx} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      variant.isVeg ? 'bg-veg' : 'bg-nonveg'
                    }`}
                  ></span>
                  <span className="text-xs text-brand-cream/80 font-sans">{variant.label}</span>
                </div>
                <span className="text-brand-gold font-semibold text-sm font-sans">₹{variant.price}</span>
              </div>
            ))}
          </div>
        ) : (resolvedPrice !== undefined) ? (
          <div className="mb-4">
            <div className="text-[20px] font-semibold text-brand-gold font-sans">₹{resolvedPrice}</div>
          </div>
        ) : null}
      </div>

      {/* Action Button — with quantity controls */}
      {showVariantPicker ? (
        <button
          onClick={handleVariantSelect}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-[14px] uppercase tracking-[0.04em] transition-colors font-sans ${CHAMELEON_BUTTON[filterMode]}`}
        >
          Choose Option
        </button>
      ) : (resolvedPrice !== undefined) ? (
        quantity > 0 ? (
          <div className="space-y-2">
            {/* Quantity row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-brand-tamarind rounded-lg p-1 border border-brand-gold/30">
                <button
                  onClick={() => updateQuantity(resolvedId, quantity - 1)}
                  className="w-9 h-9 flex items-center justify-center rounded bg-brand-cocoa text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors text-base font-bold"
                >
                  -
                </button>
                <span className="text-brand-gold font-bold text-sm min-w-[1.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(resolvedId, quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded bg-brand-gold text-brand-dark hover:bg-brand-cream transition-colors text-base font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-bold text-brand-gold font-sans">₹{resolvedPrice! * quantity}</span>
            </div>
            {/* View Cart CTA */}
            <button
              onClick={openCart}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider hover:bg-brand-gold/20 transition-all"
            >
              <ShoppingBag size={13} />
              View Cart
              <ArrowRight size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddItem}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-[14px] uppercase tracking-[0.04em] transition-colors font-sans ${CHAMELEON_BUTTON[filterMode]}`}
          >
            Add to Cart
          </button>
        )
      ) : null}
    </div>
  );
}

interface MenuItemListRowProps {
  item: MenuItemData & { category: MenuCategoryData };
  filterMode: FilterMode;
  onVariantSelectClick?: (item: MenuItemData) => void;
}

function MenuItemListRow({ item, filterMode, onVariantSelectClick }: MenuItemListRowProps) {
  const isVeg = item.isVeg ?? true;
  const hasVariants = item.variants && item.variants.length > 0;
  const openCart = useCartDrawer((s) => s.open);

  // Variant stripping
  const isFiltered = filterMode === 'veg' || filterMode === 'non-veg';
  const visibleVariants = hasVariants
    ? filterMode === 'veg'
      ? item.variants!.filter((v) => v.isVeg === true)
      : filterMode === 'non-veg'
        ? item.variants!.filter((v) => v.isVeg === false)
        : item.variants!
    : [];

  // Auto-resolve: if filtered and exactly 1 matching variant, treat as single item
  const autoResolved = isFiltered && visibleVariants.length === 1;
  const resolvedVariant = autoResolved ? visibleVariants[0] : null;
  const resolvedVariantIdx = resolvedVariant ? item.variants!.indexOf(resolvedVariant) : -1;
  const resolvedId = resolvedVariant ? `${item.id}-${resolvedVariantIdx}` : item.id;
  const resolvedPrice = resolvedVariant ? resolvedVariant.price : item.price;
  const resolvedIsVeg = resolvedVariant ? (resolvedVariant.isVeg ?? true) : isVeg;

  const showVariantPicker = hasVariants && !autoResolved && visibleVariants.length > 0;

  // Cart hooks — subscribe to items array so re-render fires on cart change
  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const quantity = useCart((state) =>
    state.items.find((e) => e.item.id === resolvedId)?.quantity ?? 0
  );

  const handleAddItem = () => {
    const price = resolvedPrice;
    if (price === undefined) return;
    const itemName = resolvedVariant ? `${item.name} (${resolvedVariant.label})` : item.name;
    addItem({
      id: resolvedId,
      name: itemName,
      price,
      isVeg: resolvedIsVeg,
      imageUrl: null,
      isAvailable: true,
      spiceLevel: 'Mild',
      prepTime: 15,
      description: item.description || '',
      categoryId: '',
      createdAt: '',
    });
    toast.success(`${itemName} added`, {
      description: `₹${price} · Tap View Cart to review`,
      duration: 2000,
      position: 'top-center',
    });
  };

  const handleVariantSelect = () => {
    if (onVariantSelectClick) {
      onVariantSelectClick(item);
    }
  };

  return (
    <div className={`bg-brand-cocoa rounded-card p-4 transition-all duration-300 ${quantity > 0 ? 'ring-1 ring-brand-gold/30' : ''}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-5 flex-1 min-w-0">
          {/* Icon & Category */}
          <div className="flex flex-col items-center gap-1.5 shrink-0 opacity-60">
            <CategoryIcon categoryId={item.category.id} className="w-6 h-6 text-brand-gold" />
            <span className="text-[10px] text-brand-gold text-center max-w-[70px] leading-tight font-bold uppercase tracking-wide font-sans">
              {item.category.name.split(' ')[0]}
            </span>
          </div>

          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-serif text-[18px] font-medium text-brand-cream truncate">{item.name}</h4>
              {(autoResolved || (!hasVariants && item.isVeg !== undefined)) && (
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    resolvedIsVeg ? 'bg-veg' : 'bg-nonveg'
                  }`}
                ></span>
              )}
            </div>
            {item.description && !showVariantPicker && (
              <p className="text-sm text-brand-cream/70 truncate font-sans">{item.description}</p>
            )}
            {showVariantPicker && (
              <p className="text-xs text-brand-cream/60 font-sans">
                {visibleVariants.length} option{visibleVariants.length > 1 ? 's' : ''}
              </p>
            )}
            {autoResolved && resolvedVariant && (
              <p className="text-xs text-brand-cream/50 font-sans">{resolvedVariant.label}</p>
            )}
          </div>
        </div>

        {/* Right Section - Price & Button */}
        <div className="flex items-center gap-4 shrink-0">
          {resolvedPrice !== undefined && !showVariantPicker && (
            <div className="text-right">
              <div className="text-[20px] font-semibold text-brand-gold font-sans">₹{resolvedPrice}</div>
            </div>
          )}
          {showVariantPicker ? (
            <button
              onClick={handleVariantSelect}
              className={`px-6 py-2 rounded-lg font-semibold text-[14px] uppercase tracking-[0.04em] transition-colors font-sans ${CHAMELEON_BUTTON[filterMode]}`}
            >
              Choose
            </button>
          ) : (resolvedPrice !== undefined) ? (
            quantity > 0 ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-brand-tamarind rounded-lg p-1 border border-brand-gold/30">
                  <button
                    onClick={() => updateQuantity(resolvedId, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded bg-brand-cocoa text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="text-brand-gold font-bold text-sm min-w-[1.25rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(resolvedId, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded bg-brand-gold text-brand-dark hover:bg-brand-cream transition-colors text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm font-bold text-brand-gold font-sans">₹{resolvedPrice! * quantity}</span>
                <button
                  onClick={openCart}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider hover:bg-brand-gold/20 transition-all"
                >
                  <ShoppingBag size={12} />
                  <ArrowRight size={11} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddItem}
                className={`px-6 py-2 rounded-lg font-semibold text-[14px] uppercase tracking-[0.04em] transition-colors font-sans ${CHAMELEON_BUTTON[filterMode]}`}
              >
                Add
              </button>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}