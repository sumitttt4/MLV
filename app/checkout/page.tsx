"use client";

import { useMemo, useState } from "react";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";
import { useCart } from "@/store/useCart";

export default function CheckoutPage() {
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const getSubtotal = useCart((state) => state.getSubtotal);
  const getGst = useCart((state) => state.getGst);
  const getTotal = useCart((state) => state.getTotal);

  const [customerId, setCustomerId] = useState("");
  const [notes, setNotes] = useState("");

  const cartLines = useMemo(
    () =>
      items.map((entry) => ({
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(value);

  return (
    <main className="min-h-screen bg-brand-cream text-brand-maroon">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12 lg:flex-row">
        <section className="flex-1 rounded-3xl bg-white/70 p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-brand-maroon/70">
            Review your cart and share any notes for the kitchen.
          </p>

          <div className="mt-6 space-y-4">
            {items.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-brand-maroon/20 p-4 text-sm text-brand-maroon/70">
                Your cart is empty. Head back to the menu to add delicious
                items.
              </p>
            ) : (
              items.map((entry) => (
                <div
                  key={entry.item.id}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"
                >
                  <div>
                    <p className="font-medium">{entry.item.name}</p>
                    <p className="text-xs text-brand-maroon/60">
                      {entry.quantity} × {formatCurrency(entry.item.price)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(entry.item.price * entry.quantity)}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold">Order details</h2>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              Customer ID (optional)
              <input
                className="mt-2 w-full rounded-2xl border border-brand-maroon/10 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-maroon/40 focus:outline-none"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                placeholder="Enter your customer profile ID"
              />
            </label>
            <label className="block text-sm font-medium">
              Notes for the kitchen
              <textarea
                className="mt-2 w-full rounded-2xl border border-brand-maroon/10 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-maroon/40 focus:outline-none"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Allergies, spice level, or special requests"
              />
            </label>

            <div className="space-y-2 rounded-2xl bg-brand-cream px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST (5%)</span>
                <span>{formatCurrency(gst)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {cartLines.length === 0 ? (
              <button
                type="button"
                disabled
                className="w-full rounded-full bg-brand-maroon/40 px-6 py-3 text-sm font-semibold text-white shadow-sm"
              >
                Add items to pay
              </button>
            ) : (
              <RazorpayButton
                amount={total}
                cart={cartLines}
                userDetails={{
                  customerId: customerId.trim() || null,
                  notes: notes.trim() || null
                }}
                onSuccess={clearCart}
              />
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
