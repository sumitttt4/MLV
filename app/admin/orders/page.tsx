"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { getLiveOrders, updateOrderStatus } from "@/lib/api";

type OrderStatus = "New" | "Preparing" | "Ready" | "Completed";

interface OrderRow {
  id: string;
  customerName: string;
  itemsSummary: string;
  total: number;
  status: OrderStatus;
  time: string;
}

export default function AdminOrdersPage() {
  const [data, setData] = useState<OrderRow[]>([]);
  const previousCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/ding.mp3"); // Ensure this file exists or use a CDN
  }, []);

  const fetchOrders = async () => {
    try {
      const orders = await getLiveOrders();
      // Transform Supabase data to OrderRow
      // Assuming 'orders' has necessary fields. In a real app we'd map customer_id to name etc.
      const rows: OrderRow[] = orders.map((o: any) => ({
        id: o.id,
        customerName: "Customer", // Placeholder as simple schema doesn't have name directly on order
        itemsSummary: o.order_items ? o.order_items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ") : "",
        total: o.total,
        status: o.status,
        time: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      setData(rows);

      if (rows.length > previousCount.current) {
        // New order arrived
        audioRef.current?.play().catch(e => console.log("Audio play failed", e));
      }
      previousCount.current = rows.length;
    } catch (e) {
      console.error("Failed to fetch live orders", e);
    }
  };

  useEffect(() => {
    fetchOrders(); // Initial fetch
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    // Optimistic update
    setData(prev => prev.map(row => row.id === id ? { ...row, status: newStatus } : row));
    try {
      await updateOrderStatus(id, newStatus);
      await fetchOrders(); // value sync
    } catch (e) {
      console.error("Status update failed", e);
      fetchOrders(); // Revert on error
    }
  };

  const columns = useMemo<ColumnDef<OrderRow>[]>(
    () => [
      { accessorKey: "id", header: "Order ID", cell: ({ row }) => row.original.id.slice(0, 8) },
      { accessorKey: "customerName", header: "Customer Name" },
      { accessorKey: "itemsSummary", header: "Items Summary" },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="font-semibold text-brand-gold">
            ₹{row.original.total}
          </span>
        )
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <select
            value={row.original.status}
            onChange={(event) => handleStatusChange(row.original.id, event.target.value as OrderStatus)}
            className="rounded-full border border-brand-gold/40 bg-white px-3 py-1 text-sm font-semibold text-brand-maroon focus:outline-none focus:ring-2 focus:ring-brand-gold"
          >
            {["New", "Preparing", "Ready", "Completed"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )
      },
      { accessorKey: "time", header: "Time" }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-3xl font-semibold text-brand-maroon">
          Live Orders
        </h2>
        <p className="mt-2 max-w-xl text-sm text-brand-maroon/70">
          Track incoming orders and keep the kitchen in perfect rhythm.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-brand-gold/30 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-cream text-brand-maroon">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-brand-maroon/50">
                  No active orders.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-brand-gold/20 hover:bg-brand-cream/10">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4 text-brand-maroon/80">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
