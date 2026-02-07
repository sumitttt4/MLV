"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/store/useCart";
import { supabase } from "@/lib/api";
import type { MenuItem } from "@/types";

interface OrderItemRow {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderCard {
  id: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItemRow[];
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});



export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCart((state) => state.addItem);
  const updateQuantity = useCart((state) => state.updateQuantity);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          setOrders([]);
          setIsLoading(false);
          return;
        }

        const { data: orderRows, error: ordersError } = await supabase
          .from("orders")
          .select(
            "id,created_at,status,total,order_items(menu_item_id,name,price,quantity)"
          )
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) {
          throw ordersError;
        }

        const ordersData: OrderCard[] = (orderRows ?? []).map((order) => ({
          id: order.id,
          createdAt: order.created_at,
          status: order.status,
          total: Number(order.total),
          items: (order.order_items ?? []).map((item) => ({
            menuItemId: item.menu_item_id,
            name: item.name,
            price: Number(item.price),
            quantity: item.quantity
          }))
        }));

        setOrders(ordersData);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load orders."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const itemLookup = useMemo(() => new Map<string, MenuItem>(), []);

  const handleReorder = async (items: OrderItemRow[]) => {
    const menuItemIds = items.map((item) => item.menuItemId);

    const missingIds = menuItemIds.filter((id) => !itemLookup.has(id));

    if (missingIds.length > 0) {
      const { data: menuItems } = await supabase
        .from("menu_items")
        .select("id,name,description,price,image_url,is_veg,category_id,categories(name)")
        .in("id", missingIds);

      (menuItems ?? []).forEach((menuItem) => {
        const mapped: MenuItem = {
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description || "",
          price: Number(menuItem.price),
          categoryId: menuItem.category_id || "unknown",
          isVeg: Boolean(menuItem.is_veg),
          imageUrl: menuItem.image_url ?? null,
          isAvailable: true,
          createdAt: new Date().toISOString()
        };

        itemLookup.set(menuItem.id, mapped);
      });
    }

    items.forEach((item) => {
      const menuItem = itemLookup.get(item.menuItemId);
      if (!menuItem) {
        return;
      }
      addItem(menuItem);
      updateQuantity(menuItem.id, item.quantity);
    });
  };

  return (
    <main className="min-h-screen bg-brand-cream text-brand-maroon">
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <header>
          <h1 className="text-3xl font-semibold">My Orders</h1>
          <p className="mt-2 text-sm text-brand-maroon/70">
            Track your past meals and reorder your favorites in one tap.
          </p>
        </header>

        {error ? (
          <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <p className="rounded-2xl border border-brand-maroon/10 bg-white px-4 py-4 text-sm">
              Loading your orders...
            </p>
          ) : orders.length === 0 ? (
            <p className="rounded-2xl border border-brand-maroon/10 bg-white px-4 py-4 text-sm">
              You have no orders yet.
            </p>
          ) : (
            orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-maroon">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short"
                      })}
                    </p>
                    <p className="text-xs text-brand-maroon/60">
                      Order ID: {order.id}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Preparing"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-brand-cream text-brand-maroon"
                      }`}
                  >
                    {order.status === "Completed" ? "Delivered" : order.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-brand-maroon/80">
                  {order.items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between">
                      <span>
                        {item.quantity} × {item.name}
                      </span>
                      <span>{currencyFormatter.format(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-base font-semibold">
                    Total: {currencyFormatter.format(order.total)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleReorder(order.items)}
                    className="rounded-full border border-brand-maroon/30 px-4 py-2 text-sm font-semibold text-brand-maroon transition hover:bg-brand-maroon/10"
                  >
                    Reorder
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
