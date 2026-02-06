import crypto from "crypto";

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import type { CartLine, PaymentDetails } from "@/lib/api";

interface VerifyOrderRequest {
  cart: CartLine[];
  userDetails: {
    customerId: string | null;
    notes?: string | null;
  };
  payment: PaymentDetails;
}

function buildPaymentNotes(payment: PaymentDetails) {
  return `Payment: ${payment.razorpayPaymentId} | ${payment.razorpayOrderId} | ${payment.razorpaySignature}`;
}

export async function POST(request: Request) {
  try {
    const { cart, userDetails, payment } =
      (await request.json()) as VerifyOrderRequest;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (
      !payment?.razorpayOrderId ||
      !payment.razorpayPaymentId ||
      !payment.razorpaySignature
    ) {
      return NextResponse.json(
        { error: "Missing payment details." },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
    if (!secret) {
      return NextResponse.json(
        { error: "Payment verification unavailable." },
        { status: 500 }
      );
    }

    const payload = `${payment.razorpayOrderId}|${payment.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== payment.razorpaySignature) {
      return NextResponse.json(
        { error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      "";

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Order creation unavailable." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const subtotal = cart.reduce(
      (total, line) => total + line.price * line.quantity,
      0
    );
    const gst = Number((subtotal * 0.05).toFixed(2));
    const total = Number((subtotal + gst).toFixed(2));
    const paymentNotes = buildPaymentNotes(payment);
    const mergedNotes = userDetails?.notes
      ? `${userDetails.notes}\n${paymentNotes}`
      : paymentNotes;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: userDetails?.customerId ?? null,
        gst,
        total,
        status: "New",
        notes: mergedNotes
      })
      .select("id")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: orderError?.message ?? "Unable to create order." },
        { status: 500 }
      );
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      cart.map((line) => ({
        order_id: order.id,
        menu_item_id: line.menuItemId,
        name: line.name,
        price: line.price,
        quantity: line.quantity
      }))
    );

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message ?? "Unable to create order items." },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to verify payment." },
      { status: 500 }
    );
  }
}
