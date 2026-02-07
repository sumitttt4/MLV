"use client";

import { useMemo, useState } from "react";
import { useCart, type CartItem } from "@/store/useCart";
import Link from "next/link";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(value);

export default function CheckoutPage() {
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const getSubtotal = useCart((state) => state.getSubtotal);
  const getGst = useCart((state) => state.getGst);
  const getTotal = useCart((state) => state.getTotal);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  const cartLines = useMemo(
    () =>
      items.map((entry: CartItem) => ({
        menuItemId: entry.item.id,
        name: entry.item.name,
        price: entry.item.price,
        quantity: entry.quantity
      })),
    [items]
  );

  const subtotal = getSubtotal();
  const gst = getGst();
  const total = getTotal();

  return (
    <main className="min-h-screen bg-brand-dark bg-hero-texture text-brand-cream relative pt-28">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-[1px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20 lg:flex-row">
        {/* Left Section: Cart Items */}
        <section className="flex-1 rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-4 border-b border-brand-gold/10 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
              <span className="font-serif text-xl font-bold">1</span>
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-brand-gold">Your Order</h1>
              <p className="text-sm text-brand-cream/60">Review your selection before payment</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                <div className="rounded-full bg-brand-gold/5 p-6">
                  <span className="text-4xl">🍽️</span>
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
                  className="mt-4 rounded-full bg-brand-gold px-8 py-3 text-sm font-bold uppercase tracking-widest text-brand-dark transition-all hover:bg-white hover:scale-105"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              items.map((entry) => (
                <div
                  key={entry.item.id}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 transition-all hover:border-brand-gold/20 hover:bg-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10">
                      {/* Use Image component or img tag if easy access provided */}
                      <img
                        src={entry.item.imageUrl || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=100&q=60"}
                        alt={entry.item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-serif font-medium text-brand-cream group-hover:text-brand-gold transition-colors">{entry.item.name}</p>
                      <p className="text-xs text-brand-cream/50">
                        {formatCurrency(entry.item.price)} x {entry.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-brand-gold">
                    {formatCurrency(entry.item.price * entry.quantity)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Section: Details & Payment */}
        <aside className="w-full max-w-lg space-y-6">
          {/* Customer Details Card */}
          <div className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-6 flex items-center gap-4 border-b border-brand-gold/10 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <span className="font-serif text-xl font-bold">2</span>
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-gold">Details</h2>
                <p className="text-sm text-brand-cream/60">Delivery information</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40 transition-colors group-focus-within:text-brand-gold">Full Name</label>
                <input
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/10 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40 transition-colors group-focus-within:text-brand-gold">Phone Number</label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/10 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40 transition-colors group-focus-within:text-brand-gold">Delivery Address</label>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/10 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                  rows={3}
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="Flat No, Street, Landmark..."
                  required
                />
              </div>

              <div className="group">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-brand-cream/40 transition-colors group-focus-within:text-brand-gold">Kitchen Notes</label>
                <textarea
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-brand-cream placeholder:text-white/10 transition-all focus:border-brand-gold/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
                  rows={2}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Allergies, spice level, e.g."
                />
              </div>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="relative overflow-hidden rounded-3xl border border-brand-gold/20 bg-gradient-to-br from-brand-dark to-black p-8 shadow-2xl">
            {/* Decorative Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-gold/10 blur-[50px]" />

            <h3 className="mb-6 font-serif text-xl font-bold text-brand-gold">Payment Summary</h3>

            <div className="space-y-3 text-sm text-brand-cream/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-brand-cream">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span className="font-medium text-brand-cream">{formatCurrency(gst)}</span>
              </div>
              <div className="my-4 border-t border-white/10" />
              <div className="flex justify-between text-xl font-bold text-brand-gold">
                <span>Total To Pay</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-8">
              <RazorpayButton
                amount={total}
                cart={cartLines}
                userDetails={{
                  fullName,
                  phoneNumber,
                  deliveryAddress,
                  notes: notes || null
                }}
                disabled={!fullName || !phoneNumber || !deliveryAddress}
                onSuccess={() => {
                  clearCart();
                }}
              />
              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-brand-cream/30 uppercase tracking-widest">
                <span>🛡️ Secured by Razorpay</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
