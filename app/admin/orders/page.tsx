"use client";

import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { useRealtimeOrders } from "@/hooks/useRealtimeOrders";
import { OrderAlert } from "@/components/admin/OrderAlert";
import type { Order } from "@/types/schema";

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
  const { latestOrders, setLatestOrders } = useRealtimeOrders();

  const rows = useMemo<OrderRow[]>(
    () =>
      latestOrders.map((order) => ({
        id: order.id,
        customerName: order.customerId ? "Returning guest" : "Guest",
        itemsSummary:
          order.items?.map((item) => item.name).join(", ") ||
          "Items are being confirmed",
        total: order.total,
        status: order.status as OrderStatus,
        time: order.createdAt
          ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit"
            })
          : "Just now"
      })),
    [latestOrders]
  );

  const columns = useMemo<ColumnDef<OrderRow>[]>(
    () => [
      { accessorKey: "id", header: "Order ID" },
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
            onChange={(event) => {
              const nextStatus = event.target.value as OrderStatus;
              setLatestOrders((prev) =>
                prev.map((order) =>
                  order.id === row.original.id
                    ? ({ ...order, status: nextStatus } as Order)
                    : order
                )
              );
            }}
            className="rounded-full border border-brand-gold/40 bg-white px-3 py-1 text-sm font-semibold text-brand-maroon"
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
    data: rows,
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
      <OrderAlert orders={latestOrders} />
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-brand-gold/20">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 text-brand-maroon/80">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
