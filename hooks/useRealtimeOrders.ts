"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/types/schema";
import { supabase } from "@/lib/api";

export function useRealtimeOrders(initialOrders: Order[] = []) {
  const [latestOrders, setLatestOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as Order;
          setLatestOrders((prev) => [newOrder, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updatedOrder = payload.new as Order;
          setLatestOrders((prev) =>
            prev.map((order) =>
              order.id === updatedOrder.id ? updatedOrder : order
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { latestOrders, setLatestOrders };
}
