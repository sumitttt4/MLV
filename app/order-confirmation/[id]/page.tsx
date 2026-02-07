"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/api";
import { CheckCircle2, ChefHat, Truck, PackageCheck, Clock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type OrderStatus = "New" | "Preparing" | "Ready" | "Completed";

const statusSteps = [
    { id: "New", label: "Order Placed", icon: CheckCircle2, description: "We've received your order" },
    { id: "Preparing", label: "In Kitchen", icon: ChefHat, description: "Chefs are working their magic" },
    { id: "Ready", label: "Ready to Serve", icon: PackageCheck, description: "Plating up perfection" },
    { id: "Completed", label: "Completed", icon: Truck, description: "Enjoy your meal!" },
];

export default function OrderConfirmationPage() {
    const { id } = useParams();
    const [status, setStatus] = useState<OrderStatus>("New");
    const [orderId, setOrderId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        // Initial fetch
        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("status, id")
                .eq("id", id)
                .single();

            if (data) {
                setStatus(data.status as OrderStatus);
                setOrderId(data.id);
                setLoading(false);
            }
        };

        fetchOrder();

        // Subscribe to realtime updates
        const channel = supabase
            .channel(`order-${id}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "orders",
                    filter: `id=eq.${id}`
                },
                (payload) => {
                    setStatus(payload.new.status as OrderStatus);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const currentStepIndex = statusSteps.findIndex(s => s.id === status);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-brand-cream p-4 text-brand-maroon">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Order Confirmed!</h1>
                    <p className="text-sm opacity-60">Order ID: {orderId.slice(0, 8)}...</p>
                </div>

                <div className="relative space-y-8 pl-8 before:absolute before:bottom-2 before:left-[2.1rem] before:top-2 before:w-0.5 before:bg-brand-maroon/10">
                    {statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative ${isCompleted ? 'opacity-100' : 'opacity-40'}`}
                            >
                                <div className={`absolute -left-[2.6rem] z-10 box-content flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${isCompleted ? 'bg-brand-gold text-brand-maroon' : 'bg-gray-200 text-gray-400'}`}>
                                    <step.icon className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${isCurrent ? 'text-lg text-brand-maroon' : 'text-base'}`}>{step.label}</h3>
                                    <p className="text-xs text-brand-maroon/60">{step.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-10 border-t border-brand-maroon/10 pt-6 text-center">
                    <Link
                        href="/"
                        className="inline-block rounded-full bg-brand-maroon px-8 py-3 text-sm font-semibold text-brand-gold transition hover:bg-brand-maroon/90"
                    >
                        Start New Order
                    </Link>
                </div>
            </div>
        </main>
    );
}
