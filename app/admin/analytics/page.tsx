"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  Calculator,
} from "lucide-react";
import { getAnalyticsData } from "@/lib/api";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AnalyticsData {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  totalOrders: number;
  todayOrders: number;
  avgOrderValue: number;
  popularItems: { name: string; count: number; revenue: number }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
  ordersByType: { type: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];
  hourlyDistribution: { hour: string; orders: number }[];
  topCategories: { name: string; revenue: number }[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CHART_COLORS = [
  "#C5A059",
  "#8B0000",
  "#2A0A0A",
  "#D4A574",
  "#7c1f2f",
  "#5C3D2E",
];

const PIE_COLORS = ["#C5A059", "#8B0000", "#5C3D2E", "#D4A574", "#7c1f2f"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" },
  }),
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getAnalyticsData();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load analytics data. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  /* ---- Loading state ---- */
  if (isLoading) {
    return (
      <section className="space-y-8">
        <header>
          <div className="h-9 w-64 animate-pulse rounded-xl bg-brand-gold/20" />
          <div className="mt-3 h-4 w-96 animate-pulse rounded-lg bg-brand-gold/10" />
        </header>

        {/* KPI skeletons */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-brand-cream" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-brand-gold/15" />
                  <div className="h-7 w-32 animate-pulse rounded bg-brand-gold/20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart skeletons */}
        <div className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm">
          <div className="h-5 w-48 animate-pulse rounded bg-brand-gold/15" />
          <div className="mt-6 h-72 animate-pulse rounded-2xl bg-brand-cream/50" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
            >
              <div className="h-5 w-40 animate-pulse rounded bg-brand-gold/15" />
              <div className="mt-6 h-64 animate-pulse rounded-2xl bg-brand-cream/50" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
            >
              <div className="h-5 w-40 animate-pulse rounded bg-brand-gold/15" />
              <div className="mt-6 h-64 animate-pulse rounded-2xl bg-brand-cream/50" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ---- Error state ---- */
  if (error) {
    return (
      <section className="space-y-8">
        <header>
          <h2 className="text-3xl font-semibold text-brand-maroon">
            Analytics
          </h2>
        </header>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          <p className="font-semibold">Something went wrong</p>
          <p className="mt-1">{error}</p>
        </div>
      </section>
    );
  }

  if (!data) return null;

  /* ---- KPI definitions ---- */
  const kpis = [
    {
      label: "Today's Revenue",
      value: formatCurrency(data.todayRevenue),
      icon: <IndianRupee className="h-5 w-5" />,
    },
    {
      label: "Week Revenue",
      value: formatCurrency(data.weekRevenue),
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Total Orders",
      value: data.totalOrders.toLocaleString("en-IN"),
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      label: "Avg Order Value",
      value: formatCurrency(data.avgOrderValue),
      icon: <Calculator className="h-5 w-5" />,
    },
  ];

  const popularItems = data.popularItems.slice(0, 8);

  return (
    <section className="space-y-8">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-semibold text-brand-maroon">Analytics</h2>
        <p className="mt-2 text-sm text-brand-maroon/70">
          Comprehensive insights into revenue, orders, and menu performance.
        </p>
      </header>

      {/* ============================================================= */}
      {/*  1. KPI Row                                                    */}
      {/* ============================================================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 text-brand-maroon">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream">
                {kpi.icon}
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-brand-maroon/60">
                  {kpi.label}
                </p>
                <p className="mt-2 text-2xl font-semibold">{kpi.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ============================================================= */}
      {/*  2. Revenue Trend (Area Chart)                                 */}
      {/* ============================================================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={4}
        variants={fadeUp}
        className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brand-maroon">
              Revenue Trend
            </h3>
            <p className="text-sm text-brand-maroon/60">Last 7 days</p>
          </div>
        </div>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.revenueByDay}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A059" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C5A059" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0d9b5" />
              <XAxis
                dataKey="date"
                stroke="#8B0000"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#8B0000"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #C5A059",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}
                formatter={(value: number, name: string) => [
                  name === "revenue"
                    ? formatCurrency(value)
                    : value.toString(),
                  name === "revenue" ? "Revenue" : "Orders",
                ]}
                labelStyle={{ color: "#8B0000", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C5A059"
                strokeWidth={2.5}
                fill="url(#goldGradient)"
                name="revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ============================================================= */}
      {/*  3. Popular Items Table                                        */}
      {/* ============================================================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={5}
        variants={fadeUp}
        className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-brand-maroon">
          Popular Items
        </h3>
        <p className="text-sm text-brand-maroon/60">
          Top 8 menu items by order count
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-brand-gold/20 text-left text-xs uppercase tracking-wider text-brand-maroon/60">
                <th className="pb-3 pr-4">Rank</th>
                <th className="pb-3 pr-4">Item Name</th>
                <th className="pb-3 pr-4 text-right">Orders</th>
                <th className="pb-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {popularItems.map((item, index) => (
                <tr
                  key={item.name}
                  className="border-b border-brand-gold/10 last:border-b-0"
                >
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        index < 3
                          ? "bg-brand-gold/20 text-brand-maroon"
                          : "bg-brand-cream text-brand-maroon/60"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-medium text-brand-maroon">
                    {item.name}
                  </td>
                  <td className="py-3 pr-4 text-right text-brand-maroon/80">
                    {item.count}
                  </td>
                  <td className="py-3 text-right font-semibold text-brand-maroon">
                    {formatCurrency(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ============================================================= */}
      {/*  4. Order Distribution: Type (Pie) + Status (Horizontal Bar)   */}
      {/* ============================================================= */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orders by Type - Pie Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={6}
          variants={fadeUp}
          className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-brand-maroon">
            Orders by Type
          </h3>
          <p className="text-sm text-brand-maroon/60">
            Delivery, Pickup &amp; Dine-in split
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.ordersByType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={0}
                  label={({ type, percent }) =>
                    `${type} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.ordersByType.map((_, i) => (
                    <Cell
                      key={`type-cell-${i}`}
                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #C5A059",
                    borderRadius: "12px",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [value, "Orders"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Orders by Status - Horizontal Bar Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={7}
          variants={fadeUp}
          className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-brand-maroon">
            Orders by Status
          </h3>
          <p className="text-sm text-brand-maroon/60">
            Current status breakdown
          </p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.ordersByStatus}
                layout="vertical"
                barSize={20}
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0d9b5"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#8B0000"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="status"
                  stroke="#8B0000"
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #C5A059",
                    borderRadius: "12px",
                    fontSize: "13px",
                  }}
                  formatter={(value: number) => [value, "Orders"]}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {data.ordersByStatus.map((_, i) => (
                    <Cell
                      key={`status-cell-${i}`}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ============================================================= */}
      {/*  5. Hourly Distribution (Bar Chart)                            */}
      {/* ============================================================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={8}
        variants={fadeUp}
        className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-brand-maroon">
          Hourly Order Distribution
        </h3>
        <p className="text-sm text-brand-maroon/60">
          Number of orders by hour of the day
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.hourlyDistribution} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0d9b5" />
              <XAxis
                dataKey="hour"
                stroke="#8B0000"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis stroke="#8B0000" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #C5A059",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}
                formatter={(value: number) => [value, "Orders"]}
                labelFormatter={(label) => `Hour: ${label}`}
              />
              <Bar dataKey="orders" fill="#8B0000" radius={[6, 6, 0, 0]}>
                {data.hourlyDistribution.map((_, i) => (
                  <Cell
                    key={`hour-cell-${i}`}
                    fill={i % 2 === 0 ? "#8B0000" : "#C5A059"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ============================================================= */}
      {/*  6. Top Categories (Bar Chart)                                 */}
      {/* ============================================================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={9}
        variants={fadeUp}
        className="rounded-3xl border border-brand-gold/30 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-brand-maroon">
          Top Categories
        </h3>
        <p className="text-sm text-brand-maroon/60">Revenue by category</p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topCategories} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0d9b5" />
              <XAxis
                dataKey="name"
                stroke="#8B0000"
                tick={{ fontSize: 11 }}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#8B0000"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #C5A059",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}
                formatter={(value: number) => [
                  formatCurrency(value),
                  "Revenue",
                ]}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {data.topCategories.map((_, i) => (
                  <Cell
                    key={`cat-cell-${i}`}
                    fill={CHART_COLORS[i % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  );
}
