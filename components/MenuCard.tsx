"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import type { MenuItem } from "@/types";
import { useCart } from "@/store/useCart";

interface MenuCardProps {
  item: MenuItem;
  index: number;
}

export function MenuCard({ item, index }: MenuCardProps) {
  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const quantity = useCart((state) => state.getItemQuantity(item.id));

  const subtitle = useMemo(
    () => (item.isVeg ? "Veg" : "Non Veg"),
    [item.isVeg]
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-brand-gold/30 bg-white shadow-sm"
    >
      <div className="relative h-36 w-full overflow-hidden md:h-40">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-brand-cream/90 px-3 py-1 text-xs font-semibold text-brand-maroon">
          {subtitle}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-brand-maroon">
              {item.name}
            </h3>
            <p className="mt-1 text-sm text-brand-maroon/70">
              {item.description}
            </p>
          </div>
          <span className="text-base font-semibold text-brand-gold">
            ₹{item.price}
          </span>
        </div>
        <div className="mt-auto">
          {quantity > 0 ? (
            <div className="flex items-center justify-between rounded-full border border-brand-gold/40 px-4 py-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="text-lg font-semibold text-brand-maroon"
              >
                -
              </button>
              <span className="text-sm font-semibold text-brand-maroon">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="text-lg font-semibold text-brand-maroon"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => addItem(item)}
              className="w-full rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream transition hover:bg-brand-gold hover:text-brand-maroon"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
