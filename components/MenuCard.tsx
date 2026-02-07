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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-brand-gold/30 hover:bg-brand-dark/50 hover:shadow-xl sm:gap-6"
    >
      {/* Glow Effect */}
      <div className="absolute -right-12 -top-12 h-24 w-24 bg-brand-gold/10 blur-[40px] transition-all group-hover:bg-brand-gold/20" />

      {/* Image & Title Section */}
      <div className="flex flex-1 items-center gap-4 sm:gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white/10 shadow-lg ring-1 ring-black/20 group-hover:border-brand-gold/30 sm:h-24 sm:w-24">
          <Image
            src={item.imageUrl ?? fallbackImage}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 80px, 96px"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-xl font-bold leading-tight text-brand-cream group-hover:text-brand-gold transition-colors">
              {item.name}
            </h3>
            <div className={`h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/10 ${isVeg ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"}`} />
          </div>

          <p className="text-xs leading-relaxed text-brand-cream/60 line-clamp-2 max-w-[240px]">
            {item.description}
          </p>

          <div className="mt-1 font-bold text-brand-gold text-lg">
            ₹{item.price}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="shrink-0 z-10">
        {quantity > 0 ? (
          <div className="flex items-center gap-3 rounded-full border border-brand-gold/30 bg-black/40 px-3 py-2 backdrop-blur-md">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-brand-cream transition-colors hover:bg-brand-gold hover:text-brand-dark active:scale-95 touch-manipulation"
            >
              -
            </button>
            <span className="min-w-[1.5rem] text-center text-sm font-bold text-brand-gold">{quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-dark transition-colors hover:bg-white hover:text-brand-dark active:scale-95 touch-manipulation"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addItem(item)}
            className="rounded-full bg-brand-gold px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-brand-dark shadow-lg shadow-brand-gold/10 transition-all hover:bg-white hover:scale-105"
          >
            Add
          </button>
        )}
      </div>

    </motion.article>
  );
}
