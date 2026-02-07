import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            console.error("RAZORPAY_KEY_SECRET is not defined");
            return NextResponse.json(
                { success: false, error: "Server misconfiguration" },
                { status: 500 }
            );
        }

        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            return NextResponse.json({ success: true });
        } else {
            console.error("Invalid Razorpay Signature", {
                received: razorpay_signature,
                generated: generated_signature,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            });
            return NextResponse.json(
                { success: false, error: "Invalid Signature" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying payment", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
