"use client";

import { useCart } from "@/store/useCart";
import { useCartDrawer } from "@/store/useCartDrawer";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function MobileCartFab() {
    const items = useCart((s) => s.items);
    const getTotal = useCart((s) => s.getTotal);
    const openDrawer = useCartDrawer((s) => s.open);
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
                    className="fixed bottom-4 left-4 right-4 z-50 md:hidden safe-area-bottom"
                >
                    <button onClick={openDrawer} className="w-full">
                        <div className="flex items-center justify-between rounded-2xl bg-brand-maroon p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-md min-h-[56px]">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <ShoppingBag size={20} className="text-brand-gold" />
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-bold text-brand-dark">
                                        {totalItems}
                                    </span>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/60">
                                        {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                                    </span>
                                    <span className="font-serif text-lg font-bold text-brand-gold leading-tight">
                                        {formatCurrency(totalPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl bg-brand-gold px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-brand-dark shadow-lg transition-transform active:scale-95">
                                View Cart <ArrowRight size={14} />
                            </div>
                        </div>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
