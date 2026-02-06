"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createOrder, type CartLine, type PaymentDetails } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  theme: {
    color: string;
  };
}

interface RazorpayButtonProps {
  amount: number;
  cart: CartLine[];
  userDetails: {
    customerId: string | null;
    notes?: string | null;
  };
  onSuccess?: () => void;
}

const razorpayScriptSrc = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${razorpayScriptSrc}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = razorpayScriptSrc;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay."));
    document.body.appendChild(script);
  });
}

export function RazorpayButton({
  amount,
  cart,
  userDetails,
  onSuccess
}: RazorpayButtonProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    setIsPaying(true);

    try {
      await loadRazorpayScript();
      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        throw new Error("Unable to initiate payment.");
      }

      const { orderId, key } = (await response.json()) as {
        orderId: string;
        key: string;
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay is unavailable.");
      }

      const razorpay = new window.Razorpay({
        key,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Hotel MLV Grand",
        order_id: orderId,
        theme: { color: "#4A0404" },
        handler: async (payment) => {
          try {
            const paymentDetails: PaymentDetails = {
              razorpayPaymentId: payment.razorpay_payment_id,
              razorpayOrderId: payment.razorpay_order_id,
              razorpaySignature: payment.razorpay_signature
            };
            const orderRecordId = await createOrder({
              cart,
              userDetails,
              payment: paymentDetails
            });
            onSuccess?.();
            router.push(`/order/${orderRecordId}`);
          } catch (error) {
            toast.error("Payment Failed");
          }
        }
      });

      razorpay.open();
    } catch (error) {
      toast.error("Payment Failed");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={isPaying}
      className="w-full rounded-full bg-brand-maroon px-6 py-3 text-sm font-semibold text-brand-cream shadow-sm transition hover:bg-brand-maroon/90 disabled:cursor-not-allowed disabled:bg-brand-maroon/40"
    >
      {isPaying ? "Opening payment..." : "Pay with Razorpay"}
    </button>
  );
}
