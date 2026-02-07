import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

export async function POST(request: Request) {
  try {
    const { amount } = (await request.json()) as { amount: number };

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount." },
        { status: 400 }
      );
    }

    // Mock Mode Check
    if (
      !process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID.includes("placeholder")
    ) {
      // Return a mock order
      return NextResponse.json({
        orderId: `order_mock_${shortid.generate()}`,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_mock_key"
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID ?? "",
      key_secret: process.env.RAZORPAY_KEY_SECRET ?? ""
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: shortid.generate()
    });

    return NextResponse.json({
      orderId: order.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ""
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { error: "Unable to create Razorpay order." },
      { status: 500 }
    );
  }
}
