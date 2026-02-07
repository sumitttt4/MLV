"use client";

import { useCart } from "@/store/useCart";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function MobileCartFab() {
    const { items, getTotal } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = getTotal();

    return (
        <AnimatePresence>
            {totalItems > 0 && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 left-4 right-4 z-40 md:hidden"
                >
                    <Link href="/checkout">
                        <div className="flex items-center justify-between rounded-2xl bg-brand-maroon p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-md">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/60">
                                    {totalItems} Items
                                </span>
                                <span className="font-serif text-lg font-bold text-brand-gold">
                                    {formatCurrency(totalPrice)}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                                View Cart <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
