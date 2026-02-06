"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { PrintReceipt } from "@/components/admin/PrintReceipt";

type OrderStatus = "New" | "Preparing" | "Ready" | "Completed";

interface OrderRow {
  id: string;
  customerName: string;
  itemsSummary: string;
  total: number;
  status: OrderStatus;
  time: string;
}

const initialOrders: OrderRow[] = [
  {
    id: "ORD-1024",
    customerName: "Aarav Sharma",
    itemsSummary: "Royal Paneer Tikka, Butter Naan",
    total: 860,
    status: "New",
    time: "2 mins ago"
  },
  {
    id: "ORD-1023",
    customerName: "Meera Kapoor",
    itemsSummary: "Awadhi Mutton Curry, Garlic Kulcha",
    total: 940,
    status: "Preparing",
    time: "8 mins ago"
  },
  {
    id: "ORD-1022",
    customerName: "Rohan Iyer",
    itemsSummary: "Royal Chicken Biryani, Kesar Lassi",
    total: 840,
    status: "Ready",
    time: "14 mins ago"
  }
];

function playAlert() {
  if (typeof window !== "undefined") {
    console.info("Audio alert placeholder");
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);

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
              setOrders((prev) =>
                prev.map((order) =>
                  order.id === row.original.id
                    ? { ...order, status: nextStatus }
                    : order
                )
              );
              if (nextStatus === "Preparing") {
                playAlert();
              }
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
    data: orders,
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
      <section className="rounded-2xl border border-brand-gold/30 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-brand-maroon">
              Order Details
            </h3>
            <p className="text-sm text-brand-maroon/70">
              Print a receipt for the highlighted order.
            </p>
          </div>
          <PrintReceipt
            orderId={orders[0]?.id ?? "--"}
            total={orders[0]?.total ?? 0}
            createdAt={new Date().toISOString()}
            items={(orders[0]?.itemsSummary ?? "")
              .split(",")
              .filter(Boolean)
              .map((itemName) => ({
                name: itemName.trim(),
                quantity: 1,
                price: orders[0]?.total
                  ? orders[0].total /
                    (orders[0].itemsSummary.split(",").length || 1)
                  : 0
              }))}
          />
        </div>
      </section>
    </section>
  );
}
