import { create } from "zustand";
import type { MenuItem } from "@/types";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  gstRate: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getGst: () => number;
  getTotal: () => number;
  getItemQuantity: (id: string) => number;
  cartTotal: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  gstRate: 0.05,
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((entry) => entry.item.id === item.id);
      if (existing) {
        return {
          items: state.items.map((entry) =>
            entry.item.id === item.id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry
          )
        };
      }
      return { items: [...state.items, { item, quantity: 1 }] };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((entry) => entry.item.id !== id)
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((entry) => entry.item.id !== id)
          : state.items.map((entry) =>
              entry.item.id === id ? { ...entry, quantity } : entry
            )
    })),
  clearCart: () => set({ items: [] }),
  getSubtotal: () =>
    get().items.reduce(
      (total, entry) => total + entry.item.price * entry.quantity,
      0
    ),
  getGst: () => get().getSubtotal() * get().gstRate,
  getTotal: () => get().getSubtotal() + get().getGst(),
  getItemQuantity: (id) =>
    get().items.find((entry) => entry.item.id === id)?.quantity ?? 0,
  cartTotal: () => get().getTotal()
}));
