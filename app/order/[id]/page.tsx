"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/api";
import { CheckCircle2, ChefHat, Truck, PackageCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues
const DeliveryMap = dynamic(() => import("@/components/ui/DeliveryMap").then(mod => mod.DeliveryMap), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full animate-pulse bg-white/10" />
});

type OrderStatus = "New" | "Preparing" | "Ready" | "Completed";

const statusSteps = [
  { id: "New", label: "Order Placed", icon: CheckCircle2, description: "We've received your order" },
  { id: "Preparing", label: "In Kitchen", icon: ChefHat, description: "Chefs are working their magic" },
  { id: "Ready", label: "Ready to Serve", icon: PackageCheck, description: "Plating up perfection" },
  { id: "Completed", label: "Completed", icon: Truck, description: "Enjoy your meal!" },
];

export default function OrderTrackingPage() {
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
    <main className="min-h-screen bg-brand-dark bg-hero-texture text-brand-cream relative pt-36">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-[2px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col-reverse gap-8 px-6 py-20 lg:flex-row lg:items-start">

        {/* Left Column: Status Timeline */}
        <section className="flex-1 space-y-8">
          <div className="rounded-3xl border border-brand-gold/10 bg-brand-dark/50 p-8 shadow-2xl backdrop-blur-md">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-brand-gold">Order Status</h1>
                <p className="text-sm text-brand-cream/60">Order ID: #{orderId.slice(0, 8)}</p>
              </div>
              <div className="rounded-full bg-brand-gold/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-gold border border-brand-gold/20">
                {status}
              </div>
            </div>

            <div className="relative ml-4 space-y-12 border-l-2 border-white/5 pl-8">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative ${isCompleted ? 'opacity-100' : 'opacity-30'}`}
                  >
                    <div className={`absolute -left-[2.6rem] top-0 box-content flex h-8 w-8 items-center justify-center rounded-full border-4 border-brand-dark ${isCompleted ? 'bg-brand-gold text-brand-dark shadow-[0_0_15px_rgba(197,160,89,0.5)]' : 'bg-white/10 text-white/30'}`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className={`font-serif font-bold ${isCurrent ? 'text-xl text-brand-gold' : 'text-lg text-brand-cream'}`}>{step.label}</h3>
                      <p className="text-sm text-brand-cream/60">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-gold hover:text-white transition-colors"
            >
              <span>← Back to Home</span>
            </Link>
          </div>
        </section>

        {/* Right Column: Map & Delivery Info */}
        <aside className="w-full max-w-lg space-y-6">
          <div className="overflow-hidden rounded-3xl border border-brand-gold/10 bg-brand-cream shadow-2xl">
            <DeliveryMap />
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-maroon/60">Estimated Arrival</p>
                  <h2 className="font-serif text-3xl font-bold text-brand-maroon">13-20 Mins</h2>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-maroon/60">Distance</p>
                  <h2 className="font-serif text-xl font-bold text-brand-maroon">2.4 km</h2>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-brand-gold/10 bg-brand-dark/50 p-6 backdrop-blur-md">
            <div className="h-14 w-14 rounded-full bg-white/10 p-1">
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&q=80" alt="Driver" className="h-full w-full rounded-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-lg font-bold text-brand-gold">Rahul Kumar</h4>
              <p className="text-xs text-brand-cream/60">Your Delivery Partner</p>
            </div>
            <div className="flex gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors">
                <span className="text-lg">📞</span>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-colors">
                <span className="text-lg">💬</span>
              </button>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
