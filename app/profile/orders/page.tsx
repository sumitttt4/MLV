"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrdersByPhone } from "@/lib/api";
import { useCart } from "@/store/useCart";
import type { Order } from "@/types/schema";
import Link from "next/link";
import {
  Search,
  Package,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const shortId = (id: string) => id.slice(0, 8).toUpperCase();

/** Active statuses where the order can still be tracked. */
const ACTIVE_STATUSES: Order["status"][] = [
  "Received",
  "Confirmed",
  "Preparing",
  "Ready",
  "Out for Delivery",
];

const isActiveOrder = (status: Order["status"]) =>
  ACTIVE_STATUSES.includes(status);

// ---------------------------------------------------------------------------
// Status badge colour mapping
// ---------------------------------------------------------------------------

function statusBadgeClasses(status: Order["status"]): string {
  switch (status) {
    case "Received":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "Confirmed":
      return "bg-indigo-500/15 text-indigo-400 border-indigo-500/25";
    case "Preparing":
      return "bg-amber-500/15 text-amber-400 border-amber-500/25";
    case "Ready":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "Out for Delivery":
      return "bg-purple-500/15 text-purple-400 border-purple-500/25";
    case "Delivered":
      return "bg-green-500/15 text-green-400 border-green-500/25";
    case "Cancelled":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    default:
      return "bg-white/10 text-brand-cream/70 border-white/10";
  }
}

// ---------------------------------------------------------------------------
// Payment status badge
// ---------------------------------------------------------------------------

function paymentBadgeClasses(status: Order["paymentStatus"]): string {
  switch (status) {
    case "paid":
      return "bg-green-500/15 text-green-400 border-green-500/25";
    case "pending":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
    case "failed":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "refunded":
      return "bg-cyan-500/15 text-cyan-400 border-cyan-500/25";
    default:
      return "bg-white/10 text-brand-cream/70 border-white/10";
  }
}

// ---------------------------------------------------------------------------
// Order‑type display label
// ---------------------------------------------------------------------------

function orderTypeLabel(type: Order["orderType"]): string {
  switch (type) {
    case "delivery":
      return "Delivery";
    case "pickup":
      return "Pickup";
    case "dine_in":
      return "Dine-in";
    default:
      return type;
  }
}

// ---------------------------------------------------------------------------
// Framer motion variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const expandVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
};

// ===========================================================================
// Component
// ===========================================================================

export default function OrdersPage() {
  // ---- Phone lookup state ----
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // ---- Orders state ----
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ---- Cart ----
  const addItem = useCart((s) => s.addItem);
  const updateQuantity = useCart((s) => s.updateQuantity);

  // -----------------------------------------------------------------------
  // Phone validation & search
  // -----------------------------------------------------------------------

  const sanitizePhone = (raw: string) => raw.replace(/\D/g, "");

  const validatePhone = (raw: string): boolean => {
    const digits = sanitizePhone(raw);
    if (digits.length !== 10) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleSearch = async () => {
    if (!validatePhone(phone)) return;

    setIsSearching(true);
    setHasSearched(false);
    setExpandedId(null);

    try {
      const digits = sanitizePhone(phone);
      const results = await getOrdersByPhone(digits);
      setOrders(results);
      setHasSearched(true);

      if (results.length === 0) {
        toast.info("No orders found for this phone number.");
      } else {
        toast.success(`Found ${results.length} order${results.length > 1 ? "s" : ""}.`);
      }
    } catch {
      toast.error("Something went wrong while fetching orders. Please try again.");
      setOrders([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // -----------------------------------------------------------------------
  // Reorder handler
  // -----------------------------------------------------------------------

  const handleReorder = (order: Order) => {
    let added = 0;

    order.items.forEach((orderItem) => {
      // Build a minimal MenuItem the cart store can work with.
      addItem({
        id: orderItem.menuItemId,
        categoryId: "",
        name: orderItem.name,
        description: "",
        price: orderItem.price,
        imageUrl: null,
        isVeg: false,
        isAvailable: true,
        spiceLevel: "Medium",
        prepTime: 15,
        createdAt: new Date().toISOString(),
      });
      // addItem adds qty 1, so set exact quantity afterwards.
      updateQuantity(orderItem.menuItemId, orderItem.quantity);
      added += orderItem.quantity;
    });

    toast.success(`Added ${added} item${added > 1 ? "s" : ""} to your cart.`);
  };

  // -----------------------------------------------------------------------
  // Toggle expand
  // -----------------------------------------------------------------------

  const toggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // =======================================================================
  // Render
  // =======================================================================

  return (
    <main className="min-h-screen bg-brand-dark text-brand-cream relative pt-36">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-[2px]" />

      <div className="relative mx-auto w-full max-w-3xl px-6 pb-24">
        {/* ---- Header ---- */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="font-serif text-4xl font-bold text-brand-gold md:text-5xl">
            Order History
          </h1>
          <p className="mt-3 text-sm text-brand-cream/60">
            Enter your phone number to look up past and active orders.
          </p>
        </motion.header>

        {/* ---- Phone lookup card ---- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-8 shadow-2xl backdrop-blur-md"
        >
          <label
            htmlFor="phone-input"
            className="mb-3 block text-xs font-bold uppercase tracking-wider text-brand-cream/40"
          >
            Phone Number
          </label>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-brand-cream/30">
                <Search className="h-4 w-4" />
              </div>
              <input
                id="phone-input"
                type="tel"
                inputMode="numeric"
                maxLength={14}
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError(null);
                }}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-brand-cream placeholder:text-white/20 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
              />
            </div>

            <button
              type="button"
              disabled={isSearching}
              onClick={handleSearch}
              className="flex items-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-brand-dark transition-all hover:bg-brand-cream hover:scale-[1.03] disabled:pointer-events-none disabled:opacity-50"
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isSearching ? "Searching" : "Lookup"}
              </span>
            </button>
          </div>

          <AnimatePresence>
            {phoneError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-3 text-xs text-red-400"
              >
                {phoneError}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ---- Results ---- */}
        <AnimatePresence mode="wait">
          {/* Loading skeleton */}
          {isSearching && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-10 space-y-4"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl border border-white/5 bg-white/5"
                />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {!isSearching && hasSearched && orders.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-16 flex flex-col items-center text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-gold/10">
                <Package className="h-10 w-10 text-brand-gold/60" />
              </div>
              <h2 className="mt-6 font-serif text-2xl font-bold text-brand-cream/80">
                No Orders Found
              </h2>
              <p className="mt-2 max-w-sm text-sm text-brand-cream/40">
                We could not find any orders linked to this phone number.
                Double-check the number or place your first order!
              </p>
              <Link
                href="/"
                className="mt-8 rounded-full bg-brand-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-cream hover:scale-105"
              >
                Browse Menu
              </Link>
            </motion.div>
          )}

          {/* Order cards */}
          {!isSearching && hasSearched && orders.length > 0 && (
            <motion.div
              key="orders"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-10 space-y-5"
            >
              {orders.map((order) => {
                const isExpanded = expandedId === order.id;
                const active = isActiveOrder(order.status);

                return (
                  <motion.article
                    key={order.id}
                    variants={cardVariants}
                    layout
                    className="overflow-hidden rounded-2xl border border-brand-gold/10 bg-brand-dark/60 shadow-xl backdrop-blur-md transition-colors hover:border-brand-gold/20"
                  >
                    {/* Card header — always visible */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(order.id)}
                      className="flex w-full items-start justify-between gap-4 p-5 text-left sm:items-center"
                    >
                      {/* Left side */}
                      <div className="flex-1 space-y-2">
                        {/* ID & Date */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-serif text-base font-bold text-brand-gold">
                            #{shortId(order.id)}
                          </span>
                          <span className="text-xs text-brand-cream/40">
                            {formatDateTime(order.createdAt)}
                          </span>
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Order status */}
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${statusBadgeClasses(order.status)}`}
                          >
                            {order.status}
                          </span>

                          {/* Order type */}
                          <span className="inline-flex items-center rounded-full border border-brand-gold/20 bg-brand-gold/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-gold">
                            {orderTypeLabel(order.orderType)}
                          </span>

                          {/* Payment status */}
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize tracking-wide ${paymentBadgeClasses(order.paymentStatus)}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Right side: total + chevron */}
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-lg font-bold text-brand-cream">
                          {formatCurrency(order.total)}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-brand-gold/60" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-brand-gold/60" />
                        )}
                      </div>
                    </button>

                    {/* Expanded details */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="detail"
                          variants={expandVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/5 px-5 pb-5 pt-4">
                            {/* Items list */}
                            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                              Items
                            </h3>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5 text-sm"
                                >
                                  <span className="text-brand-cream/80">
                                    <span className="mr-1.5 font-semibold text-brand-gold">
                                      {item.quantity}x
                                    </span>
                                    {item.name}
                                  </span>
                                  <span className="font-medium text-brand-cream/70">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Price breakdown */}
                            <div className="mt-4 space-y-1.5 border-t border-white/5 pt-4 text-sm text-brand-cream/50">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-brand-cream/70">
                                  {formatCurrency(order.subtotal)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>GST</span>
                                <span className="text-brand-cream/70">
                                  {formatCurrency(order.gst)}
                                </span>
                              </div>
                              {order.deliveryFee > 0 && (
                                <div className="flex justify-between">
                                  <span>Delivery Fee</span>
                                  <span className="text-brand-cream/70">
                                    {formatCurrency(order.deliveryFee)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between border-t border-white/5 pt-2 text-base font-bold text-brand-gold">
                                <span>Total</span>
                                <span>{formatCurrency(order.total)}</span>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                              {/* Reorder */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReorder(order);
                                }}
                                className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-brand-dark transition-all hover:bg-brand-cream hover:scale-[1.03]"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Reorder
                              </button>

                              {/* Track link for active orders */}
                              {active && (
                                <Link
                                  href={`/order/${order.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-brand-gold transition-all hover:bg-brand-gold/10 hover:border-brand-gold/50"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Track Order
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
