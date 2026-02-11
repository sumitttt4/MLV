"use client";

import { useMemo, useState, useEffect } from "react";
import { useCart, type CartItem } from "@/store/useCart";
import { getDeliveryZones, placeOrder } from "@/lib/api";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";
import type { DeliveryZone, OrderType, PaymentMethod } from "@/types/schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Minus, Plus, Truck, ShoppingBag, UtensilsCrossed } from "lucide-react";

/* ───────────────────── helpers ───────────────────── */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);

const PHONE_REGEX = /^\d{10}$/;

const ORDER_TYPE_OPTIONS: {
  value: OrderType;
  label: string;
  icon: typeof Truck;
}[] = [
  { value: "delivery", label: "Delivery", icon: Truck },
  { value: "pickup", label: "Pickup", icon: ShoppingBag },
  { value: "dine_in", label: "Dine-in", icon: UtensilsCrossed },
];

/* ───────────────────── page ───────────────────── */

export default function CheckoutPage() {
  const router = useRouter();

  /* ── cart store ── */
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clearCart);
  const getSubtotal = useCart((s) => s.getSubtotal);
  const getGst = useCart((s) => s.getGst);
  const getTotal = useCart((s) => s.getTotal);
  const getDeliveryFee = useCart((s) => s.getDeliveryFee);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const updateItemNotes = useCart((s) => s.updateItemNotes);
  const orderType = useCart((s) => s.orderType);
  const setOrderType = useCart((s) => s.setOrderType);
  const deliveryFee = useCart((s) => s.deliveryFee);
  const setDeliveryFee = useCart((s) => s.setDeliveryFee);

  /* ── local state ── */
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [placingOrder, setPlacingOrder] = useState(false);

  /* delivery zones */
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");

  useEffect(() => {
    getDeliveryZones().then((data) => {
      setZones(data);
      if (data.length > 0 && !selectedZoneId) {
        setSelectedZoneId(data[0].id);
        setDeliveryFee(data[0].deliveryFee);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* keep delivery fee in sync with zone selection */
  useEffect(() => {
    if (orderType !== "delivery") {
      setDeliveryFee(0);
      return;
    }
    const zone = zones.find((z) => z.id === selectedZoneId);
    setDeliveryFee(zone?.deliveryFee ?? 0);
  }, [selectedZoneId, orderType, zones, setDeliveryFee]);

  /* COD only available for delivery */
  useEffect(() => {
    if (orderType !== "delivery" && paymentMethod === "cod") {
      setPaymentMethod("online");
    }
  }, [orderType, paymentMethod]);

  /* ── derived values ── */
  const subtotal = getSubtotal();
  const gst = getGst();
  const currentDeliveryFee = getDeliveryFee();
  const total = getTotal();

  const cartLines = useMemo(
    () =>
      items.map((entry: CartItem) => ({
        menuItemId: entry.item.id,
        name: entry.item.name,
        price: entry.item.price,
        quantity: entry.quantity,
        notes: entry.notes || undefined,
      })),
    [items],
  );

  const phoneValid = PHONE_REGEX.test(phoneNumber.replace(/\s/g, ""));
  const phoneTouched = phoneNumber.length > 0;

  const formReady = (() => {
    if (!fullName.trim()) return false;
    if (!phoneValid) return false;
    if (orderType === "delivery" && !deliveryAddress.trim()) return false;
    if (orderType === "dine_in" && !tableNumber.trim()) return false;
    if (items.length === 0) return false;
    return true;
  })();

  /* ── COD handler ── */
  const handleCodOrder = async () => {
    if (!formReady) return;
    setPlacingOrder(true);
    try {
      const resolvedAddress =
        orderType === "delivery"
          ? deliveryAddress
          : orderType === "pickup"
            ? "Pickup - Hotel MLV Grand, Budigere Main Road"
            : `Dine-in - Table ${tableNumber}`;

      const orderId = await placeOrder({
        cart: cartLines,
        userDetails: {
          fullName,
          phoneNumber: phoneNumber.replace(/\s/g, ""),
          deliveryAddress: resolvedAddress,
          notes: notes || null,
        },
        orderType,
        paymentMethod: "cod",
        deliveryFee: currentDeliveryFee,
      });

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order/${orderId}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to place order.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ── resolved address for Razorpay flow ── */
  const resolvedAddress =
    orderType === "delivery"
      ? deliveryAddress
      : orderType === "pickup"
        ? "Pickup - Hotel MLV Grand, Budigere Main Road"
        : `Dine-in - Table ${tableNumber}`;

  /* ════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════ */

  return (
    <main className="min-h-screen bg-brand-dark text-brand-cream relative pt-20 sm:pt-28">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-[1px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-20 lg:flex-row">
        {/* ──────────── LEFT: Cart Items ──────────── */}
        <section className="flex-1 space-y-6">
          {/* Order Type Toggle */}
          <div className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-6 shadow-2xl backdrop-blur-md">
            <h2 className="mb-4 font-serif text-lg font-bold text-brand-gold">
              How would you like your order?
            </h2>
            <div className="flex gap-3">
              {ORDER_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => {
                const active = orderType === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setOrderType(value)}
                    className={`flex flex-1 flex-col items-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold transition-all ${
                      active
                        ? "border-brand-gold bg-brand-gold/10 text-brand-gold shadow-lg shadow-brand-gold/5"
                        : "border-white/10 bg-white/5 text-brand-cream/60 hover:border-brand-gold/30 hover:text-brand-cream"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Conditional sub-info */}
            {orderType === "pickup" && (
              <p className="mt-4 rounded-xl border border-brand-gold/10 bg-brand-gold/5 px-4 py-3 text-sm text-brand-cream/80">
                Pick up at:{" "}
                <span className="font-semibold text-brand-gold">
                  Hotel MLV Grand, Budigere Main Road
                </span>
              </p>
            )}

            {orderType === "dine_in" && (
              <div className="mt-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                  Table Number
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/20 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. 12"
                />
              </div>
            )}

            {orderType === "delivery" && zones.length > 0 && (
              <div className="mt-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40">
                  Delivery Zone
                </label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                >
                  {zones.map((zone) => (
                    <option
                      key={zone.id}
                      value={zone.id}
                      className="bg-brand-dark text-brand-cream"
                    >
                      {zone.zoneName}
                      {zone.deliveryFee === 0
                        ? " - Free delivery"
                        : ` - ${formatCurrency(zone.deliveryFee)}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Cart Items Card */}
          <div className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-5 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-4 border-b border-brand-gold/10 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <span className="font-serif text-xl font-bold">1</span>
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-brand-gold">
                  Your Order
                </h1>
                <p className="text-sm text-brand-cream/60">
                  Review your selection before payment
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                  <div className="rounded-full bg-brand-gold/5 p-6">
                    <UtensilsCrossed className="h-10 w-10 text-brand-gold/40" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-brand-cream/80">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-brand-cream/40">
                      Head back to the menu to add delicious items
                    </p>
                  </div>
                  <Link
                    href="/"
                    className="mt-4 rounded-full bg-brand-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-all hover:bg-brand-cream hover:scale-105"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                items.map((entry) => (
                  <div key={entry.item.id} className="group">
                    {/* Item row */}
                    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 transition-all hover:border-brand-gold/20 hover:bg-white/10">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10">
                          <Image
                            src={
                              entry.item.imageUrl ||
                              "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=100&q=60"
                            }
                            alt={entry.item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="font-serif font-medium text-brand-cream transition-colors group-hover:text-brand-gold">
                            {entry.item.name}
                          </p>
                          <p className="text-xs text-brand-cream/50">
                            {formatCurrency(entry.item.price)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              entry.quantity <= 1
                                ? removeItem(entry.item.id)
                                : updateQuantity(
                                    entry.item.id,
                                    entry.quantity - 1,
                                  )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-cream/70 transition-all hover:border-brand-gold/40 hover:bg-brand-gold/10 hover:text-brand-gold"
                            aria-label={`Decrease quantity of ${entry.item.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          <span className="w-8 text-center text-sm font-bold text-brand-cream">
                            {entry.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                entry.item.id,
                                entry.quantity + 1,
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-cream/70 transition-all hover:border-brand-gold/40 hover:bg-brand-gold/10 hover:text-brand-gold"
                            aria-label={`Increase quantity of ${entry.item.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <p className="w-24 text-right font-bold text-brand-gold">
                          {formatCurrency(entry.item.price * entry.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Item notes */}
                    <div className="mt-1 px-3">
                      <input
                        type="text"
                        placeholder="Special instructions (e.g. extra spicy, no onion)"
                        value={entry.notes}
                        onChange={(e) =>
                          updateItemNotes(entry.item.id, e.target.value)
                        }
                        className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-xs text-brand-cream/60 placeholder:text-white/15 transition-all focus:border-brand-gold/20 focus:bg-white/5 focus:outline-none"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ──────────── RIGHT: Details & Payment ──────────── */}
        <aside className="w-full max-w-lg space-y-6">
          {/* Customer Details Card */}
          <div className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-5 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-center gap-4 border-b border-brand-gold/10 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <span className="font-serif text-xl font-bold">2</span>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-gold">
                  Details
                </h2>
                <p className="text-sm text-brand-cream/60">
                  {orderType === "delivery"
                    ? "Delivery information"
                    : orderType === "pickup"
                      ? "Pickup information"
                      : "Dine-in information"}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40 transition-colors group-focus-within:text-brand-gold">
                  Full Name
                </label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/20 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40 transition-colors group-focus-within:text-brand-gold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className={`w-full rounded-xl border bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/20 transition-all focus:bg-black/40 focus:outline-none focus:ring-1 ${
                    phoneTouched && !phoneValid
                      ? "border-red-500/60 focus:border-red-500/80 focus:ring-red-500/40"
                      : "border-white/10 focus:border-brand-gold/50 focus:ring-brand-gold/50"
                  }`}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                  required
                />
                {phoneTouched && !phoneValid && (
                  <p className="mt-1.5 text-xs text-red-400">
                    Enter a valid 10-digit phone number
                  </p>
                )}
              </div>

              {/* Delivery Address -- only for delivery orders */}
              {orderType === "delivery" && (
                <div className="group">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40 transition-colors group-focus-within:text-brand-gold">
                    Delivery Address
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/20 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                    rows={3}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Flat No, Street, Landmark..."
                    required
                  />
                </div>
              )}

              {/* Kitchen Notes */}
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40 transition-colors group-focus-within:text-brand-gold">
                  Kitchen Notes
                </label>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/20 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, spice level, etc."
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-5 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-center gap-4 border-b border-brand-gold/10 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <span className="font-serif text-xl font-bold">3</span>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-gold">
                  Payment
                </h2>
                <p className="text-sm text-brand-cream/60">
                  Choose your payment method
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("online")}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                  paymentMethod === "online"
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                    : "border-white/10 bg-white/5 text-brand-cream/60 hover:border-brand-gold/30 hover:text-brand-cream"
                }`}
              >
                Pay Online (Razorpay)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                disabled={orderType !== "delivery"}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                  paymentMethod === "cod"
                    ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                    : orderType !== "delivery"
                      ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-brand-cream/20"
                      : "border-white/10 bg-white/5 text-brand-cream/60 hover:border-brand-gold/30 hover:text-brand-cream"
                }`}
              >
                Cash on Delivery
              </button>
            </div>

            {orderType !== "delivery" && (
              <p className="mt-2 text-xs text-brand-cream/30">
                Cash on Delivery is only available for delivery orders.
              </p>
            )}
          </div>

          {/* Payment Summary Card */}
          <div className="relative overflow-hidden rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-brand-dark to-black p-5 sm:p-8 shadow-2xl">
            {/* Decorative Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-gold/10 blur-[50px]" />

            <h3 className="mb-6 font-serif text-xl font-bold text-brand-gold">
              Price Breakdown
            </h3>

            <div className="space-y-3 text-sm text-brand-cream/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-brand-cream">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-medium text-brand-cream">
                  {formatCurrency(gst)}
                </span>
              </div>
              {orderType === "delivery" && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-brand-cream">
                    {currentDeliveryFee === 0
                      ? "Free"
                      : formatCurrency(currentDeliveryFee)}
                  </span>
                </div>
              )}
              <div className="my-4 border-t border-white/10" />
              <div className="flex justify-between text-xl font-bold text-brand-gold">
                <span>Total To Pay</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-8">
              {paymentMethod === "online" ? (
                <RazorpayButton
                  amount={total}
                  cart={cartLines}
                  userDetails={{
                    fullName,
                    phoneNumber: phoneNumber.replace(/\s/g, ""),
                    deliveryAddress: resolvedAddress,
                    notes: notes || null,
                  }}
                  disabled={!formReady}
                  onSuccess={() => {
                    clearCart();
                  }}
                />
              ) : (
                <button
                  type="button"
                  onClick={handleCodOrder}
                  disabled={!formReady || placingOrder}
                  className="w-full rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-cream disabled:cursor-not-allowed disabled:bg-brand-maroon/40"
                >
                  {placingOrder
                    ? "Placing order..."
                    : !formReady
                      ? "Complete all fields to order"
                      : "Place Order (Cash on Delivery)"}
                </button>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-brand-cream/30 uppercase tracking-widest">
                <span>
                  {paymentMethod === "online"
                    ? "Secured by Razorpay"
                    : "Pay when your order arrives"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
