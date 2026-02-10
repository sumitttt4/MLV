"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { MenuItemData } from "@/lib/menuData";
import { useMenuStore } from "@/store/useMenuStore";

interface VariantSelectorProps {
  item: MenuItemData;
  isOpen: boolean;
  onClose: () => void;
  onSelectVariant: (variantIndex: number) => void;
}

export function VariantSelector({
  item,
  isOpen,
  onClose,
  onSelectVariant,
}: VariantSelectorProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const dietaryMode = useMenuStore((s) => s.dietaryMode);

  if (!isOpen || !item.variants || item.variants.length === 0) return null;

  // Build filtered variant list with original indices preserved
  const filteredVariants = item.variants
    .map((v, originalIdx) => ({ ...v, originalIdx }))
    .filter((v) => {
      if (dietaryMode === 'VEG') return v.isVeg === true;
      if (dietaryMode === 'NON_VEG') return v.isVeg === false;
      return true;
    });

  if (filteredVariants.length === 0) return null;

  const chameleonAdd = 'bg-brand-gold hover:bg-brand-cream text-brand-dark';

  const handleSelectAndAdd = () => {
    const chosen = filteredVariants[selectedIdx];
    if (chosen) onSelectVariant(chosen.originalIdx);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-brand-black/80 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card bg-brand-cocoa p-6 shadow-none">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[24px] font-serif font-medium leading-tight text-brand-cream">Select Option</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-brand-cream/60 transition-colors hover:bg-brand-dark/20 hover:text-brand-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Item Name */}
        <p className="mb-6 text-[16px] font-serif text-brand-cream/70">{item.name}</p>

        {/* Variants List */}
        <div className="mb-8 max-h-64 space-y-3 overflow-y-auto scrollbar-hide">
          {filteredVariants.map((variant, idx) => {
            const isSelected = idx === selectedIdx;
            const isVeg = variant.isVeg ?? true;

            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full rounded-lg border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-brand-gold bg-brand-tamarind/60"
                    : "border-brand-gold/10 bg-brand-cocoa/80 hover:border-brand-gold/40"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-1 items-center gap-3">
                    <div
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        isVeg ? "bg-veg" : "bg-nonveg"
                      }`}
                    />
                    <span className="text-[14px] font-medium text-brand-cream">
                      {variant.label}
                    </span>
                  </div>
                  <span className="text-[16px] font-bold text-brand-gold">
                    ₹{variant.price}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-brand-gold px-4 py-3 text-[14px] font-bold uppercase tracking-[0.04em] text-brand-gold transition-colors hover:bg-brand-gold/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSelectAndAdd}
            className={`flex-1 rounded-lg px-4 py-3 text-[14px] font-bold uppercase tracking-[0.04em] transition-colors ${chameleonAdd}`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
