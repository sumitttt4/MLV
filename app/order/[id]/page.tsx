"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  MapPin,
  Phone,
  User,
  CreditCard,
  UtensilsCrossed,
  XCircle,
  RefreshCw,
  ArrowLeft,
  ShoppingBag,
  Receipt,
  Timer,
  Loader2,
} from "lucide-react";

import type { Order, OrderStatus } from "@/types/schema";
import { getOrderById } from "@/lib/api";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POLL_INTERVAL_MS = 15_000;

const ORDER_STEPS: {
  status: OrderStatus;
  label: string;
  description: string;
  icon: typeof CheckCircle2;
}[] = [
  {
    status: "Received",
    label: "Order Received",
    description: "Your order has been placed successfully",
    icon: Receipt,
  },
  {
    status: "Confirmed",
    label: "Confirmed",
    description: "The restaurant has accepted your order",
    icon: CheckCircle2,
  },
  {
    status: "Preparing",
    label: "Preparing",
    description: "Our chefs are crafting your meal",
    icon: ChefHat,
  },
  {
    status: "Ready",
    label: "Ready",
    description: "Your order is ready and waiting",
    icon: PackageCheck,
  },
  {
    status: "Out for Delivery",
    label: "Out for Delivery",
    description: "On the way to your doorstep",
    icon: Truck,
  },
  {
    status: "Delivered",
    label: "Delivered",
    description: "Enjoy your meal!",
    icon: UtensilsCrossed,
  },
];

const ORDER_TYPE_LABELS: Record<string, string> = {
  delivery: "Delivery",
  pickup: "Pickup",
  dine_in: "Dine-In",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  online: "Online (Razorpay)",
  cod: "Cash on Delivery",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

function getStepIndex(status: OrderStatus): number {
  const idx = ORDER_STEPS.findIndex((s) => s.status === status);
  return idx === -1 ? -1 : idx;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Countdown Hook
// ---------------------------------------------------------------------------

function useCountdown(order: Order | null) {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!order || !order.estimatedTime || order.status === "Delivered" || order.status === "Cancelled") {
      setRemainingSeconds(null);
      return;
    }

    const createdMs = new Date(order.createdAt).getTime();
    const estimatedEndMs = createdMs + order.estimatedTime * 60 * 1000;

    const tick = () => {
      const diff = Math.max(0, Math.floor((estimatedEndMs - Date.now()) / 1000));
      setRemainingSeconds(diff);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [order]);

  const minutes = remainingSeconds !== null ? Math.floor(remainingSeconds / 60) : null;
  const seconds = remainingSeconds !== null ? remainingSeconds % 60 : null;

  const progress = useMemo(() => {
    if (!order?.estimatedTime || remainingSeconds === null) return 0;
    const totalSeconds = order.estimatedTime * 60;
    return Math.min(1, Math.max(0, 1 - remainingSeconds / totalSeconds));
  }, [order?.estimatedTime, remainingSeconds]);

  return { minutes, seconds, remainingSeconds, progress };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-brand-dark text-brand-cream pt-36">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
        </div>
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <div className="h-[420px] animate-pulse rounded-3xl bg-white/5" />
            <div className="h-[200px] animate-pulse rounded-3xl bg-white/5" />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <div className="h-[300px] animate-pulse rounded-3xl bg-white/5" />
            <div className="h-[200px] animate-pulse rounded-3xl bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-dark text-brand-cream">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-md text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
          <XCircle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="mb-2 font-serif text-2xl font-bold text-brand-cream">
          Order Not Found
        </h1>
        <p className="mb-8 text-brand-cream/60">{message}</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 px-6 py-3 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/10"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-brand-dark transition-colors hover:bg-brand-cream"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

function CancelledBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4"
    >
      <XCircle className="h-5 w-5 shrink-0 text-red-400" />
      <div>
        <p className="font-serif font-bold text-red-300">Order Cancelled</p>
        <p className="text-sm text-red-300/70">
          This order has been cancelled. If you were charged, a refund will be
          processed within 5-7 business days.
        </p>
      </div>
    </motion.div>
  );
}

function StatusStepper({ order }: { order: Order }) {
  const isCancelled = order.status === "Cancelled";
  const currentIndex = getStepIndex(order.status);

  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-white/5" />

      {/* Animated filled connector */}
      {!isCancelled && currentIndex >= 0 && (
        <motion.div
          className="absolute left-[19px] top-4 w-0.5 bg-brand-gold/60"
          initial={{ height: 0 }}
          animate={{
            height: `${Math.min(100, (currentIndex / (ORDER_STEPS.length - 1)) * 100)}%`,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}

      <div className="relative space-y-8">
        {ORDER_STEPS.map((step, index) => {
          const isCompleted = !isCancelled && index < currentIndex;
          const isCurrent = !isCancelled && index === currentIndex;
          const isPending = isCancelled || index > currentIndex;

          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.status}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="relative flex items-start gap-4"
            >
              {/* Step circle */}
              <div
                className={`
                  relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                  border-2 transition-all duration-500
                  ${
                    isCompleted
                      ? "border-brand-gold bg-brand-gold text-brand-dark"
                      : isCurrent
                        ? "border-brand-gold bg-brand-gold/20 text-brand-gold shadow-[0_0_20px_rgba(197,160,89,0.35)]"
                        : "border-white/10 bg-white/5 text-white/25"
                  }
                  ${isCancelled ? "border-white/5 bg-white/5 text-white/15" : ""}
                `}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}

                {/* Pulse ring for current step */}
                {isCurrent && (
                  <span className="absolute inset-0 animate-ping rounded-full border-2 border-brand-gold/30" />
                )}
              </div>

              {/* Step content */}
              <div className={`pt-1 ${isPending && !isCancelled ? "opacity-40" : ""} ${isCancelled ? "opacity-25" : ""}`}>
                <h3
                  className={`font-serif text-base font-bold leading-tight ${
                    isCurrent
                      ? "text-brand-gold"
                      : isCompleted
                        ? "text-brand-cream"
                        : "text-brand-cream/60"
                  }`}
                >
                  {step.label}
                </h3>
                <p className="text-sm text-brand-cream/50">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function EstimatedTimeCard({ order }: { order: Order }) {
  const { minutes, seconds, remainingSeconds, progress } = useCountdown(order);

  if (
    !order.estimatedTime ||
    order.status === "Delivered" ||
    order.status === "Cancelled"
  ) {
    return null;
  }

  const isOverdue = remainingSeconds === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-brand-gold/10 bg-white/5 p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-brand-gold" />
          <span className="text-xs font-bold uppercase tracking-widest text-brand-cream/50">
            Estimated Time
          </span>
        </div>
        <span className="text-xs text-brand-cream/40">
          ~{order.estimatedTime} min total
        </span>
      </div>

      {/* Countdown display */}
      <div className="mb-4 text-center">
        {isOverdue ? (
          <p className="font-serif text-2xl font-bold text-brand-gold">
            Arriving any moment...
          </p>
        ) : (
          <p className="font-serif text-3xl font-bold tabular-nums text-brand-gold">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
        )}
        <p className="mt-1 text-xs text-brand-cream/40">
          {isOverdue ? "Your order is on its way" : "remaining"}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-gold/80 to-brand-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function OrderItemsList({ order }: { order: Order }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-6 shadow-2xl backdrop-blur-md sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-brand-gold/10 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-brand-gold">
            Order Items
          </h2>
          <p className="text-xs text-brand-cream/50">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-3">
        {order.items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + idx * 0.05 }}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-colors hover:border-brand-gold/10"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-xs font-bold text-brand-gold">
                {item.quantity}x
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-brand-cream">
                  {item.name}
                </p>
                {item.itemNotes && (
                  <p className="truncate text-xs text-brand-cream/40 italic">
                    {item.itemNotes}
                  </p>
                )}
              </div>
            </div>
            <p className="shrink-0 font-semibold text-brand-gold">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-6 space-y-2 border-t border-white/5 pt-5 text-sm">
        <div className="flex justify-between text-brand-cream/60">
          <span>Subtotal</span>
          <span className="text-brand-cream">{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-brand-cream/60">
          <span>GST (5%)</span>
          <span className="text-brand-cream">{formatCurrency(order.gst)}</span>
        </div>
        {order.orderType === "delivery" && (
          <div className="flex justify-between text-brand-cream/60">
            <span>Delivery Fee</span>
            <span className="text-brand-cream">
              {order.deliveryFee > 0 ? formatCurrency(order.deliveryFee) : "Free"}
            </span>
          </div>
        )}
        <div className="mt-2 border-t border-white/10 pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-brand-cream">Total</span>
            <span className="text-brand-gold">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CustomerInfoCard({ order }: { order: Order }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-6 shadow-2xl backdrop-blur-md sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-brand-gold/10 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
          <User className="h-5 w-5" />
        </div>
        <h2 className="font-serif text-xl font-bold text-brand-gold">
          Delivery Details
        </h2>
      </div>

      <div className="space-y-4">
        {/* Customer name */}
        {order.customerName && (
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold/60" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                Name
              </p>
              <p className="text-brand-cream">{order.customerName}</p>
            </div>
          </div>
        )}

        {/* Phone */}
        {order.customerPhone && (
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold/60" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                Phone
              </p>
              <p className="text-brand-cream">{order.customerPhone}</p>
            </div>
          </div>
        )}

        {/* Delivery address */}
        {order.deliveryAddress && order.orderType === "delivery" && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold/60" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                Delivery Address
              </p>
              <p className="text-brand-cream">{order.deliveryAddress}</p>
            </div>
          </div>
        )}

        {/* Order type & payment */}
        <div className="mt-2 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
          <div className="rounded-xl bg-white/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/40">
              Order Type
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-cream">
              {ORDER_TYPE_LABELS[order.orderType] ?? order.orderType}
            </p>
          </div>
          <div className="rounded-xl bg-white/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/40">
              Payment
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-cream">
              {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Payment status */}
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-brand-gold/60" />
          <span className="text-xs text-brand-cream/50">Payment Status:</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
              order.paymentStatus === "paid"
                ? "bg-green-500/10 text-green-400"
                : order.paymentStatus === "failed"
                  ? "bg-red-500/10 text-red-400"
                  : order.paymentStatus === "refunded"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-yellow-500/10 text-yellow-400"
            }`}
          >
            {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
          </span>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/40">
              Order Notes
            </p>
            <p className="mt-1 text-sm italic text-brand-cream/70">
              {order.notes}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---- Fetch logic ----
  const fetchOrder = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!orderId) return;

      if (!opts?.silent) setLoading(true);
      else setIsRefreshing(true);

      setError(null);

      try {
        const data = await getOrderById(orderId);
        if (!data) {
          setError("We could not find an order with this ID. Please check the link and try again.");
          setOrder(null);
        } else {
          setOrder(data);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while fetching your order."
        );
      } finally {
        setLoading(false);
        setIsRefreshing(false);
        setLastRefreshed(new Date());
      }
    },
    [orderId]
  );

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Polling every 15 seconds (skip if order is terminal)
  useEffect(() => {
    const isTerminal =
      order?.status === "Delivered" || order?.status === "Cancelled";

    if (isTerminal) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }

    pollRef.current = setInterval(() => {
      fetchOrder({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchOrder, order?.status]);

  // ---- Render states ----
  if (loading && !order) return <LoadingSkeleton />;
  if (error && !order) return <ErrorState message={error} onRetry={() => fetchOrder()} />;
  if (!order) return <ErrorState message="Order data is unavailable." onRetry={() => fetchOrder()} />;

  const isCancelled = order.status === "Cancelled";
  const isDelivered = order.status === "Delivered";
  const currentIndex = getStepIndex(order.status);

  return (
    <main className="min-h-screen bg-brand-dark text-brand-cream relative pt-28 pb-16">
      {/* Subtle background texture overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.04),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-brand-cream/60 transition-colors hover:border-brand-gold/30 hover:text-brand-gold"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-brand-gold sm:text-3xl">
                Track Your Order
              </h1>
              <p className="text-sm text-brand-cream/50">
                Order{" "}
                <span className="font-mono text-brand-cream/70">
                  #{order.id.length > 8 ? order.id.slice(0, 8) : order.id}
                </span>
                <span className="mx-2 text-brand-cream/20">|</span>
                Placed {formatTimestamp(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Refresh indicator */}
          <div className="flex items-center gap-3">
            {!isDelivered && !isCancelled && (
              <button
                onClick={() => fetchOrder({ silent: true })}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-brand-cream/60 transition-colors hover:border-brand-gold/30 hover:text-brand-gold disabled:opacity-40"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            )}

            {/* Current status badge */}
            <div
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
                isCancelled
                  ? "border border-red-500/20 bg-red-500/10 text-red-400"
                  : isDelivered
                    ? "border border-green-500/20 bg-green-500/10 text-green-400"
                    : "border border-brand-gold/20 bg-brand-gold/10 text-brand-gold"
              }`}
            >
              {order.status}
            </div>
          </div>
        </motion.div>

        {/* Cancelled banner */}
        <AnimatePresence>
          {isCancelled && (
            <div className="mb-6">
              <CancelledBanner />
            </div>
          )}
        </AnimatePresence>

        {/* Delivered banner */}
        <AnimatePresence>
          {isDelivered && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
              <div>
                <p className="font-serif font-bold text-green-300">
                  Order Delivered
                </p>
                <p className="text-sm text-green-300/70">
                  Your order has been delivered. We hope you enjoy your meal!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left column: Status stepper + estimated time */}
          <div className="space-y-6 lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-6 shadow-2xl backdrop-blur-md sm:p-8"
            >
              <div className="mb-8 flex items-center gap-3 border-b border-brand-gold/10 pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-brand-gold">
                    Order Progress
                  </h2>
                  <p className="text-xs text-brand-cream/50">
                    {isCancelled
                      ? "This order was cancelled"
                      : isDelivered
                        ? "Order complete"
                        : "Live status updates every 15 seconds"}
                  </p>
                </div>
                {!isDelivered && !isCancelled && isRefreshing && (
                  <Loader2 className="ml-auto h-4 w-4 animate-spin text-brand-gold/50" />
                )}
              </div>

              <StatusStepper order={order} />
            </motion.div>

            {/* Estimated time countdown */}
            <EstimatedTimeCard order={order} />

            {/* Order items */}
            <OrderItemsList order={order} />
          </div>

          {/* Right column: Customer info */}
          <div className="space-y-6 lg:col-span-2">
            <CustomerInfoCard order={order} />

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-3"
            >
              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-gold/20 bg-brand-gold/5 px-6 py-4 font-serif text-sm font-bold text-brand-gold transition-all hover:bg-brand-gold/10"
              >
                <UtensilsCrossed className="h-4 w-4" />
                Order Again
              </Link>

              <Link
                href="/contact"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-brand-cream/60 transition-all hover:border-brand-gold/20 hover:text-brand-cream"
              >
                <Phone className="h-4 w-4" />
                Need Help? Contact Us
              </Link>
            </motion.div>

            {/* Auto-refresh notice */}
            {!isDelivered && !isCancelled && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-[11px] text-brand-cream/30"
              >
                Auto-refreshes every 15 seconds
                <br />
                Last updated: {lastRefreshed.toLocaleTimeString("en-IN")}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
