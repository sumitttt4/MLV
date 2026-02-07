"use client";

import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";
import { useCart } from "@/store/useCart";

interface CheckoutDialogProps {
  customerId?: string | null;
  notes?: string | null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(value);

export function CheckoutDialog({ customerId, notes }: CheckoutDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCart((state) => state.items);
  const clearCart = useCart((state) => state.clearCart);
  const getTotal = useCart((state) => state.getTotal);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

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

  const total = getTotal();

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded-full bg-brand-maroon px-5 py-2 text-sm font-semibold text-brand-cream shadow-sm transition hover:bg-brand-maroon/90">
          Checkout
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-xl font-semibold text-brand-maroon">
              Complete payment
            </Dialog.Title>
            <Dialog.Close className="text-sm text-brand-maroon/70">
              Close
            </Dialog.Close>
          </div>
          <p className="mt-2 text-sm text-brand-maroon/70">
            Confirm your total and pay securely with Razorpay.
          </p>

          <div className="mt-6 space-y-3 text-sm text-brand-maroon">
            {cartLines.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-brand-maroon/20 p-4 text-sm text-brand-maroon/70">
                Your cart is empty.
              </p>
            ) : (
              cartLines.map((line) => (
                <div
                  key={line.menuItemId}
                  className="flex items-center justify-between"
                >
                  <span>
                    {line.quantity} × {line.name}
                  </span>
                  <span>
                    {formatCurrency(line.price * line.quantity)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* User Details Form */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-maroon/60 mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-brand-maroon/20 px-4 py-2 text-sm text-brand-maroon placeholder:text-brand-maroon/30 focus:border-brand-maroon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-maroon/60 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-brand-maroon/20 px-4 py-2 text-sm text-brand-maroon placeholder:text-brand-maroon/30 focus:border-brand-maroon focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-maroon/60 mb-1">Delivery Address *</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Flat No, Street, Landmark..."
                rows={2}
                className="w-full rounded-xl border border-brand-maroon/20 px-4 py-2 text-sm text-brand-maroon placeholder:text-brand-maroon/30 focus:border-brand-maroon focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-brand-cream px-4 py-3 text-sm">
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-6">
            <RazorpayButton
              amount={total}
              cart={cartLines}
              userDetails={{
                fullName,
                phoneNumber,
                deliveryAddress,
                customerId: customerId ?? null,
                notes: notes ?? null
              }}
              disabled={!fullName || !phoneNumber || !deliveryAddress}
              onSuccess={() => {
                clearCart();
                setIsOpen(false);
              }}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
