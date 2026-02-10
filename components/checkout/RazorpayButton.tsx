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
    fullName: string;
    phoneNumber: string;
    deliveryAddress: string;
    notes?: string | null;
    customerId?: string | null;
  };
  orderType?: "delivery" | "pickup" | "dine_in";
  paymentMethod?: "online" | "cod";
  deliveryFee?: number;
  onSuccess?: () => void;
  disabled?: boolean;
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
  orderType = "delivery",
  paymentMethod = "online",
  deliveryFee = 0,
  onSuccess,
  disabled
}: RazorpayButtonProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    setIsPaying(true);

    try {
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

      // Mock Mode Bypass
      if (orderId.includes("mock")) {
        // Simulate a short delay then success
        setTimeout(async () => {
          try {
            const paymentDetails: PaymentDetails = {
              razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(7)}`,
              razorpayOrderId: orderId,
              razorpaySignature: "mock_signature"
            };
            const orderRecordId = await createOrder({
              cart,
              userDetails,
              payment: paymentDetails,
              orderType,
              paymentMethod,
              deliveryFee,
            });
            onSuccess?.();
            router.push(`/order/${orderRecordId}`);
          } catch (e) {
            toast.error("Mock Order Creation Failed");
          } finally {
            setIsPaying(false);
          }
        }, 1500);
        return;
      }

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay is unavailable.");
      }

      const razorpay = new window.Razorpay({
        key,
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Hotel MLV Grand",
        order_id: orderId,
        theme: { color: "#4A1F1A" },
        handler: async (payment) => {
          try {
            // 1. Verify Payment on Server
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: payment.razorpay_order_id,
                razorpay_payment_id: payment.razorpay_payment_id,
                razorpay_signature: payment.razorpay_signature
              })
            });

            const verifyResult = await verifyResponse.json();

            if (!verifyResult.success) {
              throw new Error(verifyResult.error || "Payment verification failed");
            }

            // 2. Create Order after successful verification
            const paymentDetails: PaymentDetails = {
              razorpayPaymentId: payment.razorpay_payment_id,
              razorpayOrderId: payment.razorpay_order_id,
              razorpaySignature: payment.razorpay_signature
            };

            const orderRecordId = await createOrder({
              cart,
              userDetails,
              payment: paymentDetails,
              orderType,
              paymentMethod,
              deliveryFee,
            });

            onSuccess?.();
            router.push(`/order/${orderRecordId}`);
          } catch (error) {
            toast.error("Payment successful but verification failed. Please contact support.");
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
      disabled={isPaying || disabled}
      className="w-full rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-dark shadow-sm transition hover:bg-brand-cream disabled:cursor-not-allowed disabled:bg-brand-maroon/40"
    >
      {isPaying ? "Opening payment..." : disabled ? "Enter Address to Order" : "Pay with Razorpay"}
    </button>
  );
}
