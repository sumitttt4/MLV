"use client";

import { useEffect, useState } from "react";
import { X, Download, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return;

        // Check if already in standalone mode
        const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;
        if (isStandalone) return;

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Wait a bit before showing to not be intrusive immediately
            setTimeout(() => setIsVisible(true), 3000);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            setDeferredPrompt(null);
        }
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] md:hidden"
                >
                    <div className="rounded-t-3xl border-t border-brand-gold/20 bg-brand-dark/95 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                        <div className="mb-2 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-maroon shadow-lg ring-2 ring-brand-gold/20">
                                    <span className="font-serif text-2xl font-bold text-brand-gold">M</span>
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg font-bold text-brand-gold">Hotel MLV Grand</h3>
                                    <p className="text-xs text-brand-cream/60">Install for faster ordering experience</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="rounded-full bg-white/5 p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={handleInstallClick}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-3 text-sm font-bold uppercase tracking-wider text-brand-dark shadow-lg transition-transform active:scale-95"
                            >
                                <Download size={16} />
                                Add to Home Screen
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
