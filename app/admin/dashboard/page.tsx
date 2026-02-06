"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { DollarSign, ClipboardList, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/lib/api";

interface KpiState {
  todaysRevenue: number;
  activeOrders: number;
  totalOrders: number;
}

interface CategorySales {
  name: string;
  sales: number;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<KpiState>({
    todaysRevenue: 0,
    activeOrders: 0,
    totalOrders: 0
  });
  const [salesByCategory, setSalesByCategory] = useState<CategorySales[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [
          { data: revenueRows },
          { count: activeCount },
          { count: totalCount }
        ] = await Promise.all([
            supabase
              .from("orders")
              .select("total", { count: "exact" })
              .in("status", ["Completed", "Delivered"])
              .gte("created_at", startOfDay.toISOString()),
            supabase
              .from("orders")
              .select("id", { count: "exact", head: true })
              .in("status", ["New", "Preparing"]),
            supabase
              .from("orders")
              .select("id", { count: "exact", head: true })
          ]);

        const todaysRevenue = (revenueRows ?? []).reduce((sum, row) => {
          const totalValue = typeof row.total === "number" ? row.total : Number(row.total);
          return sum + (Number.isNaN(totalValue) ? 0 : totalValue);
        }, 0);

        setKpis({
          todaysRevenue,
          activeOrders: activeCount ?? 0,
          totalOrders: totalCount ?? 0
        });

        const { data: itemRows, error: salesError } = await supabase
          .from("order_items")
          .select("quantity,price,menu_items(categories(name))");

        if (salesError) {
          throw salesError;
        }

        const categoryTotals = new Map<string, number>();

        (itemRows ?? []).forEach((row) => {
          const categoryName =
            (row.menu_items as { categories?: { name?: string } }).categories
              ?.name ?? "Uncategorized";
          const lineTotal = Number(row.price) * Number(row.quantity);
          categoryTotals.set(
            categoryName,
            (categoryTotals.get(categoryName) ?? 0) + lineTotal
          );
        });

        setSalesByCategory(
          Array.from(categoryTotals.entries()).map(([name, sales]) => ({
            name,
            sales
          }))
        );
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load dashboard data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const chartData = useMemo(
    () =>
      salesByCategory.length
        ? salesByCategory
        : [{ name: "No data", sales: 0 }],
    [salesByCategory]
  );

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-3xl font-semibold text-brand-maroon">
          Morning View Dashboard
        </h2>
        <p className="mt-2 text-sm text-brand-maroon/70">
          A sunrise snapshot of orders, revenue, and category performance.
        </p>
      </header>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Today's Revenue"
          value={formatCurrency(kpis.todaysRevenue)}
          isLoading={isLoading}
        />
        <KpiCard
          icon={<ClipboardList className="h-5 w-5" />}
          label="Active Orders"
          value={kpis.activeOrders.toString()}
          isLoading={isLoading}
        />
        <KpiCard
          icon={<UtensilsCrossed className="h-5 w-5" />}
          label="Total Orders"
          value={kpis.totalOrders.toString()}
          isLoading={isLoading}
        />
      </div>

      <div className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brand-maroon">
              Sales by Category
            </h3>
            <p className="text-sm text-brand-maroon/60">
              {isLoading ? "Loading chart..." : "Today"}
            </p>
          </div>
        </div>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0d9b5" />
              <XAxis dataKey="name" stroke="#6b1f2b" />
              <YAxis stroke="#6b1f2b" />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="sales" fill="#7c1f2f" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function KpiCard({
  icon,
  label,
  value,
  isLoading
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <div className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 text-brand-maroon">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream">
          {icon}
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-maroon/60">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {isLoading ? "--" : value}
          </p>
        </div>
      </div>
    </div>
  );
}
