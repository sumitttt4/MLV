"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/store/useCart";
import type { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export function MenuCard({ item, index }: MenuCardProps) {
  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const quantity = useCart((state) => state.getItemQuantity(item.id));

  const isVeg = item.isVeg;

  // Fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=100&q=60";

  return (
    <div
      className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-card bg-brand-cocoa p-5 transition-colors sm:gap-6"
    >
      {/* Image & Title Section */}
      <div className="flex flex-1 items-center gap-4 sm:gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-dark/20">
          <Image
            src={item.imageUrl ?? fallbackImage}
            alt={item.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-[18px] sm:text-[18px] font-medium text-brand-cream leading-tight">
              {item.name}
            </h3>
            <div className={`h-2 w-2 shrink-0 rounded-full ${isVeg ? "bg-veg" : "bg-nonveg"}`} />
          </div>

          <p className="text-sm text-brand-cream/70 line-clamp-1 max-w-[200px] font-sans">
            {item.description}
          </p>

          <div className="flex items-center gap-3 mt-1">
            <span className="font-sans font-semibold text-brand-gold text-[20px]">
              ₹{item.price}
            </span>
            {item.spiceLevel && item.spiceLevel !== "Mild" && (
              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                item.spiceLevel === "Extra Hot" ? "bg-red-500/20 text-red-400" :
                item.spiceLevel === "Hot" ? "bg-orange-500/20 text-orange-400" :
                "bg-yellow-500/20 text-yellow-400"
              }`}>
                {item.spiceLevel}
              </span>
            )}
            {item.prepTime && (
              <span className="text-[10px] text-brand-cream/40 font-sans">
                {item.prepTime} min
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="shrink-0 z-10">
        {quantity > 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-brand-gold bg-transparent px-2 py-1">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded text-brand-gold hover:bg-brand-gold hover:text-brand-buttonText active:scale-95 transition-all"
            >
              -
            </button>
            <span className="min-w-[1rem] text-center text-sm font-bold text-brand-gold font-sans">{quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded text-brand-gold hover:bg-brand-gold hover:text-brand-buttonText active:scale-95 transition-all"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(item)}
            className="rounded-lg bg-brand-gold px-5 py-2 text-[14px] font-semibold text-brand-buttonText uppercase tracking-[0.04em] hover:bg-brand-cream transition-colors font-sans"
          >
            Add
          </button>
        )}
      </div>

    </div>
  );
}
