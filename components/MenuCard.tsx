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
      className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10 sm:gap-6"
    >
      {/* Image & Title Section */}
      <div className="flex flex-1 items-center gap-4 sm:gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black/20">
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
            <h3 className="font-sans text-base font-bold text-brand-cream">
              {item.name}
            </h3>
            <div className={`h-2 w-2 shrink-0 rounded-full ${isVeg ? "bg-green-500" : "bg-red-500"}`} />
          </div>

          <p className="text-xs text-brand-cream/60 line-clamp-1 max-w-[200px]">
            {item.description}
          </p>

          <div className="font-bold text-brand-gold text-sm">
            ₹{item.price}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="shrink-0 z-10">
        {quantity > 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-brand-gold/30 bg-black/40 px-2 py-1">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-brand-cream hover:bg-brand-gold hover:text-brand-dark"
            >
              -
            </button>
            <span className="min-w-[1rem] text-center text-sm font-bold text-brand-gold">{quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded bg-brand-gold text-brand-dark hover:bg-white"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(item)}
            className="rounded-lg bg-brand-gold px-5 py-2 text-xs font-bold uppercase tracking-widest text-brand-dark hover:bg-white"
          >
            Add
          </button>
        )}
      </div>

    </div>
  );
}
