"use client";

import { useCart } from "@/store/useCart";
import { X, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const items = useCart((state) => state.items);
    const removeItem = useCart((state) => state.removeItem);
    const total = useCart((state) => state.getTotal());

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const drawerVariants = {
        hidden: isMobile ? { y: "100%" } : { x: "100%" },
        visible: isMobile ? { y: 0 } : { x: 0 }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-maroon shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-transform hover:scale-110 active:scale-95 border-2 border-brand-gold md:bottom-8 md:right-8"
            >
                <ShoppingBag className="h-6 w-6 text-brand-gold" />
                {items.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-brand-maroon">
                        {items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                        />
                        <motion.div
                            variants={drawerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={`fixed z-50 bg-white shadow-2xl
                                ${isMobile
                                    ? "bottom-0 left-0 right-0 h-[85vh] rounded-t-[2rem]"
                                    : "right-0 top-0 h-full w-full max-w-sm rounded-l-none rounded-t-none border-l border-brand-gold/10"
                                }`}
                        >
                            <div className="flex h-full flex-col">
                                <div className="flex items-center justify-between border-b border-brand-maroon/10 p-4">
                                    <h2 className="text-xl font-bold text-brand-maroon">Your Order</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-full p-2 text-brand-maroon/60 hover:bg-brand-maroon/5 hover:text-brand-maroon"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    {items.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center text-brand-maroon/50">
                                            <ShoppingBag className="mb-4 h-12 w-12 opacity-20" />
                                            <p>Your cart is empty.</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-4">
                                            {items.map((entry) => (
                                                <li key={entry.item.id} className="flex gap-4">
                                                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                                                        {entry.item.imageUrl && (
                                                            <Image
                                                                src={entry.item.imageUrl}
                                                                alt={entry.item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-brand-maroon">{entry.item.name}</h3>
                                                            <p className="text-sm text-brand-maroon/60">₹{entry.item.price} x {entry.quantity}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(entry.item.id)}
                                                            className="self-start text-xs font-medium text-red-500 hover:text-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                    <p className="font-semibold text-brand-gold">₹{entry.item.price * entry.quantity}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="border-t border-brand-maroon/10 bg-brand-cream/30 p-4">
                                    <div className="mb-4 flex items-center justify-between text-lg font-bold text-brand-maroon">
                                        <span>Total (incl. GST)</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                    <Link
                                        href="/checkout"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex w-full items-center justify-center rounded-xl bg-brand-maroon py-3 font-semibold text-brand-gold transition hover:opacity-90 active:scale-[0.98] ${items.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
                                    >
                                        Proceed to Checkout
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
