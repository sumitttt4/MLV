"use client";

import { useCart } from "@/store/useCart";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const items = useCart((state) => state.items);
    const removeItem = useCart((state) => state.removeItem);
    const updateQuantity = useCart((state) => state.updateQuantity);
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
                className="hidden md:flex fixed bottom-6 right-6 z-40 h-14 w-14 items-center justify-center rounded-full bg-brand-gold shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-transform hover:scale-110 active:scale-95 text-brand-dark md:bottom-8 md:right-8"
            >
                <ShoppingBag className="h-6 w-6" />
                {items.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-cocoa text-xs font-bold text-brand-gold border-2 border-brand-dark">
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
                            className="fixed inset-0 z-50 bg-brand-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            variants={drawerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className={`fixed z-50 bg-brand-tamarind shadow-2xl border-brand-gold/20
                                ${isMobile
                                    ? "bottom-0 left-0 right-0 h-[85vh] rounded-t-[2rem] border-t"
                                    : "right-0 top-0 h-full w-full max-w-md rounded-l-none rounded-t-none border-l bg-brand-cocoa"
                                }`}
                        >
                            <div className="flex h-full flex-col">
                                <div className="flex items-center justify-between border-b border-brand-gold/10 p-6 bg-brand-cocoa/50">
                                    <h2 className="text-2xl font-serif font-bold text-brand-cream">Your Order</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-full p-2 text-brand-cream/60 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    {items.length === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center text-brand-cream/40">
                                            <ShoppingBag className="mb-4 h-16 w-16 opacity-20" />
                                            <p className="font-serif text-lg">Your cart is empty.</p>
                                        </div>
                                    ) : (
                                        <ul className="space-y-6">
                                            {items.map((entry) => (
                                                <li key={entry.item.id} className="flex gap-4">
                                                    <div className="relative h-20 w-20 overflow-hidden rounded-card bg-brand-black/20 shrink-0 border border-brand-gold/10">
                                                        {entry.item.imageUrl ? (
                                                            <Image
                                                                src={entry.item.imageUrl}
                                                                alt={entry.item.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-brand-cream/10">
                                                                <ShoppingBag size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between py-1">
                                                        <div>
                                                            <div className="flex justify-between items-start gap-2">
                                                                <h3 className="font-serif font-bold text-brand-cream text-lg leading-tight">{entry.item.name}</h3>
                                                                <p className="font-bold text-brand-gold shrink-0">₹{entry.item.price * entry.quantity}</p>
                                                            </div>
                                                            <p className="text-sm text-brand-cream/60 mt-1">₹{entry.item.price} per item</p>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between mt-2">
                                                            <div className="flex items-center gap-3 bg-brand-black/20 rounded-lg p-1 border border-brand-gold/10">
                                                                <button 
                                                                    onClick={() => updateQuantity(entry.item.id, Math.max(0, entry.quantity - 1))}
                                                                    className="w-8 h-8 flex items-center justify-center rounded bg-brand-cocoa text-brand-cream hover:bg-brand-gold hover:text-brand-dark transition-colors text-sm"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="text-sm font-bold text-brand-gold w-4 text-center">{entry.quantity}</span>
                                                                <button 
                                                                    onClick={() => updateQuantity(entry.item.id, entry.quantity + 1)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded bg-brand-gold text-brand-dark hover:bg-brand-cream transition-colors text-sm"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeItem(entry.item.id)}
                                                                className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-400 transition-colors"
                                                            >
                                                                <Trash2 size={12} />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="border-t border-brand-gold/10 bg-brand-cocoa/80 p-6 backdrop-blur-md">
                                    <div className="mb-6 space-y-2">
                                        <div className="flex items-center justify-between text-sm text-brand-cream/60">
                                            <span>Subtotal</span>
                                            <span>₹{total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xl font-serif font-bold text-brand-gold pt-2 border-t border-brand-gold/10">
                                            <span>Total</span>
                                            <span>₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href="/checkout"
                                        onClick={() => setIsOpen(false)}
                                        className={`flex w-full items-center justify-center rounded-xl bg-brand-gold py-4 font-bold text-brand-dark uppercase tracking-widest shadow-lg shadow-brand-gold/20 transition-all hover:bg-brand-cream hover:scale-[1.02] active:scale-[0.98] ${items.length === 0 ? 'pointer-events-none opacity-50 grayscale' : ''}`}
                                    >
                                        Checkout
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
