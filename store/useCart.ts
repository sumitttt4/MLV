import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem, OrderType } from "@/types";

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes: string;
}

interface CartState {
  items: CartItem[];
  gstRate: number;
  orderType: OrderType;
  deliveryFee: number;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemNotes: (id: string, notes: string) => void;
  setOrderType: (type: OrderType) => void;
  setDeliveryFee: (fee: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getGst: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemQuantity: (id: string) => number;
  getItemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      gstRate: 0.05,
      orderType: "delivery" as OrderType,
      deliveryFee: 0,
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
          return { items: [...state.items, { item, quantity: 1, notes: "" }] };
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
      updateItemNotes: (id, notes) =>
        set((state) => ({
          items: state.items.map((entry) =>
            entry.item.id === id ? { ...entry, notes } : entry
          )
        })),
      setOrderType: (orderType) => set({ orderType }),
      setDeliveryFee: (deliveryFee) => set({ deliveryFee }),
      clearCart: () => set({ items: [], deliveryFee: 0 }),
      getSubtotal: () =>
        get().items.reduce(
          (total, entry) => total + entry.item.price * entry.quantity,
          0
        ),
      getGst: () => get().getSubtotal() * get().gstRate,
      getDeliveryFee: () => (get().orderType === "delivery" ? get().deliveryFee : 0),
      getTotal: () => get().getSubtotal() + get().getGst() + get().getDeliveryFee(),
      getItemQuantity: (id) =>
        get().items.find((entry) => entry.item.id === id)?.quantity ?? 0,
      getItemCount: () =>
        get().items.reduce((count, entry) => count + entry.quantity, 0)
    }),
    {
      name: "mlv-cart-storage"
    }
  )
);
